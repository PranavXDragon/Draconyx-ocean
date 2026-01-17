from sentence_transformers import SentenceTransformer, util

# Load model once
text_model = SentenceTransformer(
    "sentence-transformers/all-mpnet-base-v2"
)

def social_check(report_text: str, known_posts=None):
    """
    report_text: citizen input text
    known_posts: list of known / recent social posts
    """

    if known_posts is None:
        known_posts = [
            "huge waves near coast",
            "storm approaching shoreline",
            "rough sea conditions reported"
        ]

    emb1 = text_model.encode(report_text)

    similarities = [
        util.cos_sim(emb1, text_model.encode(p)).item()
        for p in known_posts
    ]

    max_sim = max(similarities)

    return {
        "social_confidence": round(max_sim, 2),
        "verified": max_sim > 0.6
    }
