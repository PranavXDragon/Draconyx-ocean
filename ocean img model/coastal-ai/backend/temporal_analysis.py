import numpy as np
from typing import List, Dict

def analyze_temporal_trends(frame_results: List[Dict]) -> Dict:
    """
    Analyze how conditions change over time in video
    
    Detects:
    - Worsening conditions (intensity increasing)
    - Improving conditions (calming down)
    - Stable conditions
    - Sudden changes
    
    Args:
        frame_results: List of vision AI results for each frame
    
    Returns:
        Temporal analysis with trend detection
    """
    
    if not frame_results or len(frame_results) < 3:
        return {
            "trend": "INSUFFICIENT_DATA",
            "trend_confidence": 0.0,
            "stability": "UNKNOWN",
            "progression": "Cannot determine with < 3 frames"
        }
    
    # Extract confidence scores over time
    confidence_scores = [r.get("clip_score", 0) or r.get("marine_score", 0) for r in frame_results]
    
    # Calculate trend using linear regression
    x = np.arange(len(confidence_scores))
    y = np.array(confidence_scores)
    
    # Simple linear fit
    if len(x) > 1:
        slope = np.polyfit(x, y, 1)[0]
    else:
        slope = 0
    
    # Variance (stability measure)
    variance = np.var(confidence_scores)
    
    # Determine trend
    if slope > 0.02:
        trend = "WORSENING"
        progression = "Conditions are deteriorating over time"
    elif slope < -0.02:
        trend = "IMPROVING"
        progression = "Conditions are calming down"
    else:
        trend = "STABLE"
        progression = "Conditions remain relatively constant"
    
    # Stability assessment
    if variance < 0.01:
        stability = "VERY_STABLE"
    elif variance < 0.05:
        stability = "STABLE"
    elif variance < 0.10:
        stability = "FLUCTUATING"
    else:
        stability = "HIGHLY_VARIABLE"
    
    # Detect sudden changes
    sudden_changes = []
    for i in range(1, len(confidence_scores)):
        delta = abs(confidence_scores[i] - confidence_scores[i-1])
        if delta > 0.15:
            sudden_changes.append({
                "frame": i,
                "change": round(delta, 2),
                "direction": "SPIKE" if confidence_scores[i] > confidence_scores[i-1] else "DROP"
            })
    
    # Calculate trend confidence
    trend_confidence = min(1.0, abs(slope) * 10 + (1 - variance))
    
    # Event duration estimate
    high_confidence_frames = sum(1 for score in confidence_scores if score > 0.6)
    duration_percentage = (high_confidence_frames / len(confidence_scores)) * 100
    
    return {
        "trend": trend,
        "trend_confidence": round(trend_confidence, 2),
        "slope": round(slope, 3),
        "stability": stability,
        "variance": round(variance, 3),
        "progression": progression,
        "sudden_changes": sudden_changes,
        "event_duration_percentage": round(duration_percentage, 1),
        "frames_analyzed": len(frame_results),
        "confidence_range": {
            "min": round(min(confidence_scores), 2),
            "max": round(max(confidence_scores), 2),
            "mean": round(np.mean(confidence_scores), 2)
        }
    }


def assess_video_consistency(frame_results: List[Dict]) -> Dict:
    """
    Check if video shows consistent event across frames
    
    Helps detect edited/spliced videos
    
    Args:
        frame_results: List of vision AI results
    
    Returns:
        Consistency assessment
    """
    
    if len(frame_results) < 2:
        return {
            "is_consistent": True,
            "confidence": 1.0,
            "note": "Single frame, no consistency check"
        }
    
    # Extract event types
    event_types = [r.get("event_type", "unknown") for r in frame_results]
    
    # Count most common event
    from collections import Counter
    event_counts = Counter(event_types)
    most_common_event, count = event_counts.most_common(1)[0]
    
    consistency_ratio = count / len(event_types)
    
    # Check for suspicious patterns
    suspicious_patterns = []
    
    # Pattern 1: Too many rapid switches
    switches = sum(1 for i in range(1, len(event_types)) if event_types[i] != event_types[i-1])
    if switches > len(event_types) * 0.5:
        suspicious_patterns.append("Excessive event type switching detected")
    
    # Pattern 2: All frames exactly identical (possible loop)
    if len(set(str(r) for r in frame_results)) == 1:
        suspicious_patterns.append("All frames identical - possible video loop")
    
    is_consistent = consistency_ratio > 0.6 and len(suspicious_patterns) == 0
    
    return {
        "is_consistent": is_consistent,
        "confidence": round(consistency_ratio, 2),
        "dominant_event": most_common_event,
        "event_distribution": dict(event_counts),
        "suspicious_patterns": suspicious_patterns,
        "assessment": "Video shows consistent event" if is_consistent else "Video may be edited or contains multiple scenes"
    }
