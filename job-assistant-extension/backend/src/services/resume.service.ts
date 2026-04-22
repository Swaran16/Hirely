import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import fs from 'fs';

export class ResumeService {
  static async parseResume(filePath: string): Promise<{ text: string; skills: string[] }> {
    const ext = filePath.toLowerCase().split('.').pop();
    
    let text = '';
    
    if (ext === 'pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      text = data.text;
    } else if (ext === 'doc' || ext === 'docx') {
      const result = await mammoth.extractRawText({ path: filePath });
      text = result.value;
    } else {
      throw new Error('Unsupported file format');
    }

    // Extract skills (basic keyword matching)
    const skills = this.extractSkills(text);
    
    return { text, skills };
  }

  private static extractSkills(text: string): string[] {
    const commonSkills = [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Go', 'Rust',
      'React', 'Angular', 'Vue', 'Svelte', 'Next.js', 'Nuxt.js',
      'Node.js', 'Express', 'Nest.js', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'Ruby on Rails',
      'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Cassandra', 'DynamoDB',
      'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform',
      'Git', 'CI/CD', 'Jenkins', 'GitHub Actions',
      'REST API', 'GraphQL', 'WebSocket', 'gRPC',
      'HTML', 'CSS', 'Tailwind', 'Bootstrap', 'SASS',
      'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Scikit-learn',
      'Data Analysis', 'Pandas', 'NumPy', 'Matplotlib',
      'Agile', 'Scrum', 'Jira', 'Confluence'
    ];

    const foundSkills: string[] = [];
    const lowerText = text.toLowerCase();

    commonSkills.forEach(skill => {
      if (lowerText.includes(skill.toLowerCase())) {
        foundSkills.push(skill);
      }
    });

    return [...new Set(foundSkills)];
  }
}