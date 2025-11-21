import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateAiInsight = async (prompt: string, contextData: string): Promise<string> => {
  if (!apiKey) return "API Key is missing. AI features unavailable.";

  try {
    const model = 'gemini-2.5-flash';
    const fullPrompt = `
      You are an intelligent assistant for a Church Management System. 
      Context Data: ${contextData}
      
      User Request: ${prompt}
      
      Provide a professional, encouraging, and concise response suitable for church administration.
      If analyzing data, provide trends and actionable insights.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: fullPrompt,
    });

    return response.text || "No insight generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to generate insight at this time.";
  }
};

export const draftSmsContent = async (topic: string, audience: string): Promise<string> => {
  if (!apiKey) return "API Key is missing.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Draft a short, warm, and professional SMS message (under 160 characters if possible, max 200) for a church to send to ${audience}. Topic: ${topic}. Do not include placeholders like [Name], make it generic but personal.`,
    });
    return response.text || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error drafting message.";
  }
};