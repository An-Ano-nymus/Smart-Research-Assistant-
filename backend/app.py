import os
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.image_to_text import auto_text
from utils.summarizer import generate_summary
from utils.cerebras_client import LLM_ANS

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def health():
    return jsonify({"status": "Backend is running 🚀"}), 200

@app.route('/upload', methods=['POST'])
def handle_upload():
    file = request.files['file']
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    extracted_text = auto_text(file_path)
    summary = generate_summary(extracted_text)

    return jsonify({
        "summary": summary,
        "documentText": extracted_text
    })

@app.route('/ask', methods=['POST'])
def ask_question():
    data = request.get_json()
    question = data.get('question')
    document = data.get('documentText')

    if not question or not document:
        return jsonify({"error": "Missing question or documentText"}), 400

    prompt = f"""
Answer the following question based only on the document provided. Do not hallucinate or use external knowledge. Justify your answer with a source from the document specially.

QUESTION: {question}

DOCUMENT:
{document[:8000]}
"""
    answer = LLM_ANS(prompt)
    return jsonify({"answer": answer})

@app.route('/challenge', methods=['POST'])
def challenge_mode():
    data = request.get_json()
    document = data.get('documentText')
    answers = data.get('answers')
    questions = data.get('questions')

    if not document:
        return jsonify({"error": "Missing documentText"}), 400

    # Case 1: Generate questions
    if not answers:
        prompt = f"""Generate 3 logic or comprehension-based questions based strictly on the document below.
Label them Q1, Q2, Q3. Only provide the questions.

DOCUMENT:
{document[:8000]}
"""
        generated = LLM_ANS(prompt)
        question_lines = [line.strip() for line in generated.split('\n') if line.strip()]
        return jsonify({"questions": question_lines})

    # Case 2: Evaluate answers
    if not questions:
        return jsonify({"error": "Missing questions for evaluation"}), 400

    eval_prompt = f"""You are an evaluator. Assess the following answers based on the document. For each:
- Confirm if it is correct.
- Give a short explanation.
- Give the correct answer if the user's is wrong.

Document:
{document[:8000]}

Use this format:
Q1: <question>
User Answer: <user's answer>
Correct?: Yes/No
Correct Answer: <correct answer if any>
Explanation: <why correct or incorrect>

"""

    for idx, q in enumerate(questions):
        q_text = q.get('text', '').strip()
        user_ans = answers.get(f'q{idx+1}', '').strip()
        eval_prompt += f"\nQ{idx+1}: {q_text}\nUser Answer: {user_ans}\n"

    eval_response = LLM_ANS(eval_prompt)
    print("[DEBUG] Evaluation Response:\n", eval_response[:1000])

    feedback = {}
    correct_count = 0

    # Split and parse the response
    sections = re.split(r"\nQ\d+:", eval_response)
    for i, section in enumerate(sections[:], start=1):
        qid = f"q{i}"
        is_correct = "Correct?: Yes" in section
        explanation = re.search(r"Explanation:\s*(.*)", section, re.DOTALL)
        correct_answer = re.search(r"Correct Answer:\s*(.*)", section, re.DOTALL)

        feedback[qid] = {
            "correct": is_correct,
            "explanation": explanation.group(1).strip() if explanation else "No explanation found.",
            "correctAnswer": correct_answer.group(1).strip() if correct_answer else "Not provided."
        }

        if is_correct:
            correct_count += 1

    score = round((correct_count / len(questions)) * 100)

    return jsonify({
        "score": score,
        "feedback": feedback
    })

if __name__ == "__main__":
    app.run(debug=True)
