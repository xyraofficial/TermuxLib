
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedSetup } from "../types";

/**
 * Generates a comprehensive setup guide for a Termux package using Gemini.
 * Follows world-class engineering standards by initializing the client per request
 * to handle dynamic environment contexts effectively.
 */
export const generateSetupForPackage = async (packageName: string): Promise<GeneratedSetup | null> => {
  try {
    // Initialize GoogleGenAI inside the function to ensure the most up-to-date API key is used
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a comprehensive Termux setup guide for the following tool or package: ${packageName}. Include description, prerequisites, commands, and basic usage.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            packageName: { type: Type.STRING },
            description: { type: Type.STRING },
            prerequisites: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            installCommands: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            postInstall: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            usage: { type: Type.STRING }
          },
          required: ["packageName", "description", "prerequisites", "installCommands", "postInstall", "usage"]
        }
      }
    });

    // Directly access the .text property (not a function) and trim for safe parsing
    const text = response.text?.trim();
    if (text) {
      try {
        return JSON.parse(text) as GeneratedSetup;
      } catch (parseError) {
        console.error("Gemini JSON parse failed:", parseError);
        return null;
      }
    }
    return null;
  } catch (error) {
    console.error("Gemini Service Error:", error);
    return null;
  }
};
