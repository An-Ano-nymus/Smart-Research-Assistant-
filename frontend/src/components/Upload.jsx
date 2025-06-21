import React, { useState, useRef, useEffect } from 'react';
import {
  Upload as UploadIcon,
  File,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { uploadDocument } from '../api';
import { useDocument } from '../context/DocumentContext';

const Upload = () => {
  const { setDocumentText } = useDocument();
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
    };
  }, [filePreviewUrl]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) handleFile(files[0]);
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files[0]) handleFile(files[0]);
  };

  const handleFile = (selectedFile) => {
    const validTypes = ['application/pdf', 'text/plain'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Please upload only PDF or TXT files.');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB.');
      return;
    }

    setFile(selectedFile);
    setFilePreviewUrl(URL.createObjectURL(selectedFile));
    setError('');
    setSummary('');
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError('');

    try {
      const response = await uploadDocument(file);
      setSummary(response.summary || 'Document uploaded successfully!');
      setDocumentText(response.documentText);
    } catch (err) {
      setError('Failed to upload document. Please ensure the backend server is running.');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setFilePreviewUrl(null);
    setSummary('');
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Upload Your Document</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Upload a PDF or text file to get started. Our AI will analyze your document and provide
          an intelligent summary to help you understand the key insights.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {!file ? (
          <div
            className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200 ${
              dragActive
                ? 'border-blue-500 bg-blue-50 dark:bg-gray-800'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <UploadIcon className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Drop your file here, or click to browse
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Supports PDF and TXT files up to 10MB
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-6 py-3 bg-blue-800 text-white font-medium rounded-lg hover:bg-blue-900 transition-colors duration-200"
            >
              <UploadIcon className="h-5 w-5 mr-2" />
              Choose File
            </button>
          </div>
        ) : (
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <File className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{file.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={resetUpload}
                className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white font-medium"
              >
                Change File
              </button>
            </div>

            {!summary && !loading && (
              <button
                onClick={handleUpload}
                className="w-full bg-blue-800 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-900 transition-colors duration-200 flex items-center justify-center"
              >
                <UploadIcon className="h-5 w-5 mr-2" />
                Upload & Analyze
              </button>
            )}

            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin mr-3" />
                <span className="text-gray-600 dark:text-gray-300">Analyzing your document...</span>
              </div>
            )}

            {summary && (
              <div className="mt-6 p-6 bg-green-50 dark:bg-green-900 rounded-lg border border-green-200 dark:border-green-700">
                <div className="flex items-center mb-3">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mr-2" />
                  <h4 className="font-semibold text-green-800 dark:text-green-300">Document Summary</h4>
                </div>
                <p className="text-green-700 dark:text-green-200 leading-relaxed">{summary}</p>
              </div>
            )}

            {filePreviewUrl && file.type === 'application/pdf' && (
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">PDF Preview</h4>
                <div className="relative overflow-hidden border border-gray-300 dark:border-gray-600 rounded-lg">
                  <iframe
                    src={filePreviewUrl}
                    title="PDF Preview"
                    className="w-full"
                    style={{ height: '600px' }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900 border-t border-red-200 dark:border-red-700">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
              <span className="text-red-700 dark:text-red-200">{error}</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          After uploading, you can ask questions about your document or take on logic challenges
          using the navigation above.
        </p>
      </div>
    </div>
  );
};

export default Upload;
