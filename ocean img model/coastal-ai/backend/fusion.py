def final_decision(vision, satellite, social, text_understanding=None):
    """
    Enhanced fusion with text understanding
    
    vision: dict from vision.py
    satellite: dict from satellite.py
    social: dict from social.py
    text_understanding: dict from report_understanding.py (optional)
    """
    
    # Base weighted score from all signals
    clip_score = vision.get("clip_score", 0) or vision.get("average_clip_score", 0) or vision.get("marine_score", 0)
    
    score = (
        0.35 * clip_score +
        0.25 * satellite.get("satellite_confidence", 0.5) +
        0.15 * social.get("social_confidence", 0.5)
    )
    
    # Add text understanding if available
    if text_understanding:
        text_score = text_understanding.get("text_confidence", 0.5)
        consistency_score = text_understanding.get("consistency_score", 0.5)
        
        # Weight text confidence
        score += 0.15 * text_score
        
        # Penalize mismatches
        if text_understanding.get("consistency") == "MISMATCH":
            score -= 0.15
        elif text_understanding.get("consistency") == "STRONG_MATCH":
            score += 0.10
        
        # Consider uncertainty
        uncertainty = text_understanding.get("uncertainty", 0.0)
        if uncertainty > 0.5:
            score *= 0.9  # Reduce confidence for uncertain reports
    else:
        # No text understanding, slightly reduce overall confidence
        score *= 0.95
    
    score = max(0.0, min(1.0, score))  # Clamp between 0 and 1
    score = round(score, 2)
    
    # Determine alert level and action
    if score > 0.75:
        alert_level = "high"
        decision = "EMERGENCY_ALERT"
        action = "Immediate authority notification and public warning"
    elif score > 0.55:
        alert_level = "medium"
        decision = "VERIFY_WITH_AUTHORITIES"
        action = "Requires manual verification by coastal authorities"
    elif score > 0.35:
        alert_level = "low"
        decision = "MONITOR"
        action = "Continue monitoring, no immediate action"
    else:
        alert_level = "minimal"
        decision = "REJECT_REPORT"
        action = "Insufficient evidence, likely false alarm"
    
    return {
        "final_score": score,
        "confidence": score,
        "decision": decision,
        "alert_level": alert_level,
        "action": action
    }
