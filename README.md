# 🧠 Smart AI Document Assistant

A React-based AI assistant that helps users upload documents (PDF or TXT), receive intelligent summaries, ask contextual questions, and solve logic challenges—all powered by document-aware reasoning.

---

## 🚀 Features

- 📄 **Upload Documents** (.pdf, .txt)
- 📚 **Auto Summarization** using AI
- ❓ **Ask Anything** with contextual memory
- 🧩 **Challenge Mode** for logical reasoning questions
- 🌗 **Dark Mode Toggle**
- ⚡ **Responsive UI** (Mobile + Desktop)

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/smart-assistant.git
cd smart-assistant
2. Install Dependencies
bash
Copy
Edit
npm install
3. Start the Frontend
bash
Copy
Edit
npm run dev
Runs on http://localhost:5173 (or Vite default port).

4. Setup Backend (Required)
Ensure your backend API is up and running with these endpoints:

POST /upload-document → Handles document upload & summarization

POST /ask-question → Returns AI-generated answers based on memory & document

POST /challenge-questions → Returns logic-based questions

POST /submit-challenge → Evaluates submitted answers

🔗 Update baseURL in api.js accordingly:

js
Copy
Edit
const baseURL = 'http://localhost:5000'; // or your server URL
⚙️ Folder Structure
pgsql
Copy
Edit
src/
├── api/                  # API utility functions
├── components/           # Upload, AskAnything, ChallengeMe, Navigation, etc.
├── context/              # DocumentContext for global state
├── App.tsx               # Main app with routing and dark mode wrapper
├── main.tsx              # Entry point
└── styles/               # (Optional) custom CSS or Tailwind config
🧠 Architecture & Reasoning Flow
1. Document Upload Flow
arduino
Copy
Edit
User uploads PDF/TXT
     ↓
Frontend validates file type & size
     ↓
File is sent to backend → /upload-document
     ↓
Backend returns:
  • Summary
  • Raw document text
     ↓
Frontend stores document text in context (DocumentContext)
2. Ask Anything Flow
yaml
Copy
Edit
User enters question
     ↓
App composes memory-aware prompt:
  Q1: ...
  A1: ...
  Q2: [new question]
     ↓
Prompt + documentText → /ask-question
     ↓
Backend returns:
  • Answer
  • Justification
     ↓
History updates and is rendered contextually
3. Challenge Me Flow
sql
Copy
Edit
On load: frontend requests logic questions → /challenge-questions
     ↓
User answers → stored locally
     ↓
Answers + documentText → /submit-challenge
     ↓
Backend returns:
  • Score
  • Per-question feedback, explanation, and correct answer
     ↓
Results displayed with detailed justification
🌑 Dark Mode Support
Tailwind’s darkMode: 'class' is used

Theme state is toggled in App.tsx and controlled via Navigation.jsx

Fully responsive and accessible

📸 Screenshots
Include screenshots of Upload, AskAnything, Challenge sections here.

📄 License
MIT © 2025 [Your Name]

✨ Credits
Built using:

React + Vite

Tailwind CSS

lucide-react icons

Express/Flask backend for LLM integration

yaml
Copy
Edit

---

Let me know if you want:
- Auto-generated screenshots
- A `ThemeContext` for reusable toggling
- Deployment instructions (e.g., with Vercel, Render, or Netlify)
