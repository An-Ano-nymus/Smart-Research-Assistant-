import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Upload a document file (image/PDF)
export const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Ask a question based on the document
export const askQuestion = async (question, documentText) => {
  const response = await api.post('/ask', {
    question,
    documentText,
  });

  return response.data;
};

// Get challenge questions based on the document
export const getChallengeQuestions = async (documentText) => {
  const response = await api.post('/challenge', {
    documentText,
  });

  return response.data;
};

// Submit answers to challenge questions
export const submitChallengeAnswers = async ({ questions, answers, documentText }) => {
  const response = await api.post('/challenge', {
    documentText,
    answers,
    questions,
  });

  return response.data;
};

export default api;
