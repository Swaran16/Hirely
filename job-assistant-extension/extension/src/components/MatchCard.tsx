import React from 'react';
import { MatchResult } from '../types';
import { AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

interface MatchCardProps {
  match: MatchResult;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getChanceColor = (chance: string) => {
    if (chance === 'High') return 'bg-green-100 text-green-800';
    if (chance === 'Medium') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
      {/* Score */}
      <div className="text-center">
        <div className={`text-5xl font-bold ${getScoreColor(match.score)}`}>
          {match.score}%
        </div>
        <p className="text-gray-600 text-sm mt-1">Match Score</p>
      </div>

      {/* Selection Chance */}
      <div className={`${getChanceColor(match.selectionChance)} px-4 py-2 rounded-lg text-center font-semibold`}>
        Selection Chance: {match.selectionChance}
      </div>

      {/* Matched Skills */}
      {match.matchedSkills.length > 0 && (
        <div>
          <div className="flex items-center gap-2 text-green-700 font-semibold mb-2">
            <CheckCircle size={18} />
            <span>Matched Skills</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {match.matchedSkills.map((skill, i) => (
              <span key={i} className="px-2 py-1 bg-green-50 text-green-700 rounded text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Missing Skills */}
      {match.missingSkills.length > 0 && (
        <div>
          <div className="flex items-center gap-2 text-red-700 font-semibold mb-2">
            <AlertCircle size={18} />
            <span>Missing Skills</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {match.missingSkills.map((skill, i) => (
              <span key={i} className="px-2 py-1 bg-red-50 text-red-700 rounded text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {match.suggestions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 text-blue-700 font-semibold mb-2">
            <TrendingUp size={18} />
            <span>Suggestions</span>
          </div>
          <ul className="space-y-1 text-sm text-gray-700">
            {match.suggestions.map((suggestion, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};