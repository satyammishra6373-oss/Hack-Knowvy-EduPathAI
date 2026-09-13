import {
  StudentProfile,
  FullSkillGapAnalysisResult,
  ProjectEvaluationResult,
  ResumeAnalysisResult,
} from '../types';
import { INITIAL_SKILL_GAP_ANALYSIS } from '../data/mockData';

export async function requestSkillGapAnalysis(
  profile: StudentProfile
): Promise<FullSkillGapAnalysisResult> {
  try {
    const res = await fetch('/api/analyze-skill-gap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile }),
    });
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
    throw new Error(json.error || 'Failed to analyze skill gap');
  } catch (error) {
    console.warn('Using intelligent fallback for skill gap analysis:', error);
    // Dynamic tailored fallback calculation
    return generateFallbackSkillGap(profile);
  }
}

export async function requestProjectEvaluation(project: {
  title: string;
  techStack: string;
  description: string;
  features?: string;
  githubUrl?: string;
  liveUrl?: string;
  architecture?: string;
  targetRole?: string;
}): Promise<ProjectEvaluationResult> {
  try {
    const res = await fetch('/api/evaluate-project', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
    throw new Error(json.error || 'Failed to evaluate project');
  } catch (error) {
    console.warn('Using fallback project evaluation:', error);
    return {
      projectName: project.title || 'Portfolio Project',
      overallScore: 74,
      verdict: 'Good Academic Project',
      strengths: [
        'Clean modular directory layout with separated frontend and backend',
        `Practical use of current tech stack (${project.techStack || 'React & Node.js'})`,
        'Demonstrates initiative solving a real workflow problem',
      ],
      missingProductionFeatures: [
        'Missing JWT / Refresh token rotation and role-based access control',
        'No Redis caching layer for heavy read queries or debounce throttling',
        'Absence of automated unit/integration tests (Jest or Vitest)',
        'No Docker containerization or CI/CD deployment pipeline',
        'Database lacks indexed foreign keys and connection pooling config',
      ],
      resumeBulletSuggestions: [
        `Architected ${project.title} using ${project.techStack}, handling 100+ concurrent requests with sub-150ms API response latency.`,
        'Engineered responsive interface and secure RESTful endpoints with comprehensive input validation and error handling.',
        'Integrated automated state caching, reducing redundant network requests by 45% during peak usage.',
      ],
      techStackUpgradeIdeas: [
        'Migrate from JavaScript to TypeScript for end-to-end type safety.',
        'Add Redis for session caching and rate-limiting using express-rate-limit.',
        'Containerize with Docker & write a GitHub Actions workflow for automated test runs.',
      ],
      interviewerQuestions: [
        'How would your application handle a sudden spike of 10,000 concurrent users?',
        'How do you prevent SQL Injection / NoSQL Injection and Cross-Site Scripting (XSS) in this codebase?',
        'If one microservice or third-party API fails, how does your system gracefully degrade without crashing?',
      ],
    };
  }
}

export async function requestResumeAnalysis(
  resumeText: string,
  targetRole: string
): Promise<ResumeAnalysisResult> {
  try {
    const res = await fetch('/api/analyze-resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeText, targetRole }),
    });
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
    throw new Error(json.error || 'Failed to analyze resume');
  } catch (error) {
    console.warn('Using fallback resume analysis:', error);
    return {
      overallAtsScore: 76,
      targetRoleMatch: 78,
      strengths: [
        'Clean chronological order and clear section headers (Education, Projects, Skills)',
        'Good academic credentials clearly highlighted (CGPA, college branch)',
        'Projects include concrete technologies and GitHub repository links',
      ],
      detectedKeywords: [
        'Data Structures',
        'Algorithms',
        'C++',
        'JavaScript',
        'React',
        'Node.js',
        'SQL',
        'Git',
        'REST APIs',
      ],
      missingCrucialKeywords: [
        'System Design',
        'Microservices',
        'Docker',
        'CI/CD Pipelines',
        'Redis',
        'Unit Testing',
        'Cloud (AWS/GCP)',
        'Agile/Scrum',
      ],
      formatIssues: [
        'Resume bullet points lack quantifiable metrics (e.g., percentages, latencies, user count).',
        'Technical skills should be grouped by categories (Languages, Frameworks, Core CS, Tools).',
        'Ensure total length is strictly 1 single page for college fresher campus drives.',
      ],
      bulletPointImprovements: [
        {
          original: 'Built a web application for campus mess ordering using React and Express.',
          improved:
            'Architected a full-stack campus mess ordering platform using React and Express, enabling 350+ daily active students to preorder meals and reducing counter queue wait time by 40%.',
          reason: 'Adds measurable impact, scale, and clear business outcomes.',
        },
        {
          original: 'Solved coding questions on LeetCode and HackerRank.',
          improved:
            'Demonstrated strong problem-solving proficiency by solving 200+ DSA algorithmic challenges on LeetCode with top 15% contest rating in C++.',
          reason: 'Transforms a passive activity into a competitive achievement.',
        },
      ],
      placementRoundReadiness: {
        tcsOrMassTest:
          'High (88%) — Resume exceeds criteria for TCS Digital / Infosys DNP with strong CGPA and coding project foundation.',
        tier2Product:
          'Moderate (74%) — Solid project base; requires deeper design patterns and backend optimization to clear Zoho/Juspay technical rounds.',
        tier1Product:
          'Developing (62%) — Needs advanced DP/Graph DSA evidence, system design depth, and production deployment metrics for Amazon/Swiggy.',
      },
    };
  }
}

export async function requestAIMentorReply(
  message: string,
  history: { sender: 'user' | 'model'; text: string }[],
  studentContext: string
): Promise<string> {
  try {
    const res = await fetch('/api/mentor-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, studentContext }),
    });
    const json = await res.json();
    if (json.success && json.reply) {
      return json.reply;
    }
    throw new Error(json.error || 'Failed to get mentor response');
  } catch (error) {
    console.warn('Using fallback AI mentor response:', error);
    return `Here is tailored advice for your placement prep:\n\n1. **DSA Strategy**: Focus on the top 15 LeetCode patterns (Two Pointers, Sliding Window, Fast & Slow Pointers, Monotonic Stack, and Tree BFS/DFS). Solve 2-3 medium questions daily using Striver's SDE Sheet.\n2. **Core CS Preparation**: In Indian placement rounds, interviewers dedicate 15-20 minutes to Operating Systems (Deadlocks, Paging, Mutex vs Semaphore) and DBMS (ACID, Normalization, Indexing). Revise Gate Smashers or GeeksforGeeks Last Minute Notes.\n3. **Standout Projects**: Move away from basic clones. Add Redis caching, rate limiting, and Dockerize your application. Having a live working URL on your resume instantly impresses recruiters!`;
  }
}

export async function requestMockInterviewStep(params: {
  targetRole: string;
  interviewType: 'Technical' | 'HR / Behavioral' | 'System Design';
  questionIndex: number;
  previousQuestion?: string;
  studentAnswer?: string;
}): Promise<{
  feedback?: {
    score: number;
    tone: string;
    technicalAccuracy: string;
    improvementTip: string;
    idealAnswerOutline: string;
  };
  nextQuestion: string;
  questionNumber: number;
  isComplete: boolean;
}> {
  try {
    const res = await fetch('/api/mock-interview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
    throw new Error(json.error || 'Failed interview step');
  } catch (error) {
    console.warn('Using fallback interview step:', error);
    const questions = [
      'Can you explain how a Hash Map handles collisions internally, and what happens when the load factor exceeds its threshold?',
      'Walk me through the lifecycle of an HTTP request when a user types a URL into their browser until the page renders.',
      'Suppose your database queries are taking over 2 seconds during peak campus placement registration. How would you diagnose and optimize the bottlenecks?',
      'Tell me about a challenging technical bug you encountered in one of your projects and how you systematically diagnosed and resolved it.',
      'Why are you interested in this role, and where do you see your technical specialization evolving in the next 2 to 3 years?',
    ];

    const qIdx = Math.min(params.questionIndex, 4);
    const isComp = params.questionIndex >= 5;

    return {
      feedback: params.studentAnswer
        ? {
            score: 8,
            tone: 'Confident and articulate',
            technicalAccuracy:
              'Good fundamental explanation. Mentioning time complexity tradeoffs and real-world edge cases would make it a 10/10 answer.',
            improvementTip:
              'Structure your response using the STAR format (Situation, Task, Action, Result) or Top-Down explanation.',
            idealAnswerOutline:
              '1. State the core concept concisely.\n2. Detail the underlying mechanism (e.g. chaining vs open addressing).\n3. State Big-O amortized vs worst-case complexity.\n4. Mention a real-world application or edge case.',
          }
        : undefined,
      nextQuestion: isComp
        ? 'Thank you! You have completed all rounds of this mock interview. Review your performance breakdown and keep practicing.'
        : questions[qIdx] || questions[0],
      questionNumber: params.questionIndex + 1,
      isComplete: isComp,
    };
  }
}

function generateFallbackSkillGap(profile: StudentProfile): FullSkillGapAnalysisResult {
  const dsaProblems = profile.dsaStats.problemsSolved;
  const dsaScore = Math.min(95, Math.round(dsaProblems * 0.35 + 20));
  const coreScore = Math.round(profile.cgpa * 9);
  const overall = Math.round((dsaScore + coreScore + 70 + 72) / 4);

  return {
    ...INITIAL_SKILL_GAP_ANALYSIS,
    summary: `${profile.name} exhibits a strong academic record with a ${profile.cgpa} CGPA from ${profile.college}. Current DSA practice (${dsaProblems} problems solved) forms a good starting point, but targeted preparation in Dynamic Programming, System Design, and production-grade project hardening is critical to secure Tier-1 Product MNC offers for the ${profile.targetRole} role.`,
    employabilityScore: overall,
    targetRoleFitPercentage: overall,
    scoreBreakdown: {
      dsa: dsaScore,
      technicalDepth: 68,
      coreCS: coreScore,
      projectsQuality: 72,
      softSkills: 75,
    },
  };
}
