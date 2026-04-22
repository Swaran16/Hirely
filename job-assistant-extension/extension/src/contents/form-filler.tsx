import type { PlasmoCSConfig } from "plasmo";
import { useEffect, useState } from "react";
import { sendToBackground } from "@plasmohq/messaging";
import { getProfile } from "../lib/storage";
import type { UserProfile, JobDescription, MatchResult } from "../types";

export const config: PlasmoCSConfig = {
  matches: ["*://*.linkedin.com/*", "*://*.indeed.com/*", "*://*.naukri.com/*"],
  run_at: "document_end"
};

interface FormField {
  element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
  label: string;
  type: string;
  name: string;
}

// Detect all form fields
const detectFormFields = (): FormField[] => {
  const fields: FormField[] = [];
  
  document.querySelectorAll('input, textarea, select').forEach((element: any) => {
    // Skip hidden, submit, button fields
    if (element.type === 'hidden' || element.type === 'submit' || element.type === 'button') {
      return;
    }

    const label = findLabel(element);
    
    fields.push({
      element,
      label: label.toLowerCase(),
      type: element.type || element.tagName.toLowerCase(),
      name: element.name || element.id || '',
    });
  });
  
  return fields;
};

// Find associated label for an input
const findLabel = (element: HTMLElement): string => {
  // Try label[for]
  const id = element.id;
  if (id) {
    const label = document.querySelector(`label[for="${id}"]`);
    if (label) return label.textContent?.trim() || '';
  }
  
  // Try parent label
  const parentLabel = element.closest('label');
  if (parentLabel) {
    return parentLabel.textContent?.trim() || '';
  }
  
  // Try preceding label
  let prev = element.previousElementSibling;
  while (prev) {
    if (prev.tagName === 'LABEL') {
      return prev.textContent?.trim() || '';
    }
    prev = prev.previousElementSibling;
  }
  
  // Try aria-label or placeholder
  return (element as any).getAttribute('aria-label') || 
         (element as any).placeholder || 
         (element as any).name || 
         '';
};

// Smart field matching and filling
const fillField = (field: FormField, profile: UserProfile): boolean => {
  const label = field.label;
  
  try {
    // Name fields
    if ((label.includes('name') || label.includes('full name')) && 
        !label.includes('company') && !label.includes('username')) {
      field.element.value = profile.name;
      field.element.dispatchEvent(new Event('input', { bubbles: true }));
      field.element.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }
    
    // First name
    if (label.includes('first name')) {
      field.element.value = profile.name.split(' ')[0];
      field.element.dispatchEvent(new Event('input', { bubbles: true }));
      field.element.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }
    
    // Last name
    if (label.includes('last name') || label.includes('surname')) {
      const parts = profile.name.split(' ');
      field.element.value = parts[parts.length - 1];
      field.element.dispatchEvent(new Event('input', { bubbles: true }));
      field.element.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }
    
    // Email
    if (label.includes('email') || label.includes('e-mail')) {
      field.element.value = profile.email;
      field.element.dispatchEvent(new Event('input', { bubbles: true }));
      field.element.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }
    
    // Phone
    if (label.includes('phone') || label.includes('mobile') || label.includes('contact')) {
      field.element.value = profile.phone;
      field.element.dispatchEvent(new Event('input', { bubbles: true }));
      field.element.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error filling field:', error);
    return false;
  }
};

// Identify question fields that need AI-generated answers
const isQuestionField = (field: FormField): boolean => {
  const label = field.label;
  const questionKeywords = [
    'why',
    'describe',
    'tell us',
    'explain',
    'what makes',
    'cover letter',
    'motivation',
    'interest',
    'experience',
    'qualification',
  ];
  
  return field.type === 'textarea' && 
         questionKeywords.some(keyword => label.includes(keyword));
};

// Smart Form Filler Component
const SmartFormFiller = () => {
  const [isActive, setIsActive] = useState(false);
  const [filling, setFilling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [jd, setJd] = useState<JobDescription | null>(null);
  const [match, setMatch] = useState<MatchResult | null>(null);

  useEffect(() => {
    // Listen for smart apply trigger from JD detector
    const handleSmartApply = ((e: CustomEvent) => {
      setJd(e.detail.jd);
      setMatch(e.detail.match);
      setIsActive(true);
    }) as EventListener;

    document.addEventListener('smart-apply-start', handleSmartApply);

    // Auto-detect forms on page
    const hasForm = document.querySelector('form') !== null;
    if (hasForm) {
      setTimeout(() => setIsActive(true), 1500);
    }

    return () => {
      document.removeEventListener('smart-apply-start', handleSmartApply);
    };
  }, []);

  const handleAutoFill = async () => {
    setFilling(true);
    setProgress(0);
    
    try {
      const profile = await getProfile();
      if (!profile) {
        alert('❌ Please set up your profile first in the extension popup.');
        setFilling(false);
        return;
      }

      const fields = detectFormFields();
      const totalFields = fields.length;
      let filledCount = 0;

      // Step 1: Fill basic fields
      for (const field of fields) {
        if (!isQuestionField(field)) {
          const filled = fillField(field, profile);
          if (filled) filledCount++;
          setProgress(Math.round((filledCount / totalFields) * 50));
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      // Step 2: Fill question fields with AI
      const questionFields = fields.filter(isQuestionField);
      const aiFieldCount = questionFields.length;
      
      for (let i = 0; i < questionFields.length; i++) {
        const field = questionFields[i];
        const question = field.label;
        
        try {
          const response = await sendToBackground({
            name: "generate-answer",
            body: { question, jd, profile }
          } as any);

          if (response.answer) {
            field.element.value = response.answer;
            field.element.dispatchEvent(new Event('input', { bubbles: true }));
            field.element.dispatchEvent(new Event('change', { bubbles: true }));
            filledCount++;
          }
        } catch (error) {
          console.error('Error generating answer for:', question, error);
        }
        
        setProgress(50 + Math.round(((i + 1) / aiFieldCount) * 50));
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      setProgress(100);
      
      // Show success message
      setTimeout(() => {
        alert(`✅ Form filled successfully!\n\n${filledCount} fields completed.\n\nPlease review all fields before submitting.`);
        setFilling(false);
        setProgress(0);
      }, 500);

    } catch (error) {
      console.error('Error filling form:', error);
      alert('❌ Failed to fill form. Please try again.');
      setFilling(false);
      setProgress(0);
    }
  };

  if (!isActive) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 999999,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        overflow: 'hidden',
        minWidth: '280px',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          padding: '16px',
          color: 'white',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>✨</span>
              <span style={{ fontWeight: '600', fontSize: '15px' }}>Smart Fill</span>
            </div>
            <button
              onClick={() => setIsActive(false)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '16px' }}>
          {filling ? (
            <div>
              <div style={{
                width: '100%',
                height: '8px',
                background: '#e5e7eb',
                borderRadius: '4px',
                overflow: 'hidden',
                marginBottom: '12px',
              }}>
                <div style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #10b981, #059669)',
                  transition: 'width 0.3s ease',
                }} />
              </div>
              <p style={{ 
                textAlign: 'center', 
                color: '#6b7280', 
                fontSize: '13px',
                margin: 0,
              }}>
                {progress < 50 ? 'Filling basic fields...' : 'Generating AI answers...'}
              </p>
              <p style={{ 
                textAlign: 'center', 
                color: '#10b981', 
                fontSize: '16px',
                fontWeight: 'bold',
                margin: '8px 0 0 0',
              }}>
                {progress}%
              </p>
            </div>
          ) : (
            <>
              <p style={{ 
                fontSize: '13px', 
                color: '#4b5563', 
                margin: '0 0 16px 0',
                lineHeight: '1.5',
              }}>
                Auto-fill this application with your profile data and AI-generated answers.
              </p>
              <button
                onClick={handleAutoFill}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                }}
              >
                ✨ Start Smart Fill
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartFormFiller;