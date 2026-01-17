from ultralytics import YOLO
from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import torch
import warnings

# Suppress warnings
warnings.filterwarnings("ignore", category=FutureWarning)

# ----------------------------
# Load models (once at startup)
# ----------------------------

yolo = YOLO("yolov8m.pt")

clip_model = CLIPModel.from_pretrained(
    "openai/clip-vit-large-patch14"
)
clip_processor = CLIPProcessor.from_pretrained(
    "openai/clip-vit-large-patch14",
    use_fast=True  # Suppress the slow processor warning
)

device = "cuda" if torch.cuda.is_available() else "cpu"
clip_model = clip_model.to(device)

# ----------------------------
# Vision Analysis Function
# ----------------------------

def analyze_image(image_path: str):
    """
    image_path: path to uploaded image
    returns: vision confidence, marine score, event type, detected objects, wave analysis
    """

    # ---------- YOLO OBJECT DETECTION ----------
    yolo_result = yolo(image_path)[0]

    if yolo_result.boxes is not None and len(yolo_result.boxes) > 0:
        vision_confidence = float(yolo_result.boxes.conf.mean())
        detected_objects = [yolo.names[int(cls)] for cls in yolo_result.boxes.cls]
    else:
        vision_confidence = 0.0
        detected_objects = []

    # ---------- CLIP (SEA WAVES + MARINE CONDITIONS) ----------
    image = Image.open(image_path).convert("RGB")

    labels = [
        "calm sea",
        "rough sea waves",
        "stormy ocean",
        "tsunami like waves",
        "floating garbage in ocean",
        "marine debris",
        "ship at sea",
        "normal ocean"
    ]

    inputs = clip_processor(
        text=labels,
        images=image,
        return_tensors="pt",
        padding=True
    )

    inputs = {k: v.to(device) for k, v in inputs.items()}

    with torch.no_grad():
        outputs = clip_model(**inputs)

    probs = outputs.logits_per_image.softmax(dim=1)
    marine_score = probs.max().item()
    predicted_label = labels[probs.argmax().item()]

    # ---- EVENT TYPE LOGIC ----
    if "tsunami" in predicted_label or "stormy" in predicted_label:
        event_type = "abnormal_wave"
    elif "garbage" in predicted_label or "debris" in predicted_label:
        event_type = "marine_garbage"
    elif "rough" in predicted_label:
        event_type = "rough_sea"
    elif "boat" in detected_objects or "ship" in detected_objects or "ship" in predicted_label:
        event_type = "ship"
    elif "whale" in predicted_label or "dolphin" in predicted_label:
        event_type = "marine_life"
    else:
        event_type = "normal"

    return {
        "vision_confidence": round(vision_confidence, 2),
        "marine_score": round(marine_score, 2),
        "clip_score": round(marine_score, 2),
        "detected_objects": detected_objects,
        "wave_label": predicted_label,
        "predicted_label": predicted_label,
        "event_type": event_type
    }
