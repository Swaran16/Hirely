import React, { useState, useEffect } from 'react';
import { useUserStore } from '../../stores/userStore';
import { api } from '../../lib/api';
import { SkillsInput } from '../../components/SkillsInput';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EXPERIENCE_LEVELS } from '../../lib/constants';
import { Save, Upload, Plus, Trash2, Briefcase, CheckCircle, TrendingUp } from 'lucide-react';
import type { UserProfile, Project, Education } from '../../types';

export const Profile: React.FC = () => {
  const { profile, updateProfile } = useUserStore();
  
  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    skills: [],
    experience: '',
    projects: [],
    education: [],
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await api.uploadResume(file);
      const { text, url, extractedSkills } = response.data;
      
      setFormData({
        ...formData,
        resumeText: text,
        resumeUrl: url,
        skills: [...new Set([...formData.skills, ...extractedSkills])],
      });
      
      setSuccess('Resume uploaded and parsed successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      alert('Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [
        ...formData.projects,
        { name: '', description: '', technologies: [] }
      ]
    });
  };

  const updateProject = (index: number, project: Project) => {
    const newProjects = [...formData.projects];
    newProjects[index] = project;
    setFormData({ ...formData, projects: newProjects });
  };

  const removeProject = (index: number) => {
    setFormData({
      ...formData,
      projects: formData.projects.filter((_, i) => i !== index)
    });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        { degree: '', institution: '', year: '' }
      ]
    });
  };

  const updateEducation = (index: number, education: Education) => {
    const newEducation = [...formData.education];
    newEducation[index] = education;
    setFormData({ ...formData, education: newEducation });
  };

  const removeEducation = (index: number) => {
    setFormData({
      ...formData,
      education: formData.education.filter((_, i) => i !== index)
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.saveProfile(formData);
      await updateProfile(formData);
      setSuccess('Profile saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      alert('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-[600px] max-h-[700px] overflow-y-auto bg-[#f8fafc] font-['Outfit',_sans-serif] scrollbar-hide">
      {/* Sticky Top Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 p-6 flex justify-between items-center shadow-sm">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Your Profile</h2>
          <p className="text-slate-500 text-xs font-medium mt-0.5">Maintain your career data for AI matching</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? <LoadingSpinner size="sm" /> : <><Save size={16} /> Save Changes</>}
        </button>
      </div>

      <div className="p-8 space-y-8 pb-12">
        {success && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-5 py-3.5 rounded-2xl text-sm font-bold animate-bounce shadow-sm flex items-center gap-2">
            <CheckCircle size={18} /> {success}
          </div>
        )}

        {/* Basic Information Section */}
        <section className="bg-white rounded-[28px] p-7 shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
            <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
              <span className="text-lg">👤</span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-800">Basic Details</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                placeholder="+1 234 567 890"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Experience Level</label>
              <select
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium appearance-none"
              >
                <option value="">Select Level</option>
                {EXPERIENCE_LEVELS.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="bg-white rounded-[28px] p-7 shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
              <TrendingUp size={18} />
            </div>
            <h3 className="text-lg font-extrabold text-slate-800">Expertise & Skills</h3>
          </div>
          <SkillsInput
            skills={formData.skills}
            onChange={(skills) => setFormData({ ...formData, skills })}
          />
        </section>

        {/* Resume Section */}
        <section className="bg-white rounded-[28px] p-7 shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
              <Upload size={18} />
            </div>
            <h3 className="text-lg font-extrabold text-slate-800">Resume Artifacts</h3>
          </div>
          <div className="group relative border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl p-10 text-center transition-all bg-slate-50/50 hover:bg-indigo-50/30">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              id="resume-upload"
            />
            <div className="space-y-4">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto text-indigo-600 group-hover:scale-110 transition-transform">
                <Upload size={24} />
              </div>
              <div>
                <p className="text-[15px] font-extrabold text-slate-800">
                  {uploading ? 'Parsing with AI...' : formData.resumeUrl ? 'Update your resume' : 'Upload your resume'}
                </p>
                <p className="text-[13px] text-slate-500 font-medium mt-1">PDF, DOCX or DOC up to 5MB</p>
              </div>
              {formData.resumeUrl && (
                <div className="inline-flex items-center gap-2 bg-emerald-500 text-white px-4 py-1.5 rounded-full text-xs font-bold">
                  <CheckCircle size={12} /> Resume Synced
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="bg-white rounded-[28px] p-7 shadow-sm border border-slate-100 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-50 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                <Briefcase size={18} />
              </div>
              <h3 className="text-lg font-extrabold text-slate-800">Portfolio Projects</h3>
            </div>
            <button
              onClick={addProject}
              className="text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Plus size={14} /> Add New
            </button>
          </div>

          <div className="space-y-4">
            {formData.projects.map((project, index) => (
              <div key={index} className="group relative bg-slate-50/50 rounded-2xl p-5 border border-slate-100 hover:border-indigo-200 hover:bg-white transition-all">
                <button
                  onClick={() => removeProject(index)}
                  className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
                <div className="space-y-4 pr-8">
                  <input
                    type="text"
                    value={project.name}
                    onChange={(e) => updateProject(index, { ...project, name: e.target.value })}
                    placeholder="Project Name"
                    className="w-full bg-transparent text-sm font-extrabold text-slate-800 focus:outline-none placeholder:text-slate-300"
                  />
                  <textarea
                    value={project.description}
                    onChange={(e) => updateProject(index, { ...project, description: e.target.value })}
                    placeholder="Briefly describe what you built..."
                    rows={2}
                    className="w-full bg-transparent text-sm text-slate-600 font-medium focus:outline-none placeholder:text-slate-300"
                  />
                  <input
                    type="text"
                    value={project.technologies.join(', ')}
                    onChange={(e) => updateProject(index, { 
                      ...project, 
                      technologies: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                    })}
                    placeholder="Tech stack (React, Node.js...)"
                    className="w-full bg-white px-3 py-2 border border-slate-100 rounded-lg text-xs font-bold text-indigo-600 focus:border-indigo-400 outline-none"
                  />
                </div>
              </div>
            ))}
            {formData.projects.length === 0 && (
              <p className="text-center py-6 text-sm font-medium text-slate-400 italic">No projects added yet.</p>
            )}
          </div>
        </section>

        {/* Education Section */}
        <section className="bg-white rounded-[28px] p-7 shadow-sm border border-slate-100 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-50 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center text-rose-600">
                <span className="text-lg">🎓</span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-800">Academic Background</h3>
            </div>
            <button
              onClick={addEducation}
              className="text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Plus size={14} /> Add New
            </button>
          </div>

          <div className="space-y-4">
            {formData.education.map((edu, index) => (
              <div key={index} className="relative bg-slate-50/50 rounded-2xl p-5 border border-slate-100 hover:border-indigo-200 hover:bg-white transition-all">
                <button
                  onClick={() => removeEducation(index)}
                  className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
                <div className="grid grid-cols-2 gap-4 pr-8">
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(index, { ...edu, degree: e.target.value })}
                    placeholder="Degree / Major"
                    className="bg-transparent text-sm font-extrabold text-slate-800 focus:outline-none placeholder:text-slate-300"
                  />
                  <input
                    type="text"
                    value={edu.year}
                    onChange={(e) => updateEducation(index, { ...edu, year: e.target.value })}
                    placeholder="Year (2020-2024)"
                    className="bg-transparent text-sm text-right text-slate-500 font-bold focus:outline-none placeholder:text-slate-300"
                  />
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEducation(index, { ...edu, institution: e.target.value })}
                    placeholder="University Name"
                    className="col-span-2 bg-transparent text-sm text-slate-600 font-medium focus:outline-none placeholder:text-slate-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};