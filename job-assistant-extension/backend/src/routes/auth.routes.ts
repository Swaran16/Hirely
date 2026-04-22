import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.model';
import { generateToken } from '../utils/jwt.util';

const router = express.Router();

// Register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      skills: [],
      projects: [],
      education: [],
    });

    await user.save();

    const token = generateToken(user._id.toString());

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        skills: user.skills,
        experience: user.experience,
        projects: user.projects,
        education: user.education,
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = generateToken(user._id.toString());

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        skills: user.skills,
        experience: user.experience,
        projects: user.projects,
        education: user.education,
        resumeUrl: user.resumeUrl,
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;