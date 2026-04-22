import express, { Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';
import { GeminiService } from '../services/gemini.service';

const router = express.Router();

// Generate answer for application question
router.post('/generate-answer', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { question, jd, profile } = req.body;

    const answer = await GeminiService.generateAnswer(question, jd, profile);

    res.json({ answer });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get improvement suggestions
router.post('/suggestions', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { jd, profile } = req.body;

    const suggestions = await GeminiService.getSuggestions(jd, profile);

    res.json({ suggestions });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;