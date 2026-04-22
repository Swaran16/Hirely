import type { PlasmoMessaging } from "@plasmohq/messaging";
import { api } from "../../lib/api";

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  try {
    const { jobTitle, company } = req.body;
    const response = await api.trackApplication(jobTitle, company);
    res.send({
      success: true,
      application: response.data
    });
  } catch (error) {
    console.error('Error tracking application:', error);
    res.send({
      success: false,
      error: 'Failed to track application'
    });
  }
};

export default handler;
