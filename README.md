# 🧠 Smart Document Assistant

An intelligent document assistant that allows users to upload PDF/TXT files and ask context-aware questions or take logical challenges. It combines OCR (Optical Character Recognition), AI-powered Q&A, and a sleek React interface.

---

## 🚀 Features

- 📤 Upload PDFs or Text Files
- 🔍 OCR support via Tesseract + Poppler for scanned PDFs
- 🧠 Context-aware Q&A using Cerebras API
- 💡 Logic challenges based on uploaded document content
- 🌗 Dark mode support
- 📄 Live PDF Preview (for .pdf files)
- 🧭 Fully responsive React frontend

---

## 🧰 Tech Stack

| Layer      | Technology            |
|------------|------------------------|
| Frontend   | React, Tailwind CSS, Lucide Icons |
| Backend    | Flask (REST API)       |
| OCR        | PyTesseract + Poppler  |
| AI/LLM     | Cerebras API           |

---

## ⚙️ Setup Instructions

### 🔧 Prerequisites

- Python 3.8+
- Node.js 16+
- [Poppler for Windows/macOS/Linux](https://github.com/oschwartz10612/poppler-windows/releases/)
- Tesseract OCR installed (https://github.com/tesseract-ocr/tesseract)

---

### 🧠 Backend Setup (Flask)

```bash
# 1. Clone repo
git clone https://github.com/yourusername/smart-doc-assistant.git
cd smart-doc-assistant/backend

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Set environment variables (create .env file)
CEREBRAS_API_KEY=your_cerebras_api_key

# 5. Start backend
flask run
```

---

### 🌐 Frontend Setup (React)

```bash
# 1. Move to frontend directory
cd ../frontend

# 2. Install dependencies
npm install

# 3. Start React app
npm run dev   # or npm start
```

---

## 🧠 Architecture & Reasoning Flow

### 🗂️ 1. **Document Upload & OCR**

- User uploads a `.pdf` or `.txt` file from the React interface.
- If it's a PDF:
  - Flask uses `pdf2image` + Poppler to convert it into images.
  - PyTesseract extracts text from the images.
- The extracted text is stored in global context (`DocumentContext`) in React.

### 🧠 2. **Contextual Q&A**

- User asks a question via the frontend.
- React builds a memory-aware prompt using past interactions.
- This prompt + extracted document text is sent to the Flask API.
- Flask forwards the query to the **Cerebras LLM API**.
- The answer and justification are returned to React and rendered.

### 🧩 3. **Challenge Mode (Logic Puzzles)**

- Questions are generated from the document using AI or predefined logic.
- User answers them, and the backend scores their performance.
- Justifications and correct answers are returned for learning.

### 🎨 4. **UI & UX**

- Tailwind CSS + Lucide Icons ensure a clean, responsive UI.
- Dark mode is toggled via Tailwind’s `dark` class and localStorage.
- Components: `Upload`, `AskAnything`, `ChallengeMe`, `Navigation`.

---

## 📁 Project Structure

```
smart-doc-assistant/
│
├── backend/                  # Flask app
│   ├── app.py
│   ├── utils/ocr.py
│   └── routes/upload, ask, challenge
│
├── frontend/                 # React app
│   ├── src/
│   │   ├── components/
│   │   ├── context/DocumentContext.js
│   │   └── api/index.js
│   └── tailwind.config.js
│
├── README.md
└── requirements.txt
```

---

## 🧪 Example Use Case

1. Upload your scanned academic paper or research PDF.
2. Get an auto-generated summary.
3. Ask questions like:  
   *"What is the conclusion of this paper?"*  
   *"What are the limitations discussed?"*
4. Enter challenge mode and test your comprehension.

---

## 🤝 Contributing

Pull requests welcome! Please open an issue first to discuss major changes.

---

## 📜 License

[MIT](LICENSE)

---

## 💡 Credits

- [Tesseract OCR](https://github.com/tesseract-ocr/tesseract)
- [Poppler Utils](https://poppler.freedesktop.org/)
- [Cerebras-GPT](https://www.cerebras.net/)