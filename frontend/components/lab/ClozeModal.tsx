'use client';

import { useState } from 'react';
import { CheckCircle, Lightbulb, BookOpen } from 'lucide-react';
import { ClozeExercise } from '@/lib/cloze-exercises';

interface ClozeModalProps {
  exercise: ClozeExercise;
  onComplete: (allCorrect: boolean) => void;
  onClose: () => void;
}

/**
 * ClozeModal Component
 * 
 * A fill-in-the-blank modal that helps students connect their experiment
 * observations to scientific rules. Part of the VRA (Visual-Representational-Abstract)
 * learning progression, representing the Abstract layer.
 * 
 * Supports CLIL (Content and Language Integrated Learning) by reinforcing
 * scientific vocabulary through structured sentence completion.
 */
export function ClozeModal({ exercise, onComplete, onClose }: ClozeModalProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Record<string, boolean>>({});

  const handleSelectAnswer = (blankId: string, answer: string) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [blankId]: answer }));
  };

  const handleSubmit = () => {
    const newResults: Record<string, boolean> = {};
    exercise.blanks.forEach(blank => {
      newResults[blank.id] = answers[blank.id] === blank.correctAnswer;
    });
    setResults(newResults);
    setSubmitted(true);
  };

  const allCorrect = submitted && Object.values(results).every(r => r);
  const allAnswered = exercise.blanks.every(blank => answers[blank.id]);

  // Parse template and render with blanks
  const renderTemplate = () => {
    const parts = exercise.template.split(/(\{blank\d+\})/);
    return parts.map((part, index) => {
      const blankMatch = part.match(/\{(blank\d+)\}/);
      if (blankMatch) {
        const blankId = blankMatch[1];
        const blank = exercise.blanks.find(b => b.id === blankId);
        if (!blank) return null;
        
        const isCorrect = results[blankId];
        const selectedAnswer = answers[blankId];
        
        return (
          <span key={index} className="inline-block mx-1">
            <select
              value={selectedAnswer || ''}
              onChange={(e) => handleSelectAnswer(blankId, e.target.value)}
              disabled={submitted}
              className={`px-3 py-1 rounded border-2 font-medium transition-colors ${
                submitted
                  ? isCorrect
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-red-500 bg-red-50 text-red-700'
                  : selectedAnswer
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-blue-300 bg-white hover:border-blue-500'
              }`}
            >
              <option value="">Select...</option>
              {blank.options.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {submitted && !isCorrect && (
              <span className="ml-1 text-green-600 text-sm font-medium">({blank.correctAnswer})</span>
            )}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <BookOpen className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">🧠 Scientific Rule Check</h2>
            <p className="text-sm text-gray-500">Connect your observation to the scientific rule</p>
          </div>
        </div>

        {/* Instructions */}
        <p className="text-gray-600 mb-4">
          Complete the sentence by selecting the correct words:
        </p>

        {/* Template with blanks */}
        <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-lg p-6 text-lg leading-relaxed mb-6 border border-purple-100">
          {renderTemplate()}
        </div>

        {/* Results feedback */}
        {submitted && (
          <div className={`p-4 rounded-lg mb-6 flex items-start gap-3 ${
            allCorrect ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'
          }`}>
            {allCorrect ? (
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <Lightbulb className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className={`font-medium ${allCorrect ? 'text-green-800' : 'text-amber-800'}`}>
                {allCorrect ? 'Excellent! You got it right!' : 'Almost there! Here\'s the explanation:'}
              </p>
              <p className="text-gray-700 mt-1">{exercise.explanation}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          {!submitted && (
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Skip
            </button>
          )}
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Check My Answer
            </button>
          ) : (
            <button
              onClick={() => onComplete(allCorrect)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              {allCorrect ? '🎉 Continue' : 'Continue Learning'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClozeModal;
