from flask import Flask, logging, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import uuid
import json
from datetime import datetime
from analyze_species import get_species_data, read_mass_spectrum
from analyze_mdr import get_mdr_data

# === Flask App 初始化 ===
app = Flask(__name__)
CORS(app)
# === 上傳設定 ===
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['ALLOWED_EXTENSIONS'] = {'txt'}
app.config['DB_FOLDER'] = 'db'

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['DB_FOLDER'], exist_ok=True)



# === 工具函式 ===
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def load_history():
    try:
        with open(os.path.join(app.config['DB_FOLDER'], 'history.json'), 'r', encoding='utf-8') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return []

def save_history():
    with open(os.path.join(app.config['DB_FOLDER'], 'history.json'), 'w', encoding='utf-8') as f:
        json.dump(history_db, f, ensure_ascii=False, indent=4)

@app.route('/api/clearHistory', methods=['POST'])
def clear_history():
    global history_db
    history_db = []
    save_history()
    return {"message": "清除成功"}, 200  # 建議回傳一個成功訊息，方便前端判斷

# === API 路由 ===
@app.route('/api/upload', methods=['POST'])
def upload_file():
    print("upload_file()")

    # 檢查是否有文件被上傳
    if 'file' not in request.files:
        print("未找到文件")
        return jsonify({"message": "未找到文件"}), 400

    file = request.files['file']

    # 檢查文件名稱是否為空
    if file.filename == '':
        print("未選擇文件")
        return jsonify({"message": "未選擇文件"}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        analysis_id = str(uuid.uuid4())
        print(f"analysis_id:{analysis_id}")
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{filename}")
        file.save(file_path)

        history_db.append({
            "analysis_id": analysis_id,
            "file_path": file_path,
            "file_name": filename,
            "upload_time": datetime.now().strftime("%Y-%m-%d %H:%M"),
            "species_result": None,
            "resistance_result": None
        })
        save_history()

        return jsonify({
            "message": "上傳成功",
            "analysis_id": analysis_id,
            "file_path": file_path.replace("/", "\\"),
            "species_result": None,
            "resistance_result": None
        }), 201

@app.route('/api/analysis/<analysis_id>/species', methods=['POST'])
def analyze_species(analysis_id):
    analysis = next((a for a in history_db if a["analysis_id"] == analysis_id), None)
    if analysis is None:
        return jsonify({"message": "找不到分析"}), 404

    try:
        input_tensor = read_mass_spectrum(analysis["file_path"])
        meta_species, metaProbability, speciesProbList = get_species_data(input_tensor)

        analysis["status"] = "species_analysis_complete"
        analysis["species_result"] = {
            "species": meta_species,
            "probability": f"{metaProbability:.2f}",
            "chartData": [
                {
                    "label": label,
                    "value": float(prob)
                } for label, prob in speciesProbList
            ]
        }
        print(analysis)
        save_history()
        return jsonify(analysis["species_result"]), 200

    except Exception as e:
        return jsonify({"message": "Species 分析失敗", "error": str(e)}), 500
    
@app.route('/api/analysis/<analysis_id>/resistance', methods=['POST'])
def analyze_resistance(analysis_id):
    print("===============================")
    print("analyze_resistance")
    analysis = next((a for a in history_db if a["analysis_id"] == analysis_id), None)
    print(f"analysis = {analysis}")
    if analysis is None:
        return jsonify({"message": "找不到分析"}), 404

    try:
        if "species_result" not in analysis or "species" not in analysis["species_result"]:
            return jsonify({"message": "尚未進行菌種分析"}), 400

        input_tensor = read_mass_spectrum(analysis["file_path"])
        species = analysis["species_result"]["species"]
        print("species = analysis['species_result']['species']")
        resistant_list, resistanceInfo = get_mdr_data(species, input_tensor)
        print("成功從get_mdr_data()拿到資料")
        # 將資料格式化為前端需要的結構
        resistanceResult = {
            "resistant_antibiotics": [str(abx) for abx in resistant_list],
            "resistance_tuples": [
                {
                    "antibiotic": str(abx),
                    "label": int(label),
                    "prob": float(prob)
                }
                for abx, label, prob in resistanceInfo
            ],
            "chartData": [
                {
                    "label": str(abx),
                    "value": round(float(prob) * 100, 2)
                }
                for abx, _, prob in resistanceInfo
            ]
        }

        analysis["resistance_result"] = resistanceResult
        print(f"細菌種類：{species}")
        print(f"\n[1] 對 {len(resistant_list)} 個抗生素具有抗藥性")
        print("[2] 抗藥抗生素：")
        for abx in resistant_list:
            print(f" - {abx}")

        print("\n[3] 各有效抗生素之抗藥性機率：")
        for abx, label, prob in resistanceInfo:
            print(f" - {abx}: {'抗藥' if label == 1 else '無抗藥'} ({prob:.2f})")
        save_history()
        return jsonify(resistanceResult), 200

    except Exception as e:
        return jsonify({"message": "Resistance 分析失敗", "error": str(e)}), 500


    
@app.route('/api/analysis/<analysis_id>/status', methods=['GET'])
def check_status(analysis_id):
    # 從 history_db（list）中尋找對應的分析紀錄
    analysis = next((item for item in history_db if analysis_id in item["file_path"]), None)
    
    if analysis is None:
        return jsonify({"message": "找不到分析"}), 404

    # 回傳實際儲存的分析狀態與結果
    return jsonify({
        "status": analysis["status"],
        "species_result": analysis["species_result"],
        "resistanceResult": analysis["resistanceResult"]
    }), 200



@app.route('/api/history', methods=['GET'])
def get_history():
    # 加載歷史記錄並返回
    return jsonify(history_db), 200


# === 啟動應用 ===
if __name__ == '__main__':
    from analyze_mdr import CNN_Transformer
    # 載入歷史資料
    # history_db = []
    history_db = load_history()
    app.run(debug=True)
