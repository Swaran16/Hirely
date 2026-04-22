import mongoose, { Document, Schema } from 'mongoose';

export interface IProject {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
}

export interface IEducation {
  degree: string;
  institution: string;
  year: string;
  grade?: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  skills: string[];
  experience: string;
  projects: IProject[];
  education: IEducation[];
  resumeText?: string;
  resumeUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  technologies: [{ type: String }],
  url: String,
});

const EducationSchema = new Schema<IEducation>({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  year: { type: String, required: true },
  grade: String,
});

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, default: '' },
    skills: [{ type: String }],
    experience: { type: String, default: 'Fresher' },
    projects: [ProjectSchema],
    education: [EducationSchema],
    resumeText: String,
    resumeUrl: String,
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>('User', UserSchema);