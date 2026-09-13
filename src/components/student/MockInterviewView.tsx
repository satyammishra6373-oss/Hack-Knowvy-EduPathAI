import React, { useState } from 'react';
import {
  Mic,
  MessageSquare,
  Sparkles,
  Award,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StudentProfile } from '../../types';
import { requestMockInterviewStep } from '../../services/apiClient';

interface MockInterviewViewProps {
  student: StudentProfile;
}

interface InterviewExchangeItem {
  questionNumber: number;
  question: string;
  studentAnswer: string;
  feedback?: {
    score: number;
    tone: string;
    technicalAccuracy: string;
    improvementTip: string;
    idealAnswerOutline: string;
  };
}

export const MockInterviewView: React.FC<MockInterviewViewProps> = ({
  student,
}) => {
  const [interviewType, setInterviewType] = useState<
    'Technical' | 'HR / Behavioral' | 'System Design'
  >('Technical');
  const [hasStarted, setHasStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [studentAnswer, setStudentAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [exchanges, setExchanges] = useState<InterviewExchangeItem[]>([]);

  const sampleAnswers: Record<string, string> = {
    Technical:
      'In a Hash Map, collisions are usually resolved via Separate Chaining (using a linked list or Red-Black tree in Java 8+) or Open Addressing with Linear/Quadratic Probing. When the load factor exceeds 0.75, the map automatically rehashes into a doubled array capacity to preserve average O(1) lookup time.',
    'HR / Behavioral':
      'In our final year college project, our team had conflicting opinions regarding whether to use SQL or MongoDB. I organized a technical decision meeting where we listed our query access patterns and ACID requirements. Since our food mess application required atomic balance deductions, I demonstrated that PostgreSQL was the safer choice. We shipped on schedule.',
    'System Design':
      'To prevent double payment charges under network retries, I would implement Idempotency Keys. The client generates a UUID for each charge request. The server checks a Redis key with SETNX or checks a unique constraint in the payments table before executing the gateway call.',
  };

  const startInterview = async () => {
    setIsLoading(true);
    setHasStarted(true);
    setIsCompleted(false);
    setExchanges([]);
    setCurrentQuestionNumber(1);
    setStudentAnswer('');

    try {
      const step = await requestMockInterviewStep({
        targetRole: student.targetRole,
        interviewType,
        questionIndex: 1,
      });
      setCurrentQuestion(step.nextQuestion);
    } catch (err) {
      console.error(err);
      setCurrentQuestion(
        'Can you explain the difference between a Process and a Thread, and how inter-process communication is handled?'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!studentAnswer.trim()) return;

    setIsLoading(true);
    try {
      const step = await requestMockInterviewStep({
        targetRole: student.targetRole,
        interviewType,
        questionIndex: currentQuestionNumber,
        previousQuestion: currentQuestion,
        studentAnswer: studentAnswer.trim(),
      });

      // Save exchange
      const completedExchange: InterviewExchangeItem = {
        questionNumber: currentQuestionNumber,
        question: currentQuestion,
        studentAnswer: studentAnswer.trim(),
        feedback: step.feedback,
      };

      setExchanges((prev) => [...prev, completedExchange]);

      if (step.isComplete || currentQuestionNumber >= 4) {
        setIsCompleted(true);
        setCurrentQuestion('Mock Interview completed! Review your feedback below.');
        confetti({
          particleCount: 50,
          spread: 80,
          origin: { y: 0.6 },
        });
      } else {
        setCurrentQuestionNumber(currentQuestionNumber + 1);
        setCurrentQuestion(step.nextQuestion);
        setStudentAnswer('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSampleAnswer = () => {
    setStudentAnswer(sampleAnswers[interviewType] || sampleAnswers['Technical']);
  };

  return (
    <div className="space-y-6">
      {/* Configuration / Status Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <Mic className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-sans">
                  AI Campus Mock Interview Simulator
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Simulates realistic technical & HR rounds with live scoring and model answers.
                </p>
              </div>
            </div>
          </div>

          {/* Round Type Switcher */}
          {!hasStarted && (
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
              {(['Technical', 'System Design', 'HR / Behavioral'] as const).map(
                (type) => (
                  <button
                    key={type}
                    onClick={() => setInterviewType(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      interviewType === type
                        ? 'bg-white text-indigo-700 font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {type}
                  </button>
                )
              )}
            </div>
          )}

          {hasStarted && (
            <button
              onClick={startInterview}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart Interview</span>
            </button>
          )}
        </div>

        {/* Start CTA if not started */}
        {!hasStarted && (
          <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-indigo-50/80 to-purple-50/60 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Ready for {interviewType} Round
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                4-Question Placement Simulation for {student.targetRole}
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Get real-time feedback on your technical accuracy, confidence, and STAR delivery.
              </p>
            </div>
            <button
              id="start-interview-btn"
              onClick={startInterview}
              disabled={isLoading}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all active:scale-95 shrink-0"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Begin Mock Interview</span>
            </button>
          </div>
        )}
      </div>

      {/* Active Question Box */}
      {hasStarted && !isCompleted && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
              Question {currentQuestionNumber} of 4 • {interviewType}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Target: {student.targetCompanyTier}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 text-white text-sm font-semibold leading-relaxed">
            {isLoading && !currentQuestion ? (
              <span className="text-slate-400 animate-pulse">
                Interviewer is drafting next question...
              </span>
            ) : (
              currentQuestion
            )}
          </div>

          {/* Student Response Area */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-medium text-slate-600">
              <span>Your Spoken / Written Answer:</span>
              <button
                id="load-sample-answer-btn"
                onClick={loadSampleAnswer}
                className="text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                + Fill Sample Answer for Demo
              </button>
            </div>
            <textarea
              id="mock-interview-answer-input"
              rows={5}
              value={studentAnswer}
              onChange={(e) => setStudentAnswer(e.target.value)}
              placeholder="State your approach, logic, time complexity, and practical tradeoffs..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-[11px] text-slate-400">
              Tip: Explain brute force first before stating the optimal solution.
            </p>
            <button
              id="submit-interview-answer-btn"
              onClick={submitAnswer}
              disabled={isLoading || !studentAnswer.trim()}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-2 shadow-xs disabled:opacity-50 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoading ? 'Evaluating with Gemini...' : 'Submit & Get AI Feedback'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Completed Summary Banner */}
      {isCompleted && (
        <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-emerald-950">
                Mock Interview Successfully Completed!
              </h3>
              <p className="text-xs text-emerald-800 mt-0.5">
                Review your detailed AI scoring and ideal answer outlines below.
              </p>
            </div>
          </div>
          <button
            onClick={startInterview}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
          >
            Start Another Round
          </button>
        </div>
      )}

      {/* History of Evaluated Exchanges */}
      {exchanges.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Evaluation Transcript & Technical Breakdown
          </h3>

          {exchanges.map((ex, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs"
            >
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800">
                  Question #{ex.questionNumber}
                </span>
                {ex.feedback && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">Score:</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {ex.feedback.score} / 10
                    </span>
                  </div>
                )}
              </div>

              <div className="p-5 space-y-4 text-xs">
                <div>
                  <p className="font-semibold text-slate-500 text-[11px] uppercase tracking-wider">
                    Interviewer Question:
                  </p>
                  <p className="font-bold text-slate-900 mt-0.5 text-sm">
                    {ex.question}
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="font-semibold text-slate-500 text-[11px] uppercase tracking-wider">
                    Your Response:
                  </p>
                  <p className="text-slate-800 mt-1 leading-relaxed">
                    {ex.studentAnswer}
                  </p>
                </div>

                {ex.feedback && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    <div className="bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-200/60 space-y-1">
                      <span className="font-bold text-emerald-900 text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Technical Accuracy & Tone
                      </span>
                      <p className="text-emerald-950 text-xs leading-relaxed">
                        {ex.feedback.technicalAccuracy}
                      </p>
                      <p className="text-[11px] text-emerald-700 font-medium pt-1">
                        Tone: {ex.feedback.tone}
                      </p>
                    </div>

                    <div className="bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-200/60 space-y-1">
                      <span className="font-bold text-indigo-900 text-[11px] flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        Key Improvement & Ideal Model Answer
                      </span>
                      <p className="text-indigo-950 text-xs leading-relaxed">
                        {ex.feedback.improvementTip}
                      </p>
                      <div className="pt-2 text-[11px] text-indigo-800 whitespace-pre-wrap font-mono bg-white/70 p-2 rounded-lg border border-indigo-100">
                        {ex.feedback.idealAnswerOutline}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
