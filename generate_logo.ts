import { GoogleGenAI } from "@google/genai";

async function generateLogo() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: "A premium, minimalist logo for an AI-powered e-commerce platform called 'VibeShop'. The design should be sleek and high-end, suitable for a dark mode application. Use a sophisticated color palette: deep charcoal, midnight blue, and subtle accents of champagne gold or soft emerald (not too vivid). The logo should feature an abstract, modern icon representing growth or a stylized shopping bag, combined with elegant typography. Vector style, clean lines, professional branding, isolated on white background.",
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        console.log("IMAGE_DATA:" + part.inlineData.data);
      }
    }
  } catch (error) {
    console.error("Error generating logo:", error);
  }
}

generateLogo();
