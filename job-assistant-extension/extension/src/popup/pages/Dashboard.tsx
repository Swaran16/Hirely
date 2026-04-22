import React, { useEffect, useState } from 'react';
import { useUserStore } from '../../stores/userStore';
import { Briefcase, CheckCircle, TrendingUp, Clock, ExternalLink } from 'lucide-react';
import { api } from '../../lib/api';

export const Dashboard: React.FC = () => {
  const profile = useUserStore((state) => state.profile);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.getApplications();
        setApplications(response.data);
      } catch (error) {
        console.error('Failed to fetch applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const completionPercentage = React.useMemo(() => {
    if (!profile) return 0;
    
    let completed = 0;
    const total = 6;
    
    if (profile.name) completed++;
    if (profile.email) completed++;
    if (profile.phone) completed++;
    if (profile.skills.length > 0) completed++;
    if (profile.projects.length > 0) completed++;
    if (profile.resumeUrl) completed++;
    
    return Math.round((completed / total) * 100);
  }, [profile]);

  return (
    <div className="w-[500px] min-h-[600px] bg-[#f8fafc] overflow-y-auto max-h-[600px] font-['Outfit',_sans-serif]">
      {/* Premium Header */}
      <div className="bg-gradient-to-br from-[#1e1b4b] to-[#312e81] p-8 pb-12 rounded-b-[40px] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -ml-12 -mb-12"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Hello, {profile?.name?.split(' ')[0] || 'User'}!
            </h2>
            <p className="text-indigo-200 text-sm font-medium mt-1">
              Your career growth is on track ✨
            </p>
          </div>
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
            <Briefcase className="text-indigo-200" size={24} />
          </div>
        </div>
      </div>

      {/* Main Content Overlap */}
      <div className="px-6 -mt-8 space-y-6 pb-8">
        {/* Profile Completion Card */}
        <div className="bg-white rounded-[28px] shadow-sm border border-slate-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">Readiness Score</p>
              <h3 className="text-xl font-extrabold text-slate-800">{completionPercentage}% Completed</h3>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-slate-50 flex items-center justify-center relative">
               <svg className="w-full h-full transform -rotate-90">
                 <circle
                   cx="24"
                   cy="24"
                   r="20"
                   stroke="currentColor"
                   strokeWidth="4"
                   fill="transparent"
                   className="text-indigo-600"
                   style={{ strokeDasharray: '125', strokeDashoffset: `${125 - (125 * completionPercentage) / 100}` }}
                 />
               </svg>
               <span className="absolute text-[10px] font-bold text-slate-800">{completionPercentage}%</span>
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3.5 p-1 mb-2">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full shadow-sm"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-[12px] text-slate-500 font-medium">
            {completionPercentage < 100 ? 'Add more skills to reach 100% and unlock premium insights.' : 'You are fully set for the job market!'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-[28px] p-5 shadow-sm border border-slate-100 hover:border-indigo-200 transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                <TrendingUp size={20} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-800 leading-tight">{profile?.skills.length || 0}</p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Top Skills</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[28px] p-5 shadow-sm border border-slate-100 hover:border-emerald-200 transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                <CheckCircle size={20} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-800 leading-tight">{applications.length}</p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Applied</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Applications Feed */}
        <div className="bg-white rounded-[28px] shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">Active Tracking</h3>
            <div className="bg-slate-50 px-3 py-1 rounded-full flex items-center gap-2">
              <Clock size={12} className="text-slate-400" />
              <span className="text-[10px] font-bold text-slate-500">History</span>
            </div>
          </div>
          
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 bg-slate-50 animate-pulse rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-50 animate-pulse rounded w-3/4" />
                    <div className="h-3 bg-slate-50 animate-pulse rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : applications.length > 0 ? (
            <div className="space-y-4">
              {applications.slice(0, 3).map((app, index) => (
                <div key={index} className="group relative flex items-center justify-between p-4 bg-slate-50/50 hover:bg-white hover:shadow-md hover:shadow-indigo-500/5 rounded-2xl border border-transparent hover:border-indigo-100 transition-all">
                  <div className="flex gap-4 overflow-hidden">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-lg shadow-sm border border-slate-100 group-hover:rotate-12 transition-transform">
                      🏢
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-extrabold text-slate-800 truncate leading-tight mb-0.5">{app.jobTitle}</p>
                      <p className="text-[11px] font-bold text-slate-500 truncate">{app.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-2">
                    <div className={`text-[10px] px-2.5 py-1 rounded-full font-bold shadow-sm ${
                      app.matchScore >= 70 
                        ? 'bg-emerald-500 text-white' 
                        : app.matchScore >= 40 
                          ? 'bg-indigo-500 text-white' 
                          : 'bg-slate-400 text-white'
                    }`}>
                      {app.matchScore}%
                    </div>
                    {app.jobUrl && (
                      <a href={app.jobUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="text-slate-200" size={32} />
              </div>
              <p className="text-sm font-bold text-slate-800">No data found</p>
              <p className="text-xs text-slate-500 mt-1">Start applying to see your journey here.</p>
            </div>
          )}
        </div>

        {/* Global Action */}
        <button
          onClick={() => window.open("https://www.linkedin.com/jobs", "_blank")}
          className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white py-4 rounded-[20px] font-bold text-sm shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98]"
        >
          Explore Opportunities <ExternalLink size={16} />
        </button>
      </div>
    </div>
  );
};
