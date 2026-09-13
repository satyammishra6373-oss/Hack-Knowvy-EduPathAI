import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  HelpCircle,
  Copy,
  Check,
  RefreshCw,
  Lightbulb,
} from 'lucide-react';
import { StudentProfile } from '../../types';
import { requestAIMentorReply } from '../../services/apiClient';

interface AIMentorViewProps {
  student: StudentProfile;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'model';
  text: string;
  timestamp: string;
}

export const AIMentorView: React.FC<AIMentorViewProps> = ({ student }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'model',
      text: `Namaste ${student.name.split(' ')[0]}! I am your AI Placement Coach at EduPath AI.\n\nI see you are a ${student.year} student in ${student.branch} at ${student.college}, targeting **${student.targetRole}** for **${student.targetCompanyTier}**.\n\nWhether you need help cracking Online Assessments (OAs), cracking Striver's DSA patterns, clarifying Core CS concepts (OS/DBMS/CN), or structuring your project defense, ask me anything!`,
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'How do I crack TCS Digital & Prime coding rounds?',
    'I am from a Tier-3 college. How do I get off-campus referrals for Swiggy/Amazon?',
    'Top 5 most-asked Operating System concepts in campus tech interviews',
    'How should I explain my college project using the STAR method?',
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const studentContext = `Student: ${student.name}, College: ${student.college} (${student.collegeTier}), Branch: ${student.branch}, Year: ${student.year}, CGPA: ${student.cgpa}, Target Role: ${student.targetRole}, Target Tier: ${student.targetCompanyTier}, DSA Solved: ${student.dsaStats.problemsSolved}.`;
      
      const history = messages.map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const reply = await requestAIMentorReply(text, history, studentContext);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'model',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'model',
          text: 'I ran into an issue connecting to the mentor service. Please try asking again.',
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col h-[700px]">
      {/* Header */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>EduPath AI Placement Mentor</span>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-semibold border border-indigo-200">
                Gemini 2.5 Flash
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Trained on Indian campus recruitment patterns, OA rounds, and HR behavioral frameworks.
            </p>
          </div>
        </div>

        <button
          id="clear-chat-history-btn"
          onClick={() =>
            setMessages([
              {
                id: 'reset',
                sender: 'model',
                text: `Ready for your next question! Ask anything about coding rounds, core subjects, or resume tips.`,
                timestamp: 'Just now',
              },
            ])
          }
          className="text-xs text-slate-500 hover:text-slate-800 p-2 rounded-lg hover:bg-slate-200/60 transition-colors"
          title="Reset conversation"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2 bg-indigo-50/40 border-b border-indigo-100/50 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[11px] font-bold text-indigo-900 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-600" />
          Quick Ask:
        </span>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            id={`quick-prompt-${idx}`}
            onClick={() => handleSend(prompt)}
            className="text-[11px] font-medium bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 px-3 py-1 rounded-full border border-slate-200 whitespace-nowrap transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isAi = msg.sender === 'model';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isAi ? '' : 'flex-row-reverse'}`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white text-xs ${
                  isAi ? 'bg-indigo-600' : 'bg-slate-800'
                }`}
              >
                {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed relative group ${
                  isAi
                    ? 'bg-slate-50 text-slate-800 border border-slate-200/80 rounded-tl-sm'
                    : 'bg-indigo-600 text-white rounded-tr-sm'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200/40 text-[10px] text-slate-400">
                  <span>{msg.timestamp}</span>
                  {isAi && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-slate-500 hover:text-indigo-600 ml-2"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 text-white">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-sm p-4 text-xs text-slate-600 flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]" />
              </div>
              <span className="text-[11px] text-slate-400">
                EduPath AI Mentor is thinking...
              </span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-3 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            id="mentor-chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about DSA, system design, TCS NQT, or placement preparation..."
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
          <button
            id="mentor-chat-send-btn"
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs disabled:opacity-50 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
