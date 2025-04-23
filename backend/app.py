from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
import uuid
from datetime import datetime

# === Flask App 初始化 ===
app = Flask(__name__)

# === 上傳設定 ===
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['ALLOWED_EXTENSIONS'] = {'txt'}

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# === 模擬資料庫 ===
analysis_db = {}  # 儲存分析資訊
history_db = []   # 儲存歷史記錄

# === 工具函式 ===
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# === API 路由 ===
@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"message": "未找到文件"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"message": "未選擇文件"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        analysis_id = str(uuid.uuid4())
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{analysis_id}_{filename}")
        file.save(file_path)

        # 建立分析記錄
        analysis_db[analysis_id] = {
            "file_path": file_path,
            "filename": filename,
            "upload_time": datetime.now().isoformat(),
            "status": "uploaded",
            "species_result": None,
            "resistance_result": None
        }

        # 儲存到歷史記錄
        history_db.append({
            "id": analysis_id,
            "filename": filename,
            "upload_time": datetime.now().isoformat(),
            "status": "uploaded"
        })

        return jsonify({"message": "上傳成功", "analysis_id": analysis_id}), 201

    return jsonify({"message": "不支援的檔案類型"}), 400

@app.route('/api/analysis/<analysis_id>/status', methods=['GET'])
def check_status(analysis_id):
    if analysis_id not in analysis_db:
        return jsonify({"message": "找不到分析"}), 404

    analysis = analysis_db[analysis_id]
    elapsed = (datetime.now() - datetime.fromisoformat(analysis["upload_time"])).total_seconds()

    if elapsed > 5 and analysis["status"] == "uploaded":
        analysis["status"] = "species_analysis_complete"
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

    elif elapsed > 10 and analysis["status"] == "species_analysis_complete":
        analysis["status"] = "resistance_analysis_complete"
        analysis["resistance_result"] = {
            "antibiotics": {
                "AMC": 80, "CAZ": 90, "CIP": 10, "CRO": 85, "CXM": 20
            }
        }

    return jsonify({
        "status": analysis["status"],
        "species_result": analysis["species_result"],
        "resistance_result": analysis["resistance_result"]
    }), 200

@app.route('/api/history', methods=['GET'])
def get_history():
    return jsonify(history_db), 200

# === 啟動應用 ===
if __name__ == '__main__':
    app.run(debug=True)
