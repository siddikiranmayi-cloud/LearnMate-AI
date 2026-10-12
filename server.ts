import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '25mb' }));

// Initialize Google GenAI client if key exists
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim() !== '') {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI with provided key:', err);
  }
}

// Health check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'LearnMate AI',
    version: '1.0.0',
    hasApiKey: !!aiClient,
    model: 'gemini-3.8-flash'
  });
});

// Proxy endpoint for grounded AI tutoring
app.post('/api/ai/tutor', async (req, res) => {
  try {
    const { message, context, learnerState, language, allowOutsideKnowledge } = req.body;

    if (!aiClient) {
      return res.status(200).json({
        fallback: true,
        message: 'No active GEMINI_API_KEY found on server. Using built-in local retrieval engine.'
      });
    }

    const systemPrompt = `You are LearnMate AI, a source-grounded academic tutor.
Your duty is strict source grounding.
Context from course material:
${JSON.stringify(context || [], null, 2)}

Learner Profile:
- Mastery level on this topic: ${learnerState?.mastery ?? 'Unknown'}
- Learning pace: ${learnerState?.pace ?? 'Standard'}

Grounding Rules:
1. Ground your answer strictly in the provided course context.
2. If the user asks something not in the course context and allowOutsideKnowledge is false, state clearly: "⚠️ This topic is not covered in your uploaded course material. I can provide outside knowledge only if you explicitly enable Outside Knowledge."
3. If allowOutsideKnowledge is true and context is lacking, provide a separated answer:
[SOURCE-BACKED]
(Any content supported by course documents)
[OUTSIDE KNOWLEDGE]
(General educational explanation)
4. Respond in language: ${language || 'English'}. But keep all source citations unchanged (e.g. Page numbers, document titles).
5. Output format as JSON:
{
  "groundingStatus": "SOURCE_BACKED" | "PARTIALLY_SUPPORTED" | "NOT_COVERED",
  "explanation": "...",
  "outsideExplanation": "...",
  "citedChunkIds": ["chunk_id_1"],
  "pedagogicalLevel": "introductory" | "conceptual" | "advanced",
  "followUpPrompt": "..."
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\nStudent Question: ${message}` }]
        }
      ],
      config: {
        responseMimeType: 'application/json',
      }
    });

    const responseText = response.text || '{}';
    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      parsed = {
        groundingStatus: 'SOURCE_BACKED',
        explanation: responseText,
        citedChunkIds: []
      };
    }

    return res.json({ success: true, ...parsed });
  } catch (error: any) {
    console.error('Error in /api/ai/tutor:', error);
    return res.status(200).json({
      fallback: true,
      error: error.message || 'AI service error'
    });
  }
});

// Proxy endpoint for question verification and generation
app.post('/api/ai/assess', async (req, res) => {
  try {
    const { topic, difficulty, count, sources } = req.body;

    if (!aiClient) {
      return res.status(200).json({
        fallback: true,
        message: 'Using built-in verified question engine'
      });
    }

    const prompt = `Generate ${count || 3} assessment questions for topic "${topic}" with difficulty "${difficulty}".
Source context:
${JSON.stringify(sources || [], null, 2)}

Verification requirements:
1. Question must be strictly answerable from provided source passages.
2. Correct answer key must be unambiguous.
3. Explanation must cite the exact page/slide/timestamp.
4. Output valid JSON array with objects matching:
{
  "questions": [
    {
      "id": "q_gen_1",
      "topic": "${topic}",
      "difficulty": "${difficulty}",
      "type": "mcq",
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A",
      "explanation": "...",
      "conceptTested": "...",
      "source": { "file": "...", "page": 1, "section": "..." }
    }
  ]
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { responseMimeType: 'application/json' }
    });

    const parsed = JSON.parse(response.text || '{"questions":[]}');
    return res.json({ success: true, ...parsed });
  } catch (err: any) {
    return res.status(200).json({ fallback: true, error: err.message });
  }
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // Mount Vite middleware in development
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {}
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[LearnMate AI] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
