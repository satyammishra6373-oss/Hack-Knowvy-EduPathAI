import { GoogleGenAI } from '@google/genai';
import {
  StudentProfile,
  FullSkillGapAnalysisResult,
  ProjectEvaluationResult,
  ResumeAnalysisResult,
} from '../types';

// Lazy initialized Gemini client to prevent startup failure if key is injected at runtime
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    aiClient = new GoogleGenAI(apiKey ? { apiKey } : {});
  }
  return aiClient;
}

export async function analyzeStudentSkillGapWithGemini(
  profile: StudentProfile
): Promise<FullSkillGapAnalysisResult> {
  const ai = getAiClient();

  const prompt = `You are an elite Tech Career Coach & Placement Strategist specializing in Indian College Engineering Placements (Tier 1/2/3 colleges, Product MNCs like Amazon/Google/Swiggy/Flipkart, Fast startups like Zoho/Freshworks, and IT Service giants like TCS Digital/Ninja).

Analyze this Indian college student profile:
Name: ${profile.name}
College: ${profile.college} (${profile.collegeTier})
Branch: ${profile.branch} | Year: ${profile.year} | CGPA: ${profile.cgpa}
Target Role: ${profile.targetRole}
Target Company Tier: ${profile.targetCompanyTier}
Current Skills: ${JSON.stringify(profile.currentSkills)}
DSA Solved Count: ${profile.dsaStats.problemsSolved} (Easy: ${profile.dsaStats.easy}, Medium: ${profile.dsaStats.medium}, Hard: ${profile.dsaStats.hard}) in ${profile.dsaStats.preferredLanguage}
Projects: ${JSON.stringify(profile.projects)}
Certifications: ${JSON.stringify(profile.certifications)}

Provide a deep, realistic, and brutally honest skill-gap analysis and a customized 30/60/90-Day Placement Roadmap.
Return strictly valid JSON adhering exactly to this TypeScript schema:
{
  "summary": string (3-4 sentences diagnostic of student's current standing in Indian tech hiring landscape),
  "employabilityScore": number (integer 0 to 100),
  "targetRoleFitPercentage": number (integer 0 to 100),
  "strengths": string[] (4-5 concrete bullet points),
  "criticalGaps": [
    {
      "skill": string,
      "category": string,
      "currentLevel": string,
      "requiredLevel": string,
      "gapSeverity": "Critical" | "Moderate" | "Minor",
      "industryDemand": "High" | "Very High" | "Moderate",
      "impactOnPlacements": string (e.g. why this blocks OA or Round 2),
      "recommendedAction": string (actionable steps)
    }
  ],
  "goodToHaveSkills": string[],
  "scoreBreakdown": {
    "dsa": number (0-100),
    "technicalDepth": number (0-100),
    "coreCS": number (0-100),
    "projectsQuality": number (0-100),
    "softSkills": number (0-100)
  },
  "roadmap": [
    {
      "dayPhase": "Day 1 - 30",
      "title": string,
      "focusArea": string,
      "tasks": [
        {
          "id": string,
          "description": string,
          "category": "DSA" | "Dev" | "Core CS" | "Aptitude/Mock",
          "completed": boolean,
          "estimatedHours": number
        }
      ],
      "keyDeliverable": string,
      "recommendedResources": [
        {
          "title": string,
          "platform": "LeetCode" | "Striver SDE Sheet" | "YouTube" | "GitHub" | "freeCodeCamp" | "GeeksforGeeks" | "Official Docs",
          "url": string,
          "type": "Video" | "Practice" | "Article" | "Project"
        }
      ]
    },
    {
      "dayPhase": "Day 31 - 60",
      "title": string,
      "focusArea": string,
      "tasks": [...],
      "keyDeliverable": string,
      "recommendedResources": [...]
    },
    {
      "dayPhase": "Day 61 - 90",
      "title": string,
      "focusArea": string,
      "tasks": [...],
      "keyDeliverable": string,
      "recommendedResources": [...]
    }
  ],
  "placementTips": string[] (4 valuable, Indian campus placement tips e.g. OA time allocation, STAR answers, resume formatting)
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      temperature: 0.3,
    },
  });

  const responseText = response.text || '{}';
  return JSON.parse(responseText);
}

export async function evaluateProjectWithGemini(projectData: {
  title: string;
  techStack: string;
  description: string;
  features?: string;
  githubUrl?: string;
  liveUrl?: string;
  architecture?: string;
  targetRole?: string;
}): Promise<ProjectEvaluationResult> {
  const ai = getAiClient();

  const prompt = `You are a Principal Software Engineer & Campus Placement Technical Interviewer evaluating a candidate's project for placement readiness.

Project Details:
Title: ${projectData.title}
Tech Stack: ${projectData.techStack}
Description: ${projectData.description}
Key Features: ${projectData.features || 'Standard full stack features'}
Target Role: ${projectData.targetRole || 'Software Development Engineer (SDE 1)'}
Live URL: ${projectData.liveUrl || 'None provided'}
GitHub Repo: ${projectData.githubUrl || 'None provided'}
Architecture / Design: ${projectData.architecture || 'Monolithic application'}

Evaluate whether this project stands out against thousands of clone projects (like generic Todo lists or basic clones) in Indian placement drives. Provide constructive, industry-grade upgrades.
Return strictly valid JSON adhering to:
{
  "projectName": "${projectData.title}",
  "overallScore": number (0-100),
  "verdict": "Production Ready" | "Good Academic Project" | "Needs Major Overhaul" | "Basic Tutorial Clone",
  "strengths": string[] (3-4 points),
  "missingProductionFeatures": string[] (4-5 items such as Auth/JWT, Redis cache, Unit Tests, CI/CD, DB Indexing, Docker, Rate Limiting),
  "resumeBulletSuggestions": string[] (3 high-impact resume bullets using action verbs + metrics + tech stack),
  "techStackUpgradeIdeas": string[] (3 actionable upgrades to make it enterprise ready),
  "interviewerQuestions": string[] (3 challenging technical questions interviewers will ask about this project)
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      temperature: 0.3,
    },
  });

  return JSON.parse(response.text || '{}');
}

export async function analyzeResumeWithGemini(
  resumeText: string,
  targetRole: string
): Promise<ResumeAnalysisResult> {
  const ai = getAiClient();

  const prompt = `You are an expert ATS & Campus Recruiter at a top tech firm evaluating an Indian college engineering fresher's resume for the role of ${targetRole}.

Resume Content:
"""
${resumeText}
"""

Evaluate this resume for ATS pass rate, keyword density for ${targetRole}, STAR methodology impact (metrics, action verbs), and Indian campus placement round viability (TCS Digital vs Tier-2 vs Tier-1 Product MNCs).
Return strictly valid JSON adhering to:
{
  "overallAtsScore": number (0 to 100),
  "targetRoleMatch": number (percentage 0 to 100),
  "strengths": string[] (3-4 points),
  "detectedKeywords": string[] (list of matched industry keywords),
  "missingCrucialKeywords": string[] (6-8 missing keywords for ${targetRole}),
  "formatIssues": string[] (formatting or section advice for freshers),
  "bulletPointImprovements": [
    {
      "original": string (weak point from resume),
      "improved": string (rewritten in high-impact STAR format with simulated metrics),
      "reason": string
    }
  ],
  "placementRoundReadiness": {
    "tcsOrMassTest": string (verdict & readiness assessment),
    "tier2Product": string (verdict & readiness assessment),
    "tier1Product": string (verdict & readiness assessment)
  }
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      temperature: 0.3,
    },
  });

  return JSON.parse(response.text || '{}');
}

export async function chatAIMentorWithGemini(
  message: string,
  history: { sender: 'user' | 'model'; text: string }[],
  studentContext: string
): Promise<string> {
  const ai = getAiClient();

  const systemInstruction = `You are "EduPath Mentor", a warm, empathetic, and hyper-competent AI Career & Placement Guide for Indian engineering and BCA/MCA students.
You understand the nuances of Indian placements:
- College tiers (Tier 1 IIT/NIT, Tier 2 VIT/SRM/Thapar/BMS, Tier 3 AKTU/Anna/VTU affiliated colleges).
- Indian placement stages: Aptitude & Online Coding Assessments (OA on HackerRank, AMCAT, CoCubes, HackerEarth), Technical Round 1 (DSA & LeetCode), Technical Round 2 (System Design, Projects & Core CS: OS, DBMS, CN), and HR/Managerial rounds.
- Popular company standards: Product MNCs (Amazon, Google, Microsoft), Unicorns (Swiggy, Zomato, PhonePe, Razorpay), Mid-tier (Zoho, Freshworks, Juspay), and IT Services (TCS Digital, Infosys HackWithInfy/DNP, Wipro Turbo).

Student Profile Context:
${studentContext}

Respond concisely, with structured bullet points, actionable code or study tips, and positive motivation. Keep responses under 250 words unless writing a detailed code solution.`;

  const contents = [
    ...history.map((h) => ({
      role: h.sender === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }],
    })),
    {
      role: 'user',
      parts: [{ text: message }],
    },
  ];

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents,
    config: {
      systemInstruction,
      temperature: 0.6,
    },
  });

  return response.text || 'I could not generate an answer right now. Please try again.';
}

export async function conductMockInterviewStepWithGemini(params: {
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
  const ai = getAiClient();

  const prompt = `You are a Senior Tech Lead conducting a mock campus placement interview for an Indian engineering student applying for: ${params.targetRole} (${params.interviewType} Round).
Current Question Number: ${params.questionIndex} of 5.

${
  params.studentAnswer && params.previousQuestion
    ? `Student was asked: "${params.previousQuestion}"
Student's Answer: "${params.studentAnswer}"

Evaluate the student's answer thoroughly with a score from 1-10, technical accuracy, tone, improvement tip, and an ideal answer outline.`
    : `This is question #${params.questionIndex}. Generate a realistic campus interview question.`
}

If questionNumber >= 5, set isComplete to true. Otherwise false.
Return strictly valid JSON in this schema:
{
  "feedback": ${
    params.studentAnswer
      ? `{
    "score": number (1 to 10),
    "tone": string,
    "technicalAccuracy": string,
    "improvementTip": string,
    "idealAnswerOutline": string
  }`
      : `null`
  },
  "nextQuestion": string (the next question to ask the candidate, or a closing summary message if isComplete is true),
  "questionNumber": ${params.studentAnswer ? params.questionIndex + 1 : params.questionIndex},
  "isComplete": boolean
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      temperature: 0.4,
    },
  });

  return JSON.parse(response.text || '{}');
}
