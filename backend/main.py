from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow requests from your Next.js dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/api/risk")
def get_risk(state: str = "California", year: int = 2024):
    # For now: MOCK DATA. Later you can plug in real model outputs / CSVs.
    if state == "California":
        data = [
            {"region": "CA - Tile 1", "risk_score": 0.82},
            {"region": "CA - Tile 2", "risk_score": 0.57},
        ]
    else:
        data = [
            {"region": f"{state} - Tile 1", "risk_score": 0.43},
            {"region": f"{state} - Tile 2", "risk_score": 0.21},
        ]

    return {
        "state": state,
        "year": year,
        "results": data,
    }
