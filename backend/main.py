from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
import os
from inference_utils import SimpleUNet, DroughtLSTM, get_wildfire_input, get_drought_input

app = FastAPI()

# --- CORS Configuration (CRITICAL for React) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Load Models ---
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")

# Initialize Models
wildfire_model = SimpleUNet(in_channels=3, out_channels=1).to(DEVICE)
drought_model = DroughtLSTM().to(DEVICE)

# Load Weights (Wrap in try/except to prevent crash if file missing)
try:
    wildfire_model.load_state_dict(torch.load(os.path.join(MODEL_DIR, "unet_3ch_final.pth"), map_location=DEVICE))
    wildfire_model.eval()
    print("✅ Wildfire Model Loaded")
except Exception as e:
    print(f"⚠️ Wildfire Model Error: {e}")

try:
    drought_model.load_state_dict(torch.load(os.path.join(MODEL_DIR, "drought_lstm.pth"), map_location=DEVICE))
    drought_model.eval()
    print("✅ Drought Model Loaded")
except Exception as e:
    print(f"⚠️ Drought Model Error: {e}")

# --- API Inputs ---
class Coords(BaseModel):
    lat: float
    lng: float

# --- Endpoints ---
@app.post("/predict/wildfire")
async def predict_fire(data: Coords):
    # Get Input Tensor (Mocked or Real)
    input_tensor = get_wildfire_input(data.lat, data.lng).to(DEVICE)
    
    with torch.no_grad():
        pred = wildfire_model(input_tensor)
        prob = torch.sigmoid(pred).max().item() # Get max probability in the chip
        
    status = "High Risk" if prob > 0.7 else "Moderate" if prob > 0.3 else "Low Risk"
    return {"risk_score": f"{prob*100:.1f}%", "status": status}

@app.post("/predict/drought")
async def predict_drought_api(data: Coords):
    input_tensor = get_drought_input(data.lat, data.lng).to(DEVICE)
    
    with torch.no_grad():
        pred = drought_model(input_tensor).item()
        
    alert = "Severe Drought" if pred < 0.2 else "Healthy"
    return {"moisture": f"{pred:.3f}", "alert": alert}