import { GoogleGenAI, Type } from "@google/genai";
import { InstrumentAnalysis } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const analysisSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      instrument: {
        type: Type.STRING,
        description:
          "The name of the instrument or sound group (e.g., Drums, Bass, Vocals, Lead Guitar, Rhythm Guitar, Keyboards, Strings, FX).",
      },
      description: {
        type: Type.STRING,
        description:
          "A detailed, one or two-sentence description of this instrument's role, sound, and character in the song.",
      },
    },
    required: ["instrument", "description"],
  },
};

export const analyzeSong = async (fileName: string): Promise<InstrumentAnalysis[]> => {
  const prompt = `
    A user has uploaded an audio file with the name: "${fileName}".

    Your task is to first infer the song title and artist from this filename. Then, act as an expert audio engineer and break down the inferred song's instrumentation. 
    Identify the core instrumental and vocal parts. 
    
    Please provide a breakdown for at least 5 of the following categories if they are present in the song:
    - Vocals
    - Drums
    - Bass
    - Lead Guitar
    - Rhythm Guitar
    - Keyboards/Synths
    - Strings/Orchestral
    - FX (Sound Effects / Ambiance)
    
    If a prominent instrument not on this list is present (like a saxophone), include it.
    For each part, provide a concise description of its role and sonic character.
    Do not return an instrument if it's not clearly audible in the track. If you cannot confidently identify the song from the filename, return an error in your analysis.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.7,
      },
    });
    
    const jsonString = response.text.trim();
    if (!jsonString.startsWith('[')) {
        throw new Error("The model could not analyze the song from the provided filename. Please ensure the filename is descriptive (e.g., 'Artist - Title.mp3').");
    }

    const result = JSON.parse(jsonString);

    if (!Array.isArray(result) || result.length === 0) {
        throw new Error("AI returned empty or invalid analysis.");
    }

    return result as InstrumentAnalysis[];

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && error.message.includes("model could not analyze")) {
        throw error;
    }
    throw new Error("Failed to get analysis from Gemini API.");
  }
};