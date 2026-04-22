import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export class GeminiService {
  static async generateAnswer(
    question: string,
    jd: any,
    profile: any
  ): Promise<string> {
    const prompt = `You are a professional job applicant helping to answer application questions.

Your Profile:
- Name: ${profile.name}
- Skills: ${profile.skills.join(', ')}
- Experience: ${profile.experience}
- Projects: ${profile.projects.map((p: any) => p.name).join(', ')}

Job Details:
- Title: ${jd.title}
- Company: ${jd.company}
- Description: ${jd.description.substring(0, 500)}

Question: "${question}"

Provide a professional, concise answer (2-4 sentences) that:
1. Directly answers the question
2. Highlights relevant skills and experience
3. Shows enthusiasm for the role
4. Sounds natural and authentic

Answer:`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('Failed to generate answer');
    }
  }

  static async analyzeMatch(jd: any, profile: any): Promise<any> {
    const prompt = `Analyze job match between candidate and job posting.

Job Requirements:
- Title: ${jd.title}
- Required Skills: ${jd.skills.join(', ')}
- Description: ${jd.description.substring(0, 1000)}

Candidate Profile:
- Skills: ${profile.skills.join(', ')}
- Experience: ${profile.experience}
- Projects: ${profile.projects.map((p: any) => `${p.name} (${p.technologies.join(', ')})`).join('; ')}
- Education: ${profile.education.map((e: any) => `${e.degree} from ${e.institution}`).join('; ')}

Provide analysis in JSON format with:
{
  "score": <number 0-100>,
  "selectionChance": "<Low|Medium|High>",
  "matchedSkills": [<array of matching skills>],
  "missingSkills": [<array of required but missing skills>],
  "strengths": [<array of 2-3 key strengths>],
  "suggestions": [<array of 3-5 specific actionable suggestions>]
}

Rules:
- Score 70-100: High selection chance
- Score 50-69: Medium selection chance
- Score 0-49: Low selection chance
- Be specific and actionable in suggestions
- Consider both technical and soft skills

Return only valid JSON, no additional text.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Gemini API error:', error);
      
      // Fallback response
      return {
        score: 50,
        selectionChance: 'Medium',
        matchedSkills: profile.skills.filter((skill: string) => 
          jd.skills.some((jdSkill: string) => 
            jdSkill.toLowerCase() === skill.toLowerCase()
          )
        ),
        missingSkills: jd.skills.filter((jdSkill: string) => 
          !profile.skills.some((skill: string) => 
            skill.toLowerCase() === jdSkill.toLowerCase()
          )
        ),
        strengths: ['Relevant experience', 'Good skill match'],
        suggestions: [
          'Add more relevant projects to your profile',
          'Highlight specific achievements',
          'Consider learning missing skills'
        ]
      };
    }
  }

  static async getSuggestions(jd: any, profile: any): Promise<any> {
    const prompt = `Provide career improvement suggestions for a job applicant.

Target Job:
- ${jd.title} at ${jd.company}
- Required: ${jd.skills.join(', ')}

Current Profile:
- Skills: ${profile.skills.join(', ')}
- Experience: ${profile.experience}

Provide 5-7 specific, actionable suggestions to improve candidacy for this role.
Return as JSON array of strings.

Example: ["Learn React hooks and create a project", "Add CI/CD experience", ...]`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return [
        'Complete relevant online courses',
        'Build projects using required technologies',
        'Contribute to open source projects',
        'Network with professionals in the field',
        'Update resume with quantifiable achievements'
      ];
    } catch (error) {
      console.error('Gemini API error:', error);
      return [];
    }
  }
}