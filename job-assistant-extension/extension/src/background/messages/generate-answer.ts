import type { PlasmoMessaging } from "@plasmohq/messaging";
import { api } from "../../lib/api";
import { getProfile } from "../../lib/storage";

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  try {
    const { question, jd } = req.body;
    const profile = await getProfile();

    if (!profile) {
      return res.send({ 
        error: 'Profile not found',
        answer: null,
      });
    }

    // Call backend API to generate answer using Gemini
    const response = await api.generateAnswer(question, jd, profile);
    
    res.send({
      answer: response.data.answer
    });
  } catch (error: any) {
    console.error('Error generating answer:', error);
    res.send({
      error: error.message || 'Failed to generate answer',
      answer: 'I am very interested in this position and believe my skills and experience make me a strong candidate.',
    });
  }
};

export default handler;