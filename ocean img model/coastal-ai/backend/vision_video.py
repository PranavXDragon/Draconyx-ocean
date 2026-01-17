import cv2
import tempfile
import os
import time
from backend.vision import analyze_image
from backend.temporal_analysis import analyze_temporal_trends, assess_video_consistency

def analyze_video(video_path: str):
    """
    Analyze video by sampling frames and aggregating results with temporal analysis
    video_path: path to uploaded video
    returns: aggregated analysis results with temporal trends
    """
    cap = cv2.VideoCapture(video_path)
    frame_count = 0
    scores = []
    temp_files = []
    fps = cap.get(cv2.CAP_PROP_FPS) or 30

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # Sample 1 frame per second
        if frame_count % int(fps) == 0:
            # Create temp file and close handle immediately (Windows fix)
            tmp = tempfile.NamedTemporaryFile(suffix=".jpg", delete=False)
            tmp_path = tmp.name
            tmp.close()  # Close file handle before cv2 uses it
            
            cv2.imwrite(tmp_path, frame)
            
            try:
                result = analyze_image(tmp_path)
                scores.append(result)
                temp_files.append(tmp_path)
            except Exception as e:
                print(f"Error analyzing frame {frame_count}: {e}")

        frame_count += 1

    cap.release()
    
    # Clean up temp files AFTER processing (Windows-safe)
    for temp_file in temp_files:
        try:
            time.sleep(0.01)  # Brief delay for Windows file handles
            os.remove(temp_file)
        except PermissionError:
            pass  # Ignore if still locked

    if not scores:
        return {
            "error": "No frames processed",
            "event_type": "unknown",
            "clip_score": 0.0,
            "vision_confidence": 0.0
        }

    # Aggregate results
    avg_clip_score = sum(r["clip_score"] for r in scores) / len(scores)
    avg_vision_conf = sum(r["vision_confidence"] for r in scores) / len(scores)

    # Get most common event type
    event_types = [r["event_type"] for r in scores]
    final_event = max(set(event_types), key=event_types.count)

    # Collect all detected objects
    all_objects = []
    for r in scores:
        all_objects.extend(r.get("detected_objects", []))
    unique_objects = list(set(all_objects))

    # Get most common wave label
    wave_labels = [r.get("wave_label", "normal ocean") for r in scores]
    final_wave_label = max(set(wave_labels), key=wave_labels.count)
    
    # === NEW: Temporal Analysis ===
    temporal_analysis = analyze_temporal_trends(scores)
    consistency_check = assess_video_consistency(scores)

    return {
        "clip_score": round(avg_clip_score, 2),
        "vision_confidence": round(avg_vision_conf, 2),
        "marine_score": round(avg_clip_score, 2),
        "event_type": final_event,
        "detected_objects": unique_objects,
        "wave_label": final_wave_label,
        "frames_analyzed": len(scores),
        "is_video": True,
        # Temporal intelligence
        "temporal_analysis": temporal_analysis,
        "consistency_check": consistency_check,
        "video_metadata": {
            "total_frames": frame_count,
            "fps": fps,
            "duration_seconds": round(frame_count / fps, 1)
        }
    }
