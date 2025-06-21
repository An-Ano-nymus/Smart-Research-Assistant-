from utils.cerebras_client import LLM_ANS

def generate_summary(text):
    prompt = f"""Summarize the following document in no more than 150 words. Be concise and factual. Avoid hallucinations.

DOCUMENT:
{text[:8000]}"""  # truncate if text is too large for the model
    return LLM_ANS(prompt)
