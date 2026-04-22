import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.util';
import { User } from '../models/User.model';

export interface AuthRequest extends Request {
  userId?: string;
  user?: any;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    req.userId = decoded.userId;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};