
import { GoogleGenAI } from "@google/genai";

// Initialize the GoogleGenAI client using the API key from process.env.API_KEY.
// The key is accessed directly and initialized with the named parameter.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateObjectDiary = async (itemTitle: string, userKeywords: string) => {
  try {
    // Generate content using gemini-3-flash-preview, suitable for creative text tasks.
    // The model name and prompt are provided directly within the generateContent call.
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Escribe un "Diario del Objeto" poético y misterioso para un artículo llamado "${itemTitle}". 
                 Usa estos conceptos o palabras clave: ${userKeywords}. 
                 El tono debe ser místico, enfocado en la luz y las sombras, alineado con el manifiesto de SUBREAL. 
                 Máximo 100 palabras.`,
      config: {
        temperature: 0.8,
        topP: 0.9,
      },
    });

    // Access the generated text directly via the .text property (it is not a method).
    return response.text;
  } catch (error) {
    console.error("Error generating diary:", error);
    return "En este objeto reside una historia que aún espera ser contada por su próximo guardián...";
  }
};
