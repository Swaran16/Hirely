import React, { useState } from 'react';
import { useUserStore } from '../../stores/userStore';
import { api } from '../../lib/api';
import { saveAuthToken } from '../../lib/storage';
import { LoadingSpinner } from '../../components/LoadingSpinner';

interface LoginProps {
  onSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const updateProfile = useUserStore((state) => state.updateProfile);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = isLogin 
        ? await api.login(formData.email, formData.password)
        : await api.register(formData);
      
      const { token, user } = response.data;
      
      await saveAuthToken(token);
      await updateProfile(user);
      
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[450px] min-h-[550px] bg-white p-10 font-['Outfit',_sans-serif] relative overflow-hidden flex flex-col justify-center">
      {/* Background Blobs for Visual Interest */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-[28px] shadow-lg shadow-indigo-200 flex items-center justify-center mx-auto mb-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <span className="text-4xl text-white">🚀</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">
            Hirely AI
          </h1>
          <p className="text-slate-500 font-medium">
            {isLogin ? 'Welcome back to your career engine.' : 'Start your professional journey with AI.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="block text-[13px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300 font-medium"
                required={!isLogin}
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-[13px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300 font-medium"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[13px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300 font-medium"
              required
            />
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-xl text-[13px] font-bold animate-pulse">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 rounded-2xl font-extrabold text-sm shadow-xl shadow-indigo-100 hover:shadow-indigo-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-4"
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        {/* Toggle */}
        <div className="text-center mt-8">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-sm text-slate-400 font-bold hover:text-indigo-600 transition-colors"
          >
            {isLogin ? (
              <>New here? <span className="text-indigo-600">Create an account</span></>
            ) : (
              <>Have an account? <span className="text-indigo-600">Sign in instead</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};