import torch
import numpy as np
import torch.nn as nn

# 類別對應字典
label_to_species = {
    0: 'Enterobacter aerogenes',
    1: 'Enterobacter cloacae',
    2: 'Enterococcus faecium',
    3: 'Klebsiella pneumoniae',
    4: 'Pseudomonas aeruginosa',
    5: 'Staphylococcus aureus'
}

# 定義模型結構 (與之前相同)
class PositionalEncoding(nn.Module):
    def __init__(self, d_model, max_len=6001):
        super(PositionalEncoding, self).__init__()
        position = torch.arange(max_len).unsqueeze(1)
        div_term = torch.exp(torch.arange(0, d_model, 2) * (-np.log(10000.0) / d_model))
        pe = torch.zeros(max_len, d_model)
        pe[:, 0::2] = torch.sin(position * div_term)
        pe[:, 1::2] = torch.cos(position * div_term)
        self.pe = pe.unsqueeze(0)

    def forward(self, x):
        return x + self.pe[:, :x.size(1)].to(x.device)

class CNN_Transformer1(nn.Module):
    def __init__(self, num_classes=6):
        super(CNN_Transformer1, self).__init__()
        self.conv1 = nn.Conv1d(in_channels=1, out_channels=32, kernel_size=3, padding=1)
        self.conv2 = nn.Conv1d(in_channels=32, out_channels=64, kernel_size=3, padding=1)
        self.conv3 = nn.Conv1d(in_channels=64, out_channels=128, kernel_size=3, padding=1)
        self.pool = nn.MaxPool1d(2)

        self.pos_encoding = PositionalEncoding(d_model=128, max_len=6001//4)
        self.transformer_layer = nn.TransformerEncoderLayer(d_model=128, nhead=4)
        self.transformer = nn.TransformerEncoder(self.transformer_layer, num_layers=4)

        self.fc1 = nn.Linear(128 * (6001 // 4), 512)
        self.fc2 = nn.Linear(512, num_classes)

    def forward(self, x):
        x = torch.relu(self.conv1(x))
        x = self.pool(x)
        x = torch.relu(self.conv2(x))
        x = self.pool(x)
        x = torch.relu(self.conv3(x))

        x = x.permute(0, 2, 1)
        x = self.pos_encoding(x)
        x = self.transformer(x)

        x = x.flatten(1)
        x = torch.relu(self.fc1(x))
        x = self.fc2(x)
        return x

# 載入訓練過的模型
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = CNN_Transformer1(num_classes=6).to(device)
model.load_state_dict(torch.load('model_species.pth'))  # 載入訓練過的模型
model.eval()

# 讀取質譜數據並轉換為適合模型的格式
def read_mass_spectrum(file_path):
    # 使用 open() 讀取文件，並跳過第一行
    with open(file_path, "r") as f:
        lines = f.readlines()[1:]  # 忽略第一行
        
        # 提取每行的第二列作為 binned_intensity
        spectrum = np.zeros(6001)  # 初始化一個大小為 6001 的向量來存儲結果
        
        for line in lines:
            if line.strip():  # 忽略空行
                # 拆分每一行，並取出 bin_index 和 binned_intensity
                parts = line.split()
                bin_index = int(parts[0])  # 假設第一列是 bin_index
                binned_intensity = float(parts[1])  # 假設第二列是 binned_intensity
                
                # 只將 binned_intensity 填充進對應的 bin_index
                if 0 <= bin_index < 6001:  # 確保 bin_index 在有效範圍內
                    spectrum[bin_index] = binned_intensity
    
    # 轉換為 PyTorch tensor 並增加 batch 維度
    input_tensor = torch.tensor(spectrum, dtype=torch.float32).unsqueeze(0).unsqueeze(0)  # (1, 1, 6001)
    SPECTRUM_MEAN = 0.00022746340459695703
    SPECTRUM_STD = 0.0006194143237205431
    input_tensor = (input_tensor - SPECTRUM_MEAN) / SPECTRUM_STD
    return input_tensor

# 預測函數
def predict_species(input_tensor):
    input_tensor = input_tensor.to(device)
    with torch.no_grad():
        prediction = model(input_tensor)
    softmax_output = torch.softmax(prediction, dim=1)
    return softmax_output

# 主程序
def test():
    file_path = r'original_data\DRIAMS_A\binned_6000\2015\3755ec08-5951-46f9-b8eb-bcdccc2fd8ba.txt'  # 修改為你的檔案路徑
    input_tensor = read_mass_spectrum(file_path)
    
    # 預測結果
    prediction = predict_species(input_tensor)
    print(prediction)
    # 處理預測結果
    prediction_label = torch.argmax(prediction, dim=1).item()  # 獲取預測類別數字
    predicted_species = label_to_species[prediction_label]  # 使用字典轉換為菌名
    
    print(f"預測結果：{predicted_species}")

def get_species_data(input_tensor):
    # 取得模型的輸出 logits
    mean, std=(0.0002275178577860359, 0.0006199651479793759)
    input_tensor = (input_tensor - mean) / std
    logits = predict_species(input_tensor)  # shape: [1, num_classes]
    probabilities = torch.nn.functional.softmax(logits, dim=1).squeeze()  # shape: [num_classes]
    
    # 將每個 class 的機率與對應菌種組成 tuple list
    prob_list = probabilities.tolist()
    species_prob_list = [
        (label_to_species[i], round(prob_list[i], 3)) for i in range(len(prob_list))
    ]
    
    # 依照機率排序 (由高到低)
    species_prob_list.sort(key=lambda x: x[1], reverse=True)
    
    # 取前1個當代表答案
    meta_species = species_prob_list[0][0]
    meta_probability = species_prob_list[0][1]
    
    return meta_species, meta_probability, species_prob_list
if __name__ == "__main__":
    # test()
    file_path = r'3755ec08-5951-46f9-b8eb-bcdccc2fd8ba.txt'  # 修改為你的檔案路徑
    input_tensor = read_mass_spectrum(file_path)
    # meta_species, meta_probability, species_prob_list=get_species_data(input_tensor)
    print(get_species_data(input_tensor))