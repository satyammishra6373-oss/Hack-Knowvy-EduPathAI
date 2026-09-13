import type { IncomingMessage, ServerResponse } from 'http';
import {
  analyzeStudentSkillGapWithGemini,
  evaluateProjectWithGemini,
  analyzeResumeWithGemini,
  chatAIMentorWithGemini,
  conductMockInterviewStepWithGemini,
} from './geminiService';

async function parseJsonBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', (err) => reject(err));
  });
}

function sendJson(res: ServerResponse, statusCode: number, data: any) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

export async function handleApiRoute(
  req: IncomingMessage,
  res: ServerResponse,
  next?: () => void
): Promise<boolean> {
  const url = req.url || '';
  if (!url.startsWith('/api/')) {
    if (next) next();
    return false;
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return true;
  }

  try {
    if (url === '/api/health' && req.method === 'GET') {
      sendJson(res, 200, { status: 'ok', timestamp: new Date().toISOString() });
      return true;
    }

    if (url === '/api/analyze-skill-gap' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const result = await analyzeStudentSkillGapWithGemini(body.profile);
      sendJson(res, 200, { success: true, data: result });
      return true;
    }

    if (url === '/api/evaluate-project' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const result = await evaluateProjectWithGemini(body);
      sendJson(res, 200, { success: true, data: result });
      return true;
    }

    if (url === '/api/analyze-resume' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const result = await analyzeResumeWithGemini(body.resumeText, body.targetRole);
      sendJson(res, 200, { success: true, data: result });
      return true;
    }

    if (url === '/api/mentor-chat' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const reply = await chatAIMentorWithGemini(body.message, body.history || [], body.studentContext || '');
      sendJson(res, 200, { success: true, reply });
      return true;
    }

    if (url === '/api/mock-interview' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const result = await conductMockInterviewStepWithGemini(body);
      sendJson(res, 200, { success: true, data: result });
      return true;
    }

    sendJson(res, 404, { error: `Endpoint ${url} not found` });
    return true;
  } catch (err: any) {
    console.error('API Error:', err);
    sendJson(res, 500, {
      success: false,
      error: err.message || 'Internal Server Error processing AI request',
    });
    return true;
  }
}
