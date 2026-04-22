import express, { Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';
import { User } from '../models/User.model';
import { ResumeService } from '../services/resume.service';

const router = express.Router();

// Get profile
router.get('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Update profile
router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const updates = req.body;
    delete updates._id;
    delete updates.password;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updates },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Upload resume
router.post('/resume', authMiddleware, upload.single('resume'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const { text, skills: extractedSkills } = await ResumeService.parseResume(req.file.path);
    
    const resumeUrl = `/uploads/${req.file.filename}`;

    await User.findByIdAndUpdate(req.userId, {
      $set: { resumeText: text, resumeUrl }
    });

    res.json({ 
      text, 
      url: resumeUrl,
      extractedSkills
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;