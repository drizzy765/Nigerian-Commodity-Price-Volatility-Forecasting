from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib

app = FastAPI(title="Commodity Volatility Forecasting API")

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock Model Loading (replace with actual paths when ready)
def load_models():
    print("Loading random_forest.pkl, pca_model.pkl, and scaler.pkl...")
    # rf_model = joblib.load("random_forest.pkl")
    # pca = joblib.load("pca_model.pkl")
    # scaler = joblib.load("scaler.pkl")
    return None, None, None

rf_model, pca, scaler = load_models()

class MacroInputs(BaseModel):
    Brent_Crude: float
    US_10Y_Yield: float
    Official_FX: float
    Parallel_FX: float
    CPI_YoY: float
    M2_NGN: float

@app.post("/predict")
async def predict_volatility(inputs: MacroInputs):
    # In production, you would scale and PCA-transform the inputs here,
    # and then feed them into your loaded Random Forest model.
    # For now, we simulate the structured response based on the scorecard.
    
    return {
        "forecasts": {
            "Diesel": {"volatility_pct": 2.5, "accuracy_rating": "High"},
            "Maize": {"volatility_pct": 6.1, "accuracy_rating": "Low"},
            "Rice": {"volatility_pct": 5.8, "accuracy_rating": "Negative"},
            "PMS": {"volatility_pct": 12.4, "accuracy_rating": "Failed"}
        },
        "pms_regime_warning": True
    }
