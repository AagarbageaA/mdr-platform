import torch 
import numpy as np
import torch.nn as nn
import pandas as pd

# 類別對應字典
label_to_species = {
    0: 'Enterobacter aerogenes',
    1: 'Enterobacter cloacae',
    2: 'Enterococcus faecium',
    3: 'Klebsiella pneumoniae',
    4: 'Pseudomonas aeruginosa',
    5: 'Staphylococcus aureus'
}
SPECIES_TO_LABEL = {v: k for k, v in label_to_species.items()}

# 讀入 valid_pairs 與 abx_index_map
valid_df = pd.read_csv('db/valid_pairs.csv')  # 應包含 species, antibiotic 欄
abx_df = pd.read_csv('db/abx_index_map.csv')  # 應包含 index, antibiotic 欄

# 建立資料結構
VALID_PAIRS = set(tuple(x) for x in valid_df[['species', 'antibiotic']].values)
ALL_ANTIBIOTICS = sorted(abx_df['antibiotic'].unique().tolist())

# ----------------------------
# 模型結構
# ----------------------------
class PositionalEncoding(nn.Module):
    def __init__(self, d_model, max_len=1500):
        super(PositionalEncoding, self).__init__()
        position = torch.arange(max_len).unsqueeze(1)
        div_term = torch.exp(torch.arange(0, d_model, 2) * (-np.log(10000.0) / d_model))
        pe = torch.zeros(max_len, d_model)
        pe[:, 0::2] = torch.sin(position * div_term)
        pe[:, 1::2] = torch.cos(position * div_term)
        self.pe = pe.unsqueeze(0)

    def forward(self, x):
        return x + self.pe[:, :x.size(1)].to(x.device)

class CNN_Transformer(nn.Module):
    def __init__(self, num_classes=22, dropout_rate=0.5):
        super(CNN_Transformer, self).__init__()
        self.conv1 = nn.Conv1d(1, 32, kernel_size=3, padding=1)
        self.conv2 = nn.Conv1d(32, 64, kernel_size=3, padding=1)
        self.conv3 = nn.Conv1d(64, 128, kernel_size=3, padding=1)
        self.pool = nn.MaxPool1d(2)

        self.pos_encoding = PositionalEncoding(d_model=128, max_len=1600)
        self.transformer_layer = nn.TransformerEncoderLayer(d_model=128, nhead=4)
        self.transformer = nn.TransformerEncoder(self.transformer_layer, num_layers=4)

        self.fc1 = nn.Linear(192128, 512)
        self.dropout = nn.Dropout(dropout_rate)
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
        x = self.dropout(x)
        x = self.fc2(x)
        return x

# ----------------------------
# 模型與預測邏輯
# ----------------------------
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = CNN_Transformer(num_classes=len(ALL_ANTIBIOTICS)).to(device)
model.load_state_dict(torch.load('model_resistance.pth'))
model.eval()

def concate_onehot_encodeing(species, spectrum):
    species_label = SPECIES_TO_LABEL[species]
    species_one_hot = np.zeros(len(SPECIES_TO_LABEL))
    species_one_hot[species_label] = 1
    species_one_hot = species_one_hot.reshape(1, len(SPECIES_TO_LABEL), 1)

    if isinstance(spectrum, torch.Tensor):
        spectrum = spectrum.cpu().numpy()
    if spectrum.ndim == 3:
        spectrum = np.squeeze(spectrum, axis=1)
    spectrum = spectrum.reshape(1, -1, 1)

    concat = np.concatenate([species_one_hot, spectrum], axis=1)
    return torch.tensor(concat, dtype=torch.float32).permute(0, 2, 1)

def predict_resistance(input_tensor):
    input_tensor = input_tensor.to(device)
    with torch.no_grad():
        outputs = model(input_tensor)
        probabilities = torch.sigmoid(outputs)
        predictions = (probabilities > 0.5).int()
    prob_values = tuple(probabilities[0].cpu().numpy())
    pred_values = tuple(predictions[0].cpu().numpy())
    abx_probs = dict(zip(ALL_ANTIBIOTICS, prob_values))
    abx_preds = dict(zip(ALL_ANTIBIOTICS, pred_values))
    return abx_probs, abx_preds

def get_mdr_data(species, spectrum):
    input_tensor = concate_onehot_encodeing(species, spectrum)
    prob_dict, label_dict = predict_resistance(input_tensor)
    resistance_tuples = []
    resistant_abx = []

    for abx in ALL_ANTIBIOTICS:
        if (species, abx) in VALID_PAIRS:
            prob = prob_dict[abx]
            label = label_dict[abx]
            resistance_tuples.append((abx, label, float(prob)))
            if label == 1:
                resistant_abx.append(abx)

    return resistant_abx, resistance_tuples

# ----------------------------
# 主程式
# ----------------------------
import analyze_species
if __name__ == "__main__":
    file_path = r'3755ec08-5951-46f9-b8eb-bcdccc2fd8ba.txt'
    spectrum = analyze_species.read_mass_spectrum(file_path)
    meta_species, meta_probability, species_prob_list = analyze_species.get_species_data(spectrum)
    resistant_list, resistance_info = get_mdr_data(meta_species, spectrum)

    print(f"細菌種類：{meta_species}")
    print(f"\n[1] 對 {len(resistant_list)} 個抗生素具有抗藥性")
    print("[2] 抗藥抗生素：")
    for abx in resistant_list:
        print(f" - {abx}")

    print("\n[3] 各有效抗生素之抗藥性機率：")
    for abx, label, prob in resistance_info:
        print(f" - {abx}: {'抗藥' if label == 1 else '無抗藥'} ({prob:.2f})")
