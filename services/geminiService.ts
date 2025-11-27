import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY is missing via process.env.API_KEY");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

/**
 * Generates a composite image using Gemini 2.5 Flash Image.
 * It sends the original image and a prompt to add the specific biblical figure.
 */
export const generateBiblicalSelfie = async (
  base64Image: string,
  mimeType: string,
  figureName: string
): Promise<string> => {
  try {
    // Construct a specific prompt for image editing/augmentation
    const prompt = `Edit this image. Add a realistic depiction of the biblical figure ${figureName} standing next to the person in the photo. 
    They should look like they are posing for a friendly selfie together. 
    Match the lighting, shadows, and resolution of the original photo. 
    The figure should be wearing historical biblical clothing appropriate for ${figureName}. 
    Make it look high quality and photorealistic.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
        ],
      },
    });

    // Extract the image from the response
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const parts = candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image generated in the response.");
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "生成图片时发生错误，请重试。");
  }
};
