from fastapi import FastAPI, UploadFile, Form
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os

from backend.vision import analyze_image
from backend.vision_video import analyze_video
from backend.satellite import satellite_check
from backend.social import social_check
from backend.fusion import final_decision
from backend.report_understanding import understand_report
from backend.image_quality import assess_image_quality, assess_video_quality

app = FastAPI(title="Coastal AI Alert System")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Paths ----------
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")
UPLOAD_DIR = os.path.join(BASE_DIR, "data", "images")

os.makedirs(UPLOAD_DIR, exist_ok=True)

# ---------- Serve Static Frontend ----------
app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")

@app.get("/", response_class=HTMLResponse)
async def serve_frontend():
    with open(os.path.join(FRONTEND_DIR, "index.html"), "r", encoding="utf-8") as f:
        return f.read()

# ---------- API Endpoint ----------
@app.post("/report")
async def report(file: UploadFile, text: str = Form(...)):
    # Determine file type
    file_ext = os.path.splitext(file.filename)[1].lower()
    video_extensions = ['.mp4', '.avi', '.mov', '.mkv', '.webm', '.flv', '.wmv']
    image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
    
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # === 1. ASSESS IMAGE/VIDEO QUALITY ===
    if file_ext in video_extensions:
        quality_assessment = assess_video_quality(file_path, sample_frames=3)
    else:
        quality_assessment = assess_image_quality(file_path)
    
    # === 2. VISION AI ANALYSIS ===
    # Process based on file type
    try:
        if file_ext in video_extensions:
            vision = analyze_video(file_path)
        elif file_ext in image_extensions or not file_ext:
            vision = analyze_image(file_path)
        else:
            # Default to image for unknown types
            vision = analyze_image(file_path)
    except Exception as e:
        return {
            "error": f"Processing failed: {str(e)}",
            "vision_ai": {"error": str(e), "event_type": "unknown"},
            "quality_assessment": quality_assessment,
            "satellite_verification": {"confidence": 0.0},
            "social_verification": {"confidence": 0.0},
            "final_decision": {"alert_level": "unknown", "confidence": 0.0, "action": "Error occurred"}
        }
    
    # Add quality assessment to vision results
    vision["quality_assessment"] = quality_assessment

    # === 3. SATELLITE VERIFICATION (with detected objects context) ===
    satellite = satellite_check(
        event_type=vision.get("event_type", "unknown"),
        detected_objects=vision.get("detected_objects", []),
        location=None  # Could extract from EXIF in production
    )
    
    # === 4. SOCIAL/TEXT VALIDATION ===
    social = social_check(text)
    
    # === 5. TEXT UNDERSTANDING - compare report with visual evidence ===
    text_understanding = understand_report(
        report_text=text,
        vision_event=vision.get("event_type", "unknown"),
        detected_objects=vision.get("detected_objects", [])
    )

    # === 6. MULTI-MODAL FUSION ===
    result = final_decision(
        vision=vision,
        satellite=satellite,
        social=social,
        text_understanding=text_understanding
    )
    
    # Apply quality penalty if image/video is poor
    if quality_assessment.get("quality_score", 1.0) < 0.5:
        result["confidence"] = result["confidence"] * 0.85
        result["quality_warning"] = "Low media quality reduces confidence"

    return {
        "vision_ai": vision,
        "quality_assessment": quality_assessment,
        "text_understanding": text_understanding,
        "satellite_verification": satellite,
        "social_verification": social,
        "final_decision": result
    }
