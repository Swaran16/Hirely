import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
  userId: mongoose.Types.ObjectId;
  jobTitle: string;
  company: string;
  jobUrl: string;
  matchScore: number;
  appliedAt: Date;
  status: 'applied' | 'interviewing' | 'rejected' | 'accepted';
}

const ApplicationSchema = new Schema<IApplication>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    jobTitle: { type: String, required: true },
    company: { type: String, required: true },
    jobUrl: { type: String, required: true },
    matchScore: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['applied', 'interviewing', 'rejected', 'accepted'],
      default: 'applied'
    },
    appliedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const Application = mongoose.model<IApplication>('Application', ApplicationSchema);