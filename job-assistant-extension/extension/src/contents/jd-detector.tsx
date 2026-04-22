import type { PlasmoCSConfig } from "plasmo";
import { useEffect, useState } from "react";
import { sendToBackground } from "@plasmohq/messaging";
import type { JobDescription, MatchResult } from "../types";
import { getCachedMatchResult, cacheMatchResult } from "../lib/storage";

export const config: PlasmoCSConfig = {
  matches: ["*://*.linkedin.com/*", "*://*.indeed.com/*", "*://*.naukri.com/*"],
  css: ["../popup/style.css"]
};

// Extract JD from different job sites
const extractJDFromLinkedIn = (): JobDescription | null => {
  try {
    const title = document.querySelector('.top-card-layout__title, .job-details-jobs-unified-top-card__job-title')?.textContent?.trim() || '';
    const company = document.querySelector('.topcard__org-name-link, .job-details-jobs-unified-top-card__company-name')?.textContent?.trim() || '';
    const description = document.querySelector('.description__text, .jobs-description-content__text')?.textContent?.trim() || '';
    const location = document.querySelector('.topcard__flavor--bullet, .job-details-jobs-unified-top-card__bullet')?.textContent?.trim() || '';
    
    // Extract skills from description
    const skills: string[] = [];
    const skillPatterns = /\b(JavaScript|TypeScript|Python|Java|React|Angular|Vue|Node\.js|Express|MongoDB|PostgreSQL|MySQL|AWS|Azure|Docker|Kubernetes|Spring Boot|Django|Flask|FastAPI|HTML|CSS|Git|CI\/CD|Machine Learning|TensorFlow|PyTorch|C\+\+|C#|Ruby|PHP|Swift|Kotlin|Go|Rust)\b/gi;
    const matches = description.match(skillPatterns);
    if (matches) {
      skills.push(...[...new Set(matches.map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)))]);
    }

    if (!title) return null;

    return {
      title,
      company,
      skills,
      description,
      location,
      url: window.location.href,
      extractedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error extracting LinkedIn JD:', error);
    return null;
  }
};

const extractJDFromIndeed = (): JobDescription | null => {
  try {
    const title = document.querySelector('.jobsearch-JobInfoHeader-title, h1.icl-u-xs-mb--xs')?.textContent?.trim() || '';
    const company = document.querySelector('[data-company-name="true"], .icl-u-lg-mr--sm')?.textContent?.trim() || '';
    const description = document.querySelector('#jobDescriptionText, .jobsearch-jobDescriptionText')?.textContent?.trim() || '';
    const location = document.querySelector('[data-testid="job-location"], .icl-u-xs-mt--xs')?.textContent?.trim() || '';
    
    const skills: string[] = [];
    const skillPatterns = /\b(JavaScript|TypeScript|Python|Java|React|Angular|Vue|Node\.js|Express|MongoDB|PostgreSQL|MySQL|AWS|Azure|Docker|Kubernetes)\b/gi;
    const matches = description.match(skillPatterns);
    if (matches) {
      skills.push(...[...new Set(matches)]);
    }

    if (!title) return null;

    return {
      title,
      company,
      skills,
      description,
      location,
      url: window.location.href,
      extractedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error extracting Indeed JD:', error);
    return null;
  }
};

const extractJDFromNaukri = (): JobDescription | null => {
  try {
    const title = document.querySelector('.jd-header-title, h1')?.textContent?.trim() || '';
    const company = document.querySelector('.jd-header-comp-name, .comp-name')?.textContent?.trim() || '';
    const description = document.querySelector('.dang-inner-html, .job-desc')?.textContent?.trim() || '';
    const location = document.querySelector('.jd-loc, .location')?.textContent?.trim() || '';
    
    const skills: string[] = [];
    const skillTags = document.querySelectorAll('.chip, .tag');
    skillTags.forEach(tag => {
      const skill = tag.textContent?.trim();
      if (skill) skills.push(skill);
    });

    if (!title) return null;

    return {
      title,
      company,
      skills,
      description,
      location,
      url: window.location.href,
      extractedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error extracting Naukri JD:', error);
    return null;
  }
};

const extractJD = (): JobDescription | null => {
  const hostname = window.location.hostname;
  
  if (hostname.includes('linkedin.com')) {
    return extractJDFromLinkedIn();
  } else if (hostname.includes('indeed.com')) {
    return extractJDFromIndeed();
  } else if (hostname.includes('naukri.com')) {
    return extractJDFromNaukri();
  }
  
  return null;
};

// Floating Widget Component
const FloatingWidget = () => {
  const [jd, setJD] = useState<JobDescription | null>(null);
  const [match, setMatch] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const extractedJD = extractJD();
      if (extractedJD && extractedJD.title) {
        setJD(extractedJD);
        analyzeMatch(extractedJD);
        setVisible(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const analyzeMatch = async (jobDescription: JobDescription) => {
    setLoading(true);
    try {
      const cached = await getCachedMatchResult(jobDescription.url);
      if (cached) {
        setMatch(cached);
        setLoading(false);
        return;
      }

      const response = await sendToBackground({
        name: "analyze-jd",
        body: { jd: jobDescription }
      } as any);
      
      if (response.match) {
        setMatch(response.match);
        await cacheMatchResult(jobDescription.url, response.match);
      }
    } catch (error) {
      console.error('Failed to analyze JD:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '64px',
          height: '64px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          color: 'white',
          border: 'none',
          fontSize: '28px',
          cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(79, 70, 229, 0.4)',
          zIndex: 999999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(79, 70, 229, 0.5)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(79, 70, 229, 0.4)';
        }}
      >
        🎯
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '380px',
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        zIndex: 999999,
        fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
        overflow: 'hidden',
        animation: 'slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Premium Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
        padding: '20px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle Background Pattern */}
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '100px',
          height: '100px',
          background: 'rgba(99, 102, 241, 0.2)',
          borderRadius: '50%',
          filter: 'blur(30px)',
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '20px' }}>🎯</span>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '700', letterSpacing: '-0.01em' }}>
                Match Analysis
              </h3>
            </div>
            <p style={{ margin: 0, fontSize: '13px', opacity: 0.8, fontWeight: '500' }}>
              {jd?.company}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setMinimized(true)}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: 'white',
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            >
              <span style={{ fontSize: '18px', lineHeight: 0 }}>−</span>
            </button>
            <button
              onClick={() => setVisible(false)}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: 'white',
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.4)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            >
              <span style={{ fontSize: '18px', lineHeight: 0 }}>×</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div style={{ padding: '24px', maxHeight: '500px', overflowY: 'auto', scrollbarWidth: 'none' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div className="shimmer" style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              border: '4px solid #eef2ff',
              borderTopColor: '#4f46e5',
              margin: '0 auto 20px',
              animation: 'spin 1s linear infinite',
            }} />
            <p style={{ color: '#4b5563', fontSize: '15px', fontWeight: '600' }}>AI is analyzing JD...</p>
            <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '4px' }}>Matching with your skills & experience</p>
          </div>
        ) : match ? (
          <>
            {/* Visual Match Score */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              flexDirection: 'column',
              marginBottom: '28px',
              position: 'relative'
            }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: `conic-gradient(${match.score >= 70 ? '#10b981' : match.score >= 50 ? '#f59e0b' : '#ef4444'} ${match.score}%, #f3f4f6 0)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}>
                  <span style={{ 
                    fontSize: '32px', 
                    fontWeight: '800', 
                    color: '#1e1b4b',
                    lineHeight: 1
                  }}>
                    {match.score}%
                  </span>
                </div>
              </div>
              <div style={{
                position: 'absolute',
                bottom: '-10px',
                background: match.selectionChance === 'High' ? '#10b981' : match.selectionChance === 'Medium' ? '#f59e0b' : '#ef4444',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}>
                {match.selectionChance} Chance
              </div>
            </div>

            {/* Skills Analysis */}
            <div style={{ spaceY: '20px' }}>
              {/* Matched Skills */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#1e1b4b', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: '#10b981' }}>●</span> Matched Strengths
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {match.matchedSkills.map((skill, i) => (
                    <span key={i} style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      color: '#065f46',
                      padding: '6px 14px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                    }}>
                      {skill}
                    </span>
                  ))}
                  {match.matchedSkills.length === 0 && <p style={{ fontSize: '12px', color: '#9ca3af' }}>No matching skills found</p>}
                </div>
              </div>

              {/* Suggestions / Tips */}
              <div style={{ 
                background: 'rgba(79, 70, 229, 0.05)', 
                borderRadius: '16px', 
                padding: '16px',
                border: '1px solid rgba(79, 70, 229, 0.1)',
                marginBottom: '24px'
              }}>
                <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#4338ca', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '16px' }}>💡</span> AI Recommendations
                </h4>
                <ul style={{ margin: 0, paddingLeft: '18px', spaceY: '8px' }}>
                  {match.suggestions.slice(0, 3).map((suggestion, i) => (
                    <li key={i} style={{ fontSize: '12px', color: '#4b5563', lineHeight: '1.5', marginBottom: '6px' }}>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Footer */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button
                onClick={() => chrome.runtime.sendMessage({ action: 'openPopup', page: 'profile' })}
                style={{
                  flex: 1,
                  background: 'white',
                  color: '#4f46e5',
                  border: '1.5px solid #4f46e5',
                  padding: '14px',
                  borderRadius: '16px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#f5f3ff'}
                onMouseOut={(e) => e.currentTarget.style.background = 'white'}
              >
                Edit Profile
              </button>
              <button
                onClick={() => {
                  document.dispatchEvent(new CustomEvent('smart-apply-start', { 
                    detail: { jd, match } 
                  }));
                }}
                style={{
                  flex: 1.5,
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '16px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(79, 70, 229, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.3)';
                }}
              >
                <span>Smart Apply</span>
                <span style={{ fontSize: '16px' }}>✨</span>
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>👤</div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#1e1b4b' }}>No Profile Detected</h4>
            <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#6b7280' }}>Please set up your AI profile to start matching.</p>
            <button
              onClick={() => chrome.runtime.sendMessage({ action: 'openPopup', page: 'profile' })}
              style={{
                background: '#4f46e5',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Get Started
            </button>
          </div>
        )}
      </div>

      {/* Global Animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
        
        @keyframes slideIn {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .shimmer {
          position: relative;
          overflow: hidden;
        }
        
        .shimmer::after {
          content: "";
          position: absolute;
          top: 0; right: 0; bottom: 0; left: 0;
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%);
          animation: shimmer-anim 1.5s infinite;
        }
        
        @keyframes shimmer-anim {
          from { transform: translateX(-100%); }
          to { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default FloatingWidget;