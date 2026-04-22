import express, { Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';
import { GeminiService } from '../services/gemini.service';
import { Application } from '../models/Application.model';

const router = express.Router();

// Analyze job match
router.post('/analyze', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { jd, profile } = req.body;

    const analysis = await GeminiService.analyzeMatch(jd, profile);

    // Save application record
    const application = new Application({
      userId: req.userId,
      jobTitle: jd.title,
      company: jd.company,
      jobUrl: jd.url,
      matchScore: analysis.score,
      status: 'applied',
    });

    await application.save();

    res.json(analysis);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get application history
router.get('/applications', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const applications = await Application.find({ userId: req.userId })
      .sort({ appliedAt: -1 })
      .limit(50);

    res.json(applications);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Track application manually
router.post('/track', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { jobTitle, company, jobUrl, matchScore } = req.body;
    
    const application = new Application({
      userId: req.userId,
      jobTitle,
      company,
      jobUrl,
      matchScore: matchScore || 0,
      status: 'applied',
    });

    await application.save();
    res.status(201).json(application);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;