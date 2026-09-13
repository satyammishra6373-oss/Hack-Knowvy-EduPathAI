import React, { useState } from 'react';
import { X, Sparkles, User, GraduationCap, Target, Award } from 'lucide-react';
import {
  StudentProfile,
  TargetRole,
  CompanyTier,
  CollegeTier,
  StudyYear,
} from '../../types';

interface ProfileEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  onSaveProfile: (updatedProfile: StudentProfile) => void;
}

export const ProfileEditorModal: React.FC<ProfileEditorModalProps> = ({
  isOpen,
  onClose,
  student,
  onSaveProfile,
}) => {
  const [formData, setFormData] = useState<StudentProfile>({ ...student });

  if (!isOpen) return null;

  const targetRoles: TargetRole[] = [
    'SDE 1 (Software Development Engineer)',
    'Full Stack Web Developer',
    'AI & Data Science Engineer',
    'Cloud & DevOps Engineer',
    'Frontend Engineer',
    'Cybersecurity Analyst',
  ];

  const companyTiers: CompanyTier[] = [
    'Tier 1: Product MNCs (Google, Microsoft, Amazon, Swiggy)',
    'Tier 2: Fast-Growing Tech & Startups (Zoho, Freshworks, Juspay)',
    'Tier 3 / Mass: IT Services (TCS Digital, Infosys DNP, Wipro Turbo)',
  ];

  const collegeTiers: CollegeTier[] = [
    'Tier 1 (IIT/NIT/IIIT/BITS)',
    'Tier 2 (Top State/Autonomous)',
    'Tier 3 (Affiliated Engineering College)',
  ];

  const studyYears: StudyYear[] = [
    '1st Year',
    '2nd Year',
    '3rd Year (Pre-Final)',
    '4th Year (Final Year / Placement Season)',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full p-6 space-y-5 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Customize Student Profile & Placement Goals
              </h3>
              <p className="text-xs text-slate-500">
                Adjusting goals updates your AI employability score and roadmap benchmarks.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                College / University
              </label>
              <input
                type="text"
                value={formData.college}
                onChange={(e) =>
                  setFormData({ ...formData, college: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                College Tier Category
              </label>
              <select
                value={formData.collegeTier}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    collegeTier: e.target.value as CollegeTier,
                  })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
              >
                {collegeTiers.map((tier) => (
                  <option key={tier} value={tier}>
                    {tier}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Engineering Branch / Degree
              </label>
              <input
                type="text"
                value={formData.branch}
                onChange={(e) =>
                  setFormData({ ...formData, branch: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Academic Year
              </label>
              <select
                value={formData.year}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    year: e.target.value as StudyYear,
                  })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
              >
                {studyYears.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Current CGPA (Out of 10)
              </label>
              <input
                type="number"
                step="0.01"
                min="4"
                max="10"
                value={formData.cgpa}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cgpa: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Dream Role
              </label>
              <select
                value={formData.targetRole}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    targetRole: e.target.value as TargetRole,
                  })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden font-semibold text-indigo-700"
              >
                {targetRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Company Tier
              </label>
              <select
                value={formData.targetCompanyTier}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    targetCompanyTier: e.target.value as CompanyTier,
                  })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
              >
                {companyTiers.map((tier) => (
                  <option key={tier} value={tier}>
                    {tier}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                DSA Questions Solved Count
              </label>
              <input
                type="number"
                min="0"
                value={formData.dsaStats.problemsSolved}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dsaStats: {
                      ...formData.dsaStats,
                      problemsSolved: parseInt(e.target.value, 10) || 0,
                    },
                  })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                DSA Primary Language
              </label>
              <input
                type="text"
                value={formData.dsaStats.preferredLanguage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dsaStats: {
                      ...formData.dsaStats,
                      preferredLanguage: e.target.value,
                    },
                  })
                }
                placeholder="e.g. C++, Java, Python"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              id="save-profile-btn"
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
            >
              Save Profile & Update Benchmarks
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
