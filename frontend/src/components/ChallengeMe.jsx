import React, { useState, useEffect } from 'react';
import {
  Brain,
  CheckCircle,
  XCircle,
  Trophy,
  Loader2,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { getChallengeQuestions, submitChallengeAnswers } from '../api';
import { useDocument } from '../context/DocumentContext';

const ChallengeMe = () => {
  const { documentText } = useDocument();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!documentText) {
      setError('Please upload a document first.');
      return;
    }
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await getChallengeQuestions(documentText);
      const formatted = response.questions.map((line, idx) => ({
        id: `q${idx + 1}`,
        text: line.replace(/^Q\d+[:.]?\s*/, ''),
      }));
      setQuestions(formatted);
      setAnswers({});
      setResults(null);
    } catch (err) {
      setError('Failed to load challenge questions. Please ensure the backend server is running.');
      console.error('Load questions error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      setError('Please answer all questions before submitting.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await submitChallengeAnswers({
        questions,
        answers,
        documentText,
      });
      setResults(response);
    } catch (err) {
      setError('Failed to submit answers. Please try again.');
      console.error('Submit answers error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreMessage = (score) => {
    if (score >= 80) return 'Excellent work! You have strong logical reasoning skills.';
    if (score >= 60) return 'Good job! Keep practicing to improve your logical thinking.';
    return 'Keep learning! Logic puzzles take practice to master.';
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin mr-3" />
          <span className="text-gray-600 dark:text-gray-300">Loading challenge questions...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Challenge Yourself</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Test your logical reasoning and critical thinking skills with these carefully crafted challenges.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
            <span className="text-red-700 dark:text-red-200">{error}</span>
          </div>
        </div>
      )}

      {results ? (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
            <Trophy className={`h-16 w-16 mx-auto mb-4 ${getScoreColor(results.score)}`} />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Challenge Complete!</h3>
            <div className={`text-4xl font-bold mb-2 ${getScoreColor(results.score)}`}>
              {results.score}%
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{getScoreMessage(results.score)}</p>
            <button
              onClick={loadQuestions}
              className="inline-flex items-center px-6 py-3 bg-blue-800 text-white font-medium rounded-lg hover:bg-blue-900 transition-colors duration-200"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Try New Challenge
            </button>
          </div>

          <div className="space-y-4">
            {questions.map((question, index) => {
              const userAnswer = answers[question.id] || '';
              const feedback = results.feedback?.[question.id];
              const isCorrect = feedback?.correct;

              return (
                <div key={question.id} className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-start space-x-3">
                    {isCorrect ? (
                      <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Question {index + 1}
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">{question.text}</p>
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mb-3">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Your Answer: </span>
                        <span className="text-gray-900 dark:text-gray-200">{userAnswer}</span>
                      </div>
                      {feedback?.explanation && (
                        <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
                          <span className="text-sm font-medium text-blue-800 dark:text-blue-300">Explanation: </span>
                          <span className="text-blue-700 dark:text-blue-100">{feedback.explanation}</span>
                        </div>
                      )}
                      {feedback?.correctAnswer && !isCorrect && (
                        <div className="bg-yellow-50 dark:bg-yellow-900 p-3 rounded-lg mt-2">
                          <span className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Correct Answer: </span>
                          <span className="text-yellow-700 dark:text-yellow-100">{feedback.correctAnswer}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {questions.map((question, index) => (
            <div key={question.id} className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <div className="flex items-center mb-4">
                <Brain className="h-6 w-6 text-purple-600 mr-2" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Question {index + 1} of {questions.length}
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">{question.text}</p>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Answer
                </label>
                <textarea
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  placeholder="Enter your reasoning and answer here..."
                  className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none h-24"
                />
              </div>
            </div>
          ))}

          {questions.length > 0 && (
            <div className="text-center">
              <button
                onClick={handleSubmit}
                disabled={submitting || Object.keys(answers).length < questions.length}
                className="inline-flex items-center px-8 py-4 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-lg"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-6 w-6 mr-2 animate-spin" />
                    Evaluating Answers...
                  </>
                ) : (
                  <>
                    <Trophy className="h-6 w-6 mr-2" />
                    Submit Challenge
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChallengeMe;
