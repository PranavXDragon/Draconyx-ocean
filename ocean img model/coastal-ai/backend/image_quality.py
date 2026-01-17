import cv2
import numpy as np
from PIL import Image

def assess_image_quality(image_path: str) -> dict:
    """
    Assess image quality to determine reliability of visual analysis
    
    Poor quality (blur, darkness, noise) reduces confidence in detections
    
    Args:
        image_path: Path to image file
    
    Returns:
        Dictionary with quality metrics and overall score
    """
    
    try:
        # Load image
        img = cv2.imread(image_path)
        if img is None:
            return {
                "quality_score": 0.0,
                "issues": ["Unable to load image"],
                "reliability": "VERY_LOW"
            }
        
        # Convert to grayscale for analysis
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # 1. Blur Detection (Laplacian variance)
        laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        blur_score = min(1.0, laplacian_var / 500.0)  # Normalize
        
        # 2. Brightness Assessment
        mean_brightness = np.mean(gray)
        # Optimal range: 80-180
        if 80 <= mean_brightness <= 180:
            brightness_score = 1.0
        elif mean_brightness < 30 or mean_brightness > 220:
            brightness_score = 0.3  # Very dark or very bright
        else:
            brightness_score = 0.7
        
        # 3. Contrast Assessment
        contrast = gray.std()
        contrast_score = min(1.0, contrast / 60.0)
        
        # 4. Noise Assessment (using local variance)
        kernel = np.ones((5, 5), np.float32) / 25
        img_mean = cv2.filter2D(gray.astype(np.float32), -1, kernel)
        noise_var = np.mean((gray.astype(np.float32) - img_mean) ** 2)
        noise_score = max(0.0, 1.0 - (noise_var / 100.0))  # Lower noise = higher score
        
        # 5. Resolution Check
        height, width = img.shape[:2]
        min_resolution = 320 * 240
        actual_resolution = height * width
        resolution_score = min(1.0, actual_resolution / min_resolution)
        
        # Combined quality score (weighted average)
        quality_score = (
            0.30 * blur_score +
            0.25 * brightness_score +
            0.20 * contrast_score +
            0.15 * noise_score +
            0.10 * resolution_score
        )
        
        # Identify issues
        issues = []
        if blur_score < 0.4:
            issues.append("Image is blurry")
        if brightness_score < 0.5:
            if mean_brightness < 80:
                issues.append("Image is too dark")
            else:
                issues.append("Image is overexposed")
        if contrast_score < 0.4:
            issues.append("Low contrast")
        if noise_score < 0.5:
            issues.append("High noise level")
        if resolution_score < 0.8:
            issues.append("Low resolution")
        
        # Reliability classification
        if quality_score > 0.75:
            reliability = "HIGH"
        elif quality_score > 0.55:
            reliability = "MEDIUM"
        elif quality_score > 0.35:
            reliability = "LOW"
        else:
            reliability = "VERY_LOW"
        
        return {
            "quality_score": round(quality_score, 2),
            "reliability": reliability,
            "metrics": {
                "sharpness": round(blur_score, 2),
                "brightness": round(brightness_score, 2),
                "contrast": round(contrast_score, 2),
                "noise": round(noise_score, 2),
                "resolution": round(resolution_score, 2)
            },
            "issues": issues,
            "recommendation": "Use higher quality images" if quality_score < 0.6 else "Image quality acceptable",
            "resolution": f"{width}x{height}"
        }
    
    except Exception as e:
        return {
            "quality_score": 0.5,
            "issues": [f"Quality assessment error: {str(e)}"],
            "reliability": "UNKNOWN"
        }


def assess_video_quality(video_path: str, sample_frames: int = 5) -> dict:
    """
    Assess video quality by sampling multiple frames
    
    Args:
        video_path: Path to video file
        sample_frames: Number of frames to sample
    
    Returns:
        Aggregated quality metrics
    """
    
    try:
        cap = cv2.VideoCapture(video_path)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        
        if total_frames == 0:
            return {
                "quality_score": 0.0,
                "reliability": "VERY_LOW",
                "issues": ["Unable to read video"]
            }
        
        # Sample frames evenly
        frame_indices = np.linspace(0, total_frames - 1, min(sample_frames, total_frames), dtype=int)
        
        frame_scores = []
        all_issues = set()
        
        for idx in frame_indices:
            cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
            ret, frame = cap.read()
            
            if not ret:
                continue
            
            # Save frame temporarily
            temp_path = f"temp_frame_{idx}.jpg"
            cv2.imwrite(temp_path, frame)
            
            # Assess frame quality
            frame_quality = assess_image_quality(temp_path)
            frame_scores.append(frame_quality["quality_score"])
            all_issues.update(frame_quality.get("issues", []))
            
            # Clean up
            import os
            try:
                os.remove(temp_path)
            except:
                pass
        
        cap.release()
        
        if not frame_scores:
            return {
                "quality_score": 0.0,
                "reliability": "VERY_LOW",
                "issues": ["No valid frames found"]
            }
        
        # Aggregate scores
        avg_quality = np.mean(frame_scores)
        min_quality = np.min(frame_scores)
        
        # Determine reliability
        if avg_quality > 0.75:
            reliability = "HIGH"
        elif avg_quality > 0.55:
            reliability = "MEDIUM"
        else:
            reliability = "LOW"
        
        return {
            "quality_score": round(avg_quality, 2),
            "min_quality": round(min_quality, 2),
            "reliability": reliability,
            "frames_analyzed": len(frame_scores),
            "issues": list(all_issues),
            "recommendation": "Video quality acceptable" if avg_quality > 0.6 else "Consider re-recording in better conditions"
        }
    
    except Exception as e:
        return {
            "quality_score": 0.5,
            "reliability": "UNKNOWN",
            "issues": [f"Video quality assessment error: {str(e)}"]
        }
