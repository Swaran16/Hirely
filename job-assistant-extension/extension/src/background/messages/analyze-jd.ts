import type { PlasmoMessaging } from "@plasmohq/messaging";
import { api } from "../../lib/api";
import { getProfile } from "../../lib/storage";

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  try {
    const { jd } = req.body;
    const profile = await getProfile();

    if (!profile) {
      return res.send({
        match: {
          score: 0,
          selectionChance: 'Low',
          matchedSkills: [],
          missingSkills: [],
          strengths: [],
          suggestions: ['Please complete your profile first to get accurate match analysis.'],
        }
      });
    }

    // Call backend API to analyze match
    const response = await api.analyzeMatch(jd, profile);
    
    res.send({
      match: response.data
    });
  } catch (error: any) {
    console.error('Error analyzing JD:', error);
    res.send({
      error: error.message || 'Failed to analyze job description',
      match: null,
    });
  }
};

export default handler;