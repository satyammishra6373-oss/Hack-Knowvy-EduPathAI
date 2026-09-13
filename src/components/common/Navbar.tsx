import React from 'react';
import {
  GraduationCap,
  Users,
  Sparkles,
  UserCheck,
  ChevronDown,
  Building2,
  Cpu,
} from 'lucide-react';
import { StudentProfile } from '../../types';
import { SAMPLE_STUDENTS } from '../../data/mockData';

interface NavbarProps {
  currentView: 'student' | 'faculty';
  setCurrentView: (view: 'student' | 'faculty') => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentStudent: StudentProfile;
  onSelectStudent: (student: StudentProfile) => void;
  onOpenProfileEdit: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  currentStudent,
  onSelectStudent,
  onOpenProfileEdit,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">
                  EduPath <span className="text-indigo-600">AI</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  <Sparkles className="w-3 h-3" /> Gemini 2.5
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                Indian College Placement & Skill-Gap Intelligence
              </p>
            </div>
          </div>

          {/* Student / Faculty Mode Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              id="nav-btn-student-view"
              onClick={() => setCurrentView('student')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentView === 'student'
                  ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Student Portal</span>
            </button>
            <button
              id="nav-btn-faculty-view"
              onClick={() => setCurrentView('faculty')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentView === 'faculty'
                  ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Faculty & TPO</span>
            </button>
          </div>

          {/* Right actions: Student Switcher / Profile */}
          <div className="flex items-center gap-3">
            {currentView === 'student' ? (
              <div className="relative group">
                <button
                  id="student-switcher-dropdown-btn"
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-white text-left transition-colors"
                >
                  <img
                    src={currentStudent.avatar}
                    alt={currentStudent.name}
                    className="w-8 h-8 rounded-lg object-cover border border-slate-300"
                  />
                  <div className="hidden sm:block">
                    <p className="text-xs font-semibold text-slate-800 leading-tight">
                      {currentStudent.name}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate max-w-[130px]">
                      {currentStudent.branch}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-1 w-72 bg-white border border-slate-200 rounded-xl shadow-lg p-2 hidden group-hover:block z-50">
                  <div className="px-2 py-1.5 mb-1 border-b border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Switch Demo Student Profile
                    </p>
                  </div>
                  {SAMPLE_STUDENTS.map((st) => (
                    <button
                      key={st.id}
                      id={`select-student-${st.id}`}
                      onClick={() => onSelectStudent(st)}
                      className={`w-full text-left p-2 rounded-lg text-xs flex items-center gap-2.5 transition-colors ${
                        st.id === currentStudent.id
                          ? 'bg-indigo-50/80 text-indigo-900 font-semibold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <img
                        src={st.avatar}
                        alt={st.name}
                        className="w-7 h-7 rounded-md object-cover"
                      />
                      <div className="truncate">
                        <p className="font-medium text-slate-900">{st.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{st.college}</p>
                      </div>
                    </button>
                  ))}
                  <div className="mt-2 pt-2 border-t border-slate-100">
                    <button
                      id="edit-profile-action-btn"
                      onClick={onOpenProfileEdit}
                      className="w-full text-center py-1.5 px-2 rounded-lg text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
                    >
                      Customize Target Role & Skills
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>AKTU Placement Cell (TPO)</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
