from sentence_transformers import SentenceTransformer, util
import re

# Lightweight semantic model for text understanding
text_model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

# Canonical event descriptions for matching
KNOWN_EVENTS = {
    "abnormal_wave": "very strong waves rough sea storm tsunami huge waves dangerous water",
    "rough_sea": "rough sea choppy water moderate waves uncomfortable conditions",
    "marine_garbage": "plastic waste garbage floating in sea pollution debris trash litter",
    "ship": "boat ship vessel fishing activity maritime traffic",
    "normal": "normal calm sea peaceful water no danger safe conditions clear"
}

# Severity indicators
SEVERITY_HIGH = ["tsunami", "huge", "massive", "extremely", "severe", "dangerous", "emergency"]
SEVERITY_MEDIUM = ["strong", "rough", "significant", "concerning", "unusual"]
SEVERITY_LOW = ["mild", "slight", "small", "minor"]

# Uncertainty indicators
UNCERTAINTY_WORDS = ["maybe", "might", "could be", "i think", "possibly", "perhaps", "not sure"]

def extract_severity(text: str) -> dict:
    """Extract severity level from text"""
    text_lower = text.lower()
    
    high_count = sum(1 for word in SEVERITY_HIGH if word in text_lower)
    medium_count = sum(1 for word in SEVERITY_MEDIUM if word in text_lower)
    low_count = sum(1 for word in SEVERITY_LOW if word in text_lower)
    
    if high_count > 0:
        return {"level": "HIGH", "confidence": 0.9}
    elif medium_count > 0:
        return {"level": "MEDIUM", "confidence": 0.7}
    elif low_count > 0:
        return {"level": "LOW", "confidence": 0.5}
    else:
        return {"level": "MEDIUM", "confidence": 0.6}

def detect_uncertainty(text: str) -> float:
    """Detect uncertainty in language (0-1 where 1 = very uncertain)"""
    text_lower = text.lower()
    uncertainty_count = sum(1 for word in UNCERTAINTY_WORDS if word in text_lower)
    return min(uncertainty_count * 0.3, 1.0)

def understand_report(report_text: str, vision_event: str, detected_objects: list = None) -> dict:
    """
    Understand user text and compare with vision output
    
    Args:
        report_text: Natural language report from citizen
        vision_event: Event type detected by vision AI
        detected_objects: List of objects detected by YOLO
    
    Returns:
        Dictionary with text understanding results
    """
    
    if not report_text or len(report_text.strip()) < 3:
        return {
            "text_event": "insufficient_text",
            "text_confidence": 0.0,
            "consistency": "NO_TEXT",
            "consistency_score": 0.0,
            "severity": {"level": "UNKNOWN", "confidence": 0.0},
            "uncertainty": 0.0,
            "explanation": "Report text too short for analysis"
        }
    
    # Clean text
    text_clean = report_text.lower().strip()
    
    # Extract severity
    severity = extract_severity(text_clean)
    
    # Detect uncertainty
    uncertainty = detect_uncertainty(text_clean)
    
    # Encode text
    text_embedding = text_model.encode(text_clean, convert_to_tensor=True)
    
    # Compare with known events
    scores = {}
    for event, description in KNOWN_EVENTS.items():
        event_embedding = text_model.encode(description, convert_to_tensor=True)
        scores[event] = float(util.cos_sim(text_embedding, event_embedding).item())
    
    # Best matched event from text
    text_event = max(scores, key=scores.get)
    text_confidence = scores[text_event]
    
    # Adjust confidence based on uncertainty language
    if uncertainty > 0.3:
        text_confidence *= (1 - uncertainty * 0.5)
    
    # Consistency check between text and vision
    consistency_score = 0.0
    consistency = "UNKNOWN"
    explanation = ""
    
    if vision_event == "normal" or vision_event == "unknown":
        if text_event in ["abnormal_wave", "rough_sea", "marine_garbage"]:
            consistency = "MISMATCH"
            consistency_score = 0.2
            explanation = f"User reports '{text_event}' but visuals show normal conditions. Possible false alarm or evidence mismatch."
        else:
            consistency = "MATCH"
            consistency_score = 0.9
            explanation = "Report and visual evidence agree on normal conditions."
    else:
        if text_event == vision_event:
            consistency = "STRONG_MATCH"
            consistency_score = 1.0
            explanation = f"Report and visual evidence strongly agree on '{text_event}'."
        elif text_event in KNOWN_EVENTS and vision_event in KNOWN_EVENTS:
            # Similar events (e.g., rough_sea vs abnormal_wave)
            similarity = scores.get(vision_event, 0.0)
            if similarity > 0.5:
                consistency = "PARTIAL_MATCH"
                consistency_score = 0.7
                explanation = f"Report mentions '{text_event}' while visuals show '{vision_event}' - partially consistent."
            else:
                consistency = "MISMATCH"
                consistency_score = 0.3
                explanation = f"Report describes '{text_event}' but visuals indicate '{vision_event}' - significant mismatch."
        else:
            consistency = "UNCERTAIN"
            consistency_score = 0.5
            explanation = "Unable to determine consistency between report and visuals."
    
    # Check for specific object mentions vs detections
    object_consistency = check_object_consistency(text_clean, detected_objects or [])
    
    # Combine explanations
    if object_consistency["has_mismatch"]:
        explanation += f" {object_consistency['note']}"
    
    return {
        "text_event": text_event,
        "text_confidence": round(text_confidence, 2),
        "consistency": consistency,
        "consistency_score": round(consistency_score, 2),
        "severity": severity,
        "uncertainty": round(uncertainty, 2),
        "semantic_scores": {k: round(v, 2) for k, v in scores.items()},
        "explanation": explanation,
        "object_consistency": object_consistency
    }

def check_object_consistency(text: str, detected_objects: list) -> dict:
    """Check if mentioned objects match detected objects"""
    text_lower = text.lower()
    
    # Common mentions
    mentioned_items = {
        "boat": "boat" in text_lower or "ship" in text_lower or "vessel" in text_lower,
        "person": "person" in text_lower or "people" in text_lower or "swimmer" in text_lower,
        "garbage": "garbage" in text_lower or "trash" in text_lower or "plastic" in text_lower or "debris" in text_lower,
    }
    
    detected_items = {
        "boat": any(obj in ["boat", "ship"] for obj in detected_objects),
        "person": "person" in detected_objects,
        "garbage": False  # YOLO might not detect garbage well
    }
    
    mismatches = []
    matches = []
    
    for item, is_mentioned in mentioned_items.items():
        if is_mentioned and not detected_items[item]:
            if item != "garbage":  # Garbage detection is weak, don't penalize
                mismatches.append(f"'{item}' mentioned but not detected visually")
        elif is_mentioned and detected_items[item]:
            matches.append(f"'{item}' confirmed")
    
    has_mismatch = len(mismatches) > 0
    note = ""
    if matches:
        note = "Visual confirmation: " + ", ".join(matches) + "."
    if mismatches:
        note += " Missing visual evidence: " + ", ".join(mismatches) + "."
    
    return {
        "has_mismatch": has_mismatch,
        "matches": matches,
        "mismatches": mismatches,
        "note": note.strip()
    }
