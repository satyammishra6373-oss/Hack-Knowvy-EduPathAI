import React, { useState } from 'react';
import { Navbar } from './components/common/Navbar';
import { StudentDashboard } from './components/student/StudentDashboard';
import { FacultyDashboard } from './components/faculty/FacultyDashboard';
import { ProfileEditorModal } from './components/student/ProfileEditorModal';
import { SAMPLE_STUDENTS, INITIAL_SKILL_GAP_ANALYSIS } from './data/mockData';
import { StudentProfile, FullSkillGapAnalysisResult } from './types';
import { requestSkillGapAnalysis } from './services/apiClient';
import { Sparkles, Heart, GraduationCap, Github } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [currentView, setCurrentView] = useState<'student' | 'faculty'>('student');
  const [currentStudent, setCurrentStudent] = useState<StudentProfile>(SAMPLE_STUDENTS[0]);
  const [analysis, setAnalysis] = useState<FullSkillGapAnalysisResult>(INITIAL_SKILL_GAP_ANALYSIS);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setStatusNotification(msg);
    setTimeout(() => setStatusNotification(null), 3500);
  };

  const handleRefreshAnalysis = async (customProfile?: StudentProfile) => {
    const profileToAnalyze = customProfile || currentStudent;
    setIsLoadingAnalysis(true);
    try {
      const result = await requestSkillGapAnalysis(profileToAnalyze);
      setAnalysis(result);

      // Update student scores synchronously
      setCurrentStudent((prev) => ({
        ...prev,
        employabilityScore: result.employabilityScore,
        scoreBreakdown: result.scoreBreakdown,
        lastAnalysisDate: new Date().toISOString().split('T')[0],
      }));

      showNotification('Gemini Skill Gap Analysis & 30/60/90-Day Roadmap updated!');
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.7 },
      });
    } catch (err) {
      console.error(err);
      showNotification('Error refreshing analysis. Retrying with fallback.');
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  const handleSelectStudent = (student: StudentProfile) => {
    setCurrentStudent(student);
    handleRefreshAnalysis(student);
  };

  const handleSaveProfile = (updated: StudentProfile) => {
    setCurrentStudent(updated);
    handleRefreshAnalysis(updated);
    showNotification(`Profile for ${updated.name} saved and benchmarks recalculated!`);
  };

  const handleToggleTask = (phaseIndex: number, taskId: string) => {
    setAnalysis((prev) => {
      const newRoadmap = [...prev.roadmap];
      const targetPhase = newRoadmap[phaseIndex];
      if (targetPhase) {
        targetPhase.tasks = targetPhase.tasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        );
      }
      return { ...prev, roadmap: newRoadmap };
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {statusNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{statusNotification}</span>
        </div>
      )}

      {/* Main Navigation Header */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        activeTab=""
        setActiveTab={() => {}}
        currentStudent={currentStudent}
        onSelectStudent={handleSelectStudent}
        onOpenProfileEdit={() => setIsProfileModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'student' ? (
          <StudentDashboard
            student={currentStudent}
            analysis={analysis}
            isLoadingAnalysis={isLoadingAnalysis}
            onRefreshAnalysis={() => handleRefreshAnalysis()}
            onUpdateTask={handleToggleTask}
            onOpenProfileEdit={() => setIsProfileModalOpen(true)}
          />
        ) : (
          <FacultyDashboard />
        )}
      </main>

      {/* Profile Edit Modal */}
      <ProfileEditorModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        student={currentStudent}
        onSaveProfile={handleSaveProfile}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <GraduationCap className="h-4 w-4" />
            </div>
            <span className="font-bold text-slate-800">EduPath AI</span>
            <span>— Empowering Indian College Engineering Students for Day-1 Placement Readiness</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              Powered by <strong className="text-indigo-600 font-semibold">Google Gemini 2.5 Flash</strong>
            </span>
            <span>•</span>
            <span>Batch 2026 Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
