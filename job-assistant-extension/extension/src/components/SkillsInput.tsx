import React, { useState } from 'react';
import { X } from 'lucide-react';
import { COMMON_SKILLS } from '../lib/constants';

interface SkillsInputProps {
  skills: string[];
  onChange: (skills: string[]) => void;
}

export const SkillsInput: React.FC<SkillsInputProps> = ({ skills, onChange }) => {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = COMMON_SKILLS.filter(
    skill => skill.toLowerCase().includes(input.toLowerCase()) && !skills.includes(skill)
  );

  const addSkill = (skill: string) => {
    if (skill.trim() && !skills.includes(skill.trim())) {
      onChange([...skills, skill.trim()]);
      setInput('');
      setShowSuggestions(false);
    }
  };

  const removeSkill = (index: number) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  return (
    <div className="relative font-['Outfit',_sans-serif]">
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addSkill(input);
            }
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="e.g. React, Python, AWS..."
          className="flex-1 px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300 font-medium"
        />
        <button
          onClick={() => addSkill(input)}
          className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-extrabold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 transition-all active:scale-[0.98]"
        >
          Add
        </button>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-30 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 max-h-56 overflow-y-auto py-2 animate-in fade-in slide-in-from-top-2 duration-200">
          {suggestions.slice(0, 10).map((skill, index) => (
            <button
              key={index}
              onClick={() => addSkill(skill)}
              className="w-full text-left px-5 py-2.5 hover:bg-indigo-50 transition-colors text-sm font-bold text-slate-600 hover:text-indigo-600"
            >
              {skill}
            </button>
          ))}
        </div>
      )}

      {/* Skills tags */}
      <div className="flex flex-wrap gap-2.5">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-100 text-slate-700 rounded-xl text-[13px] font-bold shadow-sm hover:border-indigo-200 transition-all group"
          >
            {skill}
            <button
              onClick={() => removeSkill(index)}
              className="text-slate-300 hover:text-rose-500 transition-colors"
            >
              <X size={14} strokeWidth={3} />
            </button>
          </span>
        ))}
        {skills.length === 0 && (
          <div className="text-slate-400 text-xs font-medium italic mt-1 ml-1">
            No skills added. Try uploading a resume to auto-fill.
          </div>
        )}
      </div>
    </div>
  );
};