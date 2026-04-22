export class MatchingService {
  async analyzeMatch(jd: any, profile: any) {
    // Logic to compare JD and Profile
    return {
      score: 80,
      matchedSkills: [],
      missingSkills: [],
    };
  }
}

export const matchingService = new MatchingService();
