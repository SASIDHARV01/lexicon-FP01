import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { situation } = req.body;

    if (!situation) {
      return res.status(400).json({ error: 'Situation is required' });
    }

    // Initialize the SDK using the environment variable securely
    const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error("API Key is missing in environment variables.");
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });
    
    const prompt = `
You are a vocabulary expert and a reverse dictionary.
The user will describe a situation, feeling, action, or concept.
You must find the most precise and accurate English word that matches their description.

Description: "${situation}"

Provide the output strictly in the following JSON format without any markdown blocks or additional text:
{
  "word": "The exact word",
  "phonetic": "/phonetic spelling/",
  "definition": "A clear, concise definition of the word",
  "examples": ["Example sentence 1", "Example sentence 2"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    const data = JSON.parse(text);
    
    res.status(200).json(data);
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: 'Failed to generate word' });
  }
}
