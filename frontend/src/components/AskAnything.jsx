import React, { useState } from 'react';
import {
  Send,
  MessageCircle,
  Lightbulb,
  Loader2,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { askQuestion } from '../api';
import { useDocument } from '../context/DocumentContext';

const AskAnything = () => {
  const { documentText } = useDocument();
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    if (!documentText) {
      setError('No document uploaded. Please upload a document first.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const memoryContext = history
        .map((item, i) => `Q${i + 1}: ${item.question}\nA${i + 1}: ${item.answer}`)
        .join('\n\n');

      const memoryAwareQuestion = memoryContext
        ? `${memoryContext}\n\nQ${history.length + 1}: ${question}`
        : question;

      const response = await askQuestion(memoryAwareQuestion, documentText);

      const answer = response.answer || 'No answer provided.';
      const justification = response.justification || 'Derived from document content.';

      setHistory([
        ...history,
        {
          question,
          answer,
          justification,
        },
      ]);
      setQuestion('');
    } catch (err) {
      setError('Failed to get an answer. Please ensure the backend server is running.');
      console.error('Ask question error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    setQuestion('');
    setError('');
  };

  const suggestedQuestions = [
    "What are the main themes discussed in this document?",
    "Can you summarize the key findings?",
    "What methodology was used in this research?",
    "What are the implications of these results?",
    "Are there any limitations mentioned?",
  ];

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Ask Anything</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Ask follow-up questions and get contextual answers with justifications backed by your uploaded document.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="question" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Question
              </label>
              <div className="relative">
                <textarea
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask a new or follow-up question..."
                  className="w-full p-4 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-32 pr-12"
                  disabled={loading}
                />
                <MessageCircle className="absolute top-4 right-4 h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
            </div>

            <button
              type="submit"
              disabled={!question.trim() || loading}
              className="w-full bg-blue-800 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Getting Answer...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Ask Question
                </>
              )}
            </button>
          </form>

          {history.length === 0 && !loading && (
            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Suggested Questions:</h3>
              <div className="grid gap-2">
                {suggestedQuestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setQuestion(suggestion)}
                    className="text-left p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900 border-t border-red-200 dark:border-red-700">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
              <span className="text-red-700 dark:text-red-200">{error}</span>
            </div>
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div className="mt-8 space-y-6">
          {history.map((item, index) => (
            <div key={index} className="space-y-4">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                <div className="flex items-center mb-4">
                  <MessageCircle className="h-6 w-6 text-blue-600 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Q{index + 1}: {item.question}
                  </h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  <strong className="text-blue-800 dark:text-blue-400">Answer:</strong> {item.answer}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                <div className="flex items-center mb-4">
                  <Lightbulb className="h-6 w-6 text-amber-600 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Justification</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{item.justification}</p>
              </div>
            </div>
          ))}

          <div className="text-center">
            <button
              onClick={handleClearHistory}
              className="inline-flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Clear History
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AskAnything;
