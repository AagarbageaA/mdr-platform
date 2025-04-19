from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import uuid
import jwt
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
import time

app = Flask(__name__)
CORS(app)  # 允許跨域請求，方便前端開發

# 配置項
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['ALLOWED_EXTENSIONS'] = {'txt'}
app.config['SECRET_KEY'] = 'your_secret_key'  # 實際使用時應使用環境變數

# 確保上傳資料夾存在
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# 儲存分析資料的內存資料庫 (實際應用中使用真實資料庫)
analysis_db = {}
history_db = {}
user_db = {
    "user1": {
        "password": "password1",
        "history": []
    }
}

def allowed_file(filename):
    """檢查檔案副檔名是否被允許"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def authenticate_token():
    """驗證JWT令牌"""
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return None
    
    try:
        token = auth_header.split(" ")[1]
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
        return data['username']
    except:
        return None

@app.route('/api/upload', methods=['POST'])
def upload_file():
    """上傳文件接口"""
    # 檢查是否有文件
    if 'file' not in request.files:
        return jsonify({"message": "未找到文件"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"message": "未選擇文件"}), 400
    
    if file and allowed_file(file.filename):
        # 生成安全的文件名
        filename = secure_filename(file.filename)
        # 生成分析ID
        analysis_id = str(uuid.uuid4())
        
        # 保存文件
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{analysis_id}_{filename}")
        file.save(file_path)
        
        # 記錄分析資訊
        analysis_db[analysis_id] = {
            "file_path": file_path,
            "filename": filename,
            "upload_time": datetime.now().isoformat(),
            "status": "uploaded",
            "species_result": None,
            "resistance_result": None
        }
        
        # 啟動分析任務（這裡只是模擬，實際應用可能使用異步任務）
        # 在實際應用中，這裡應該調用機器學習模型進行分析
        # 為模擬起見，我們使用一個定時器來模擬分析過程
        def start_analysis(analysis_id):
            # 在實際應用中，這裡應該啟動實際的分析任務
            pass
        
        # 啟動分析
        start_analysis(analysis_id)
        
        # 記錄到用戶歷史（如果用戶已登入）
        username = authenticate_token()
        if username and username in user_db:
            if analysis_id not in user_db[username]["history"]:
                user_db[username]["history"].append(analysis_id)
        
        return jsonify({
            "message": "文件上傳成功",
            "analysis_id": analysis_id
        }), 201
    
    return jsonify({"message": "不支援的文件類型"}), 400

@app.route('/api/analysis/<analysis_id>/status', methods=['GET'])
def check_status(analysis_id):
    """檢查分析狀態"""
    if analysis_id not in analysis_db:
        return jsonify({"message": "未找到該分析"}), 404
    
    analysis = analysis_db[analysis_id]
    
    # 模擬分析進度
    if analysis["status"] == "uploaded":
        # 模擬分析需要時間
        upload_time = datetime.fromisoformat(analysis["upload_time"])
        elapsed = (datetime.now() - upload_time).total_seconds()
        
        if elapsed > 5:  # 假設5秒後菌種分析完成
            analysis["status"] = "species_analysis_complete"
            # 模擬菌種分析結果
            analysis["species_result"] = {
                "species": "K. pneumoniae",
                "probability": 86,
                "other_species": {
                    "A. baumannii": 30,
                    "E. faecium": 20,
                    "S. aureus": 15,
                    "P. aeruginosa": 10
                }
            }
        else:
            analysis["status"] = "species_analyzing"
    
    elif analysis["status"] == "species_analysis_complete":
        upload_time = datetime.fromisoformat(analysis["upload_time"])
        elapsed = (datetime.now() - upload_time).total_seconds()
        
        if elapsed > 10:  # 假設10秒後抗藥性分析完成
            analysis["status"] = "resistance_analysis_complete"
            # 模擬抗藥性分析結果
            analysis["resistance_result"] = {
                "antibiotics": {
                    "AMC": 80,  # 抗藥性百分比
                    "CAZ": 90,
                    "CIP": 10,
                    "CRO": 85,
                    "CXM": 20
                }
            }
        else:
            analysis["status"] = "resistance_analyzing"
    
    return jsonify({
        "status": analysis["status"],
        "species_result": analysis["species_result"],
        "resistance_result": analysis["resistance_result"]
    }), 200

@app.route('/api/analysis/<analysis_id>/species', methods=['GET'])
def get_species_result(analysis_id):
    """獲取菌種分析結果"""
    if analysis_id not in analysis_db:
        return jsonify({"message": "未找到該分析"}), 404
    
    analysis = analysis_db[analysis_id]
    
    if analysis["status"] in ["uploaded", "species_analyzing"]:
        return jsonify({"message": "菌種分析尚未完成"}), 400
    
    return jsonify(analysis["species_result"]), 200

@app.route('/api/analysis/<analysis_id>/resistance', methods=['GET'])
def get_resistance_result(analysis_id):
    """獲取抗藥性分析結果"""
    if analysis_id not in analysis_db:
        return jsonify({"message": "未找到該分析"}), 404
    
    analysis = analysis_db[analysis_id]
    
    if analysis["status"] != "resistance_analysis_complete":
        return jsonify({"message": "抗藥性分析尚未完成"}), 400
    
    return jsonify(analysis["resistance_result"]), 200

@app.route('/api/species-features/<analysis_id>', methods=['GET'])
def get_species_features(analysis_id):
    """獲取菌種特徵圖像"""
    if analysis_id not in analysis_db:
        return jsonify({"message": "未找到該分析"}), 404
    
    # 實際應用中，這裡應該從模型獲取真實的特徵圖像
    # 這裡返回模擬數據
    return jsonify({
        "pseudoIonImage": "/mock-data/pseudo-ion-image.png",
        "msSpectrumImage": "/mock-data/ms-spectrum-image.png"
    }), 200

@app.route('/api/resistance-features/<analysis_id>', methods=['GET'])
def get_resistance_features(analysis_id):
    """獲取抗藥性特徵圖像"""
    if analysis_id not in analysis_db:
        return jsonify({"message": "未找到該分析"}), 404
    
    # 實際應用中，這裡應該從模型獲取真實的特徵圖像
    # 這裡返回模擬數據
    return jsonify({
        "pseudoIonImage": "/mock-data/resistance-pseudo-ion-image.png",
        "msSpectrumImage": "/mock-data/resistance-ms-spectrum-image.png"
    }), 200

@app.route('/api/login', methods=['POST'])
def login():
    """用戶登入"""
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({"message": "缺少帳號或密碼"}), 400
    
    username = data.get('username')
    password = data.get('password')
    
    if username not in user_db or user_db[username]["password"] != password:
        return jsonify({"message": "帳號或密碼錯誤"}), 401
    
    # 生成JWT令牌
    token = jwt.encode({
        'username': username,
        'exp': datetime.utcnow() + timedelta(hours=24)
    }, app.config['SECRET_KEY'], algorithm="HS256")
    
    return jsonify({"token": token}), 200

@app.route('/api/history', methods=['GET'])
def get_history():
    """獲取用戶歷史分析記錄"""
    username = authenticate_token()
    
    if not username:
        return jsonify({"message": "未登入"}), 401
    
    if username not in user_db:
        return jsonify({"message": "找不到用戶"}), 404
    
    user_history = []
    for analysis_id in user_db[username]["history"]:
        if analysis_id in analysis_db:
            analysis = analysis_db[analysis_id]
            user_history.append({
                "id": analysis_id,
                "filename": analysis["filename"],
                "upload_time": analysis["upload_time"],
                "status": analysis["status"],
                "species": analysis["species_result"]["species"] if analysis["species_result"] else None,
                "has_resistance_result": analysis["status"] == "resistance_analysis_complete"
            })
    
    return jsonify(user_history), 200

@app.route('/api/simulate-upload', methods=['POST'])
def simulate_upload():
    """模擬上傳文件並完成分析（用於開發測試）"""
    # 生成分析ID
    analysis_id = str(uuid.uuid4())
    
    # 記錄分析資訊
    analysis_db[analysis_id] = {
        "file_path": "simulated_path",
        "filename": "simulated_data.txt",
        "upload_time": datetime.now().isoformat(),
        "status": "resistance_analysis_complete",
        "species_result": {
            "species": "K. pneumoniae",
            "probability": 86,
            "other_species": {
                "A. baumannii": 30,
                "E. faecium": 20,
                "S. aureus": 15,
                "P. aeruginosa": 10
            }
        },
        "resistance_result": {
            "antibiotics": {
                "AMC": 80,
                "CAZ": 90,
                "CIP": 10,
                "CRO": 85,
                "CXM": 20
            }
        }
    }
    
    # 記錄到用戶歷史（如果用戶已登入）
    username = authenticate_token()
    if username and username in user_db:
        if analysis_id not in user_db[username]["history"]:
            user_db[username]["history"].append(analysis_id)
    
    return jsonify({
        "message": "模擬上傳成功",
        "analysis_id": analysis_id
    }), 201

@app.route('/api/register', methods=['POST'])
def register():
    """用戶註冊"""
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({"message": "缺少帳號或密碼"}), 400
    
    username = data.get('username')
    password = data.get('password')
    
    if username in user_db:
        return jsonify({"message": "使用者名稱已存在"}), 409
    
    # 註冊新用戶
    user_db[username] = {
        "password": password,
        "history": []
    }
    
    return jsonify({"message": "註冊成功"}), 201

@app.route('/api/profile', methods=['GET'])
def get_profile():
    """獲取用戶資料"""
    username = authenticate_token()
    
    if not username:
        return jsonify({"message": "未登入"}), 401
    
    if username not in user_db:
        return jsonify({"message": "找不到用戶"}), 404
    
    return jsonify({
        "username": username,
        "analysis_count": len(user_db[username]["history"])
    }), 200

@app.route('/api/mock-data', methods=['GET'])
def get_mock_data():
    """返回模擬資料（用於前端開發）"""
    mock_species_result = {
        "species": "K. pneumoniae",
        "probability": 86,
        "other_species": {
            "A. baumannii": 30,
            "E. faecium": 20,
            "S. aureus": 15,
            "P. aeruginosa": 10
        }
    }
    
    mock_resistance_result = {
        "antibiotics": {
            "AMC": 80,
            "CAZ": 90,
            "CIP": 10,
            "CRO": 85,
            "CXM": 20
        }
    }
    
    return jsonify({
        "species_result": mock_species_result,
        "resistance_result": mock_resistance_result
    }), 200

if __name__ == '__main__':
    app.run(debug=True)