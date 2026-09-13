import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Award,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Clock,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SAMPLE_ASSESSMENT_QUESTIONS } from '../../data/mockData';
import { AssessmentQuestion } from '../../types';

interface AssessmentQuizViewProps {
  onAssessmentCompleted?: (scorePercentage: number) => void;
}

export const AssessmentQuizView: React.FC<AssessmentQuizViewProps> = ({
  onAssessmentCompleted,
}) => {
  const [questions] = useState<AssessmentQuestion[]>(SAMPLE_ASSESSMENT_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [answersHistory, setAnswersHistory] = useState<
    { questionId: string; selectedIndex: number; isCorrect: boolean }[]
  >([]);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;

    const isCorrect = selectedOption === currentQ.correctIndex;
    if (isCorrect) {
      setScore((s) => s + 1);
    }

    setAnswersHistory((prev) => [
      ...prev,
      {
        questionId: currentQ.id,
        selectedIndex: selectedOption,
        isCorrect,
      },
    ]);

    setIsAnswerSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsFinished(true);
      const totalScorePct = Math.round(((score + (selectedOption === currentQ.correctIndex ? 0 : 0)) / questions.length) * 100);
      if (onAssessmentCompleted) {
        onAssessmentCompleted(totalScorePct);
      }
      if (totalScorePct >= 70) {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setAnswersHistory([]);
    setIsFinished(false);
  };

  const scorePercentage = Math.round((score / questions.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <HelpCircle className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-sans">
                  Technical Employability Assessment
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Timed multiple-choice evaluation of Core CS, DSA, and System Design fundamentals.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
              {questions.length} Placement Questions
            </span>
          </div>
        </div>
      </div>

      {!isFinished ? (
        /* Quiz Active Container */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          {/* Progress & Topic */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                {currentQ.topic}
              </span>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                  currentQ.difficulty === 'Hard'
                    ? 'bg-rose-50 text-rose-700'
                    : currentQ.difficulty === 'Medium'
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                {currentQ.difficulty}
              </span>
            </div>

            <span className="text-xs font-medium text-slate-400">
              Current Score: {score}/{currentIndex + (isAnswerSubmitted ? 1 : 0)}
            </span>
          </div>

          {/* Question Text */}
          <h3 className="text-base font-bold text-slate-900 leading-relaxed">
            {currentQ.question}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;
              const showResult = isAnswerSubmitted;

              let optionClasses =
                'border-slate-200 hover:border-slate-300 bg-slate-50/70 hover:bg-white text-slate-800';

              if (isSelected && !showResult) {
                optionClasses = 'border-indigo-600 bg-indigo-50/60 text-indigo-900 font-semibold ring-1 ring-indigo-600';
              } else if (showResult) {
                if (isCorrect) {
                  optionClasses = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold';
                } else if (isSelected && !isCorrect) {
                  optionClasses = 'border-rose-500 bg-rose-50 text-rose-950';
                } else {
                  optionClasses = 'border-slate-200 bg-slate-50/40 text-slate-400 opacity-60';
                }
              }

              return (
                <div
                  key={idx}
                  id={`quiz-option-${idx}`}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all text-xs leading-relaxed ${optionClasses}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-white border border-slate-300 flex items-center justify-center font-bold text-slate-600 shrink-0 text-[11px]">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>

                  {showResult && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {showResult && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Detailed Explanation if answered */}
          {isAnswerSubmitted && (
            <div className="bg-indigo-50/60 rounded-xl p-4 border border-indigo-100 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-indigo-950 text-xs">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>Technical Explanation & Interview Context:</span>
              </div>
              <p className="text-indigo-900 leading-relaxed pt-1">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex justify-end pt-2">
            {!isAnswerSubmitted ? (
              <button
                id="check-answer-btn"
                onClick={handleCheckAnswer}
                disabled={selectedOption === null}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all disabled:opacity-50"
              >
                Check Answer
              </button>
            ) : (
              <button
                id="next-question-btn"
                onClick={handleNextQuestion}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs"
              >
                <span>
                  {currentIndex + 1 < questions.length ? 'Next Question' : 'View Final Results'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results Container */
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto">
            <Award className="w-10 h-10" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Assessment Completed
            </span>
            <h3 className="text-2xl font-bold text-slate-900">
              You Scored {score} out of {questions.length} ({scorePercentage}%)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {scorePercentage >= 80
                ? 'Outstanding performance! You show solid Core CS and DSA comprehension typical of Tier-1 candidates.'
                : scorePercentage >= 60
                ? 'Good effort! You cleared the fundamental baseline for TCS Digital and mid-tier tech, but need revision on low-level internals.'
                : 'Identified critical gaps in DBMS & OS concepts. Review Gate Smashers and Striver SDE sheets in your roadmap.'}
            </p>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Assessment</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
