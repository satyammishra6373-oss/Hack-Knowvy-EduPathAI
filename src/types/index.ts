export type TargetRole =
  | 'Full Stack Web Developer'
  | 'SDE 1 (Software Development Engineer)'
  | 'AI & Data Science Engineer'
  | 'Cloud & DevOps Engineer'
  | 'Frontend Engineer'
  | 'Cybersecurity Analyst';

export type CompanyTier =
  | 'Tier 1: Product MNCs (Google, Microsoft, Amazon, Swiggy)'
  | 'Tier 2: Fast-Growing Tech & Startups (Zoho, Freshworks, Juspay)'
  | 'Tier 3 / Mass: IT Services (TCS Digital, Infosys DNP, Wipro Turbo)';

export type CollegeTier = 'Tier 1 (IIT/NIT/IIIT/BITS)' | 'Tier 2 (Top State/Autonomous)' | 'Tier 3 (Affiliated Engineering College)';

export type StudyYear = '1st Year' | '2nd Year' | '3rd Year (Pre-Final)' | '4th Year (Final Year / Placement Season)';

export type SkillProficiency = 'Beginner' | 'Intermediate' | 'Proficient' | 'Advanced';

export interface StudentSkill {
  name: string;
  category: 'Programming Languages' | 'Core CS' | 'Frameworks & Web' | 'DSA & Problem Solving' | 'Database & Cloud' | 'Tools & DevOps';
  level: SkillProficiency;
  yearsExperience?: number;
}

export interface StudentProject {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  highlights: string[];
  employabilityRating?: number; // 0 - 100
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  college: string;
  collegeTier: CollegeTier;
  branch: string; // e.g., 'Computer Science & Engineering', 'Information Technology', 'AI & DS'
  year: StudyYear;
  cgpa: number; // e.g., 8.4
  targetRole: TargetRole;
  targetCompanyTier: CompanyTier;
  currentSkills: StudentSkill[];
  dsaStats: {
    problemsSolved: number;
    easy: number;
    medium: number;
    hard: number;
    preferredLanguage: string;
  };
  projects: StudentProject[];
  certifications: string[];
  employabilityScore: number; // 0 - 100
  scoreBreakdown: {
    dsa: number; // 0-100
    technicalDepth: number; // 0-100
    coreCS: number; // 0-100
    projectsQuality: number; // 0-100
    softSkills: number; // 0-100
  };
  lastAnalysisDate?: string;
}

export interface SkillGapItem {
  skill: string;
  category: string;
  currentLevel: string;
  requiredLevel: string;
  gapSeverity: 'Critical' | 'Moderate' | 'Minor';
  industryDemand: 'High' | 'Very High' | 'Moderate';
  impactOnPlacements: string;
  recommendedAction: string;
}

export interface RoadmapMilestone {
  dayPhase: 'Day 1 - 30' | 'Day 31 - 60' | 'Day 61 - 90';
  title: string;
  focusArea: string;
  tasks: {
    id: string;
    description: string;
    category: 'DSA' | 'Dev' | 'Core CS' | 'Aptitude/Mock';
    completed: boolean;
    estimatedHours: number;
  }[];
  keyDeliverable: string;
  recommendedResources: {
    title: string;
    platform: 'LeetCode' | 'Striver SDE Sheet' | 'YouTube' | 'GitHub' | 'freeCodeCamp' | 'GeeksforGeeks' | 'Official Docs';
    url: string;
    type: 'Video' | 'Practice' | 'Article' | 'Project';
  }[];
}

export interface FullSkillGapAnalysisResult {
  summary: string;
  employabilityScore: number;
  targetRoleFitPercentage: number;
  strengths: string[];
  criticalGaps: SkillGapItem[];
  goodToHaveSkills: string[];
  scoreBreakdown: {
    dsa: number;
    technicalDepth: number;
    coreCS: number;
    projectsQuality: number;
    softSkills: number;
  };
  roadmap: RoadmapMilestone[];
  placementTips: string[];
}

export interface ProjectEvaluationResult {
  projectName: string;
  overallScore: number; // 0-100
  verdict: 'Production Ready' | 'Good Academic Project' | 'Needs Major Overhaul' | 'Basic Tutorial Clone';
  strengths: string[];
  missingProductionFeatures: string[];
  resumeBulletSuggestions: string[];
  techStackUpgradeIdeas: string[];
  interviewerQuestions: string[];
}

export interface ResumeAnalysisResult {
  overallAtsScore: number; // 0-100
  targetRoleMatch: number; // percentage
  strengths: string[];
  detectedKeywords: string[];
  missingCrucialKeywords: string[];
  formatIssues: string[];
  bulletPointImprovements: {
    original: string;
    improved: string;
    reason: string;
  }[];
  placementRoundReadiness: {
    tcsOrMassTest: string;
    tier2Product: string;
    tier1Product: string;
  };
}

export interface MockInterviewExchange {
  id: string;
  sender: 'ai' | 'student';
  text: string;
  timestamp: string;
  feedback?: {
    score: number; // 1 - 10
    tone: string;
    technicalAccuracy: string;
    improvementTip: string;
    idealAnswerOutline: string;
  };
}

export interface AssessmentQuestion {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface DepartmentAnalytics {
  department: string;
  totalStudents: number;
  averageEmployabilityScore: number;
  readinessDistribution: {
    placementReady: number; // percentage
    needsPolish: number;
    criticalGaps: number;
  };
  topMissingSkills: { skill: string; percentageMissing: number; priority: 'Critical' | 'High' | 'Medium' }[];
  popularTargetRoles: { role: string; count: number }[];
  placementEligibilityStats: {
    tier1Eligible: number;
    tier2Eligible: number;
    tier3Eligible: number;
  };
}
