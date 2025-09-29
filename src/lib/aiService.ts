import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY!);

export interface UserProfile {
  age: number;
  gender: string;
  goals: string[];
}

export interface WellnessTip {
  id: string;
  title: string;
  shortDescription: string;
  icon: string;
  category: string;
  longExplanation?: string;
  steps?: string[];
}

export async function generateWellnessTips(
  profile: UserProfile
): Promise<WellnessTip[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Generate 5 personalized wellness tips for a ${
    profile.age
  }-year-old ${profile.gender} with goals: ${profile.goals.join(", ")}.

For each tip, provide:
1. A catchy, concise title (max 8 words)
2. A brief description (max 20 words)
3. A relevant emoji icon
4. A category (nutrition, exercise, mental-health, sleep, lifestyle)

Format as JSON array with this structure:
[
  {
    "title": "string",
    "shortDescription": "string",
    "icon": "emoji",
    "category": "string"
  }
]

Make tips actionable, age-appropriate, and goal-specific. Keep them engaging and motivational.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  // Extract JSON from the response
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error("Failed to extract JSON from AI response");
  }

  const tips = JSON.parse(jsonMatch[0]);
  const timestamp = Date.now();
  const sessionId = Math.random().toString(36).substring(2, 8);
  
  return tips.map((tip: any, index: number) => ({
    ...tip,
    id: `tip-${timestamp}-${sessionId}-${index + 1}`,
  }));
}

export async function generateDetailedTip(
  tip: WellnessTip,
  profile: UserProfile
): Promise<WellnessTip> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `Provide a detailed explanation and step-by-step guide for this wellness tip:

Title: ${tip.title}
Description: ${tip.shortDescription}
Category: ${tip.category}
User Profile: ${profile.age}-year-old ${
    profile.gender
  }, Goals: ${profile.goals.join(", ")}

Provide:
1. A comprehensive explanation (2-3 paragraphs, max 200 words)
2. 4-6 specific, actionable steps to implement this tip
3. Make it personalized for the user's age, gender, and goals

Format as JSON:
{
  "longExplanation": "string",
  "steps": ["step1", "step2", "step3", ...]
}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  // Extract JSON from the response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to extract JSON from AI response");
  }

  const details = JSON.parse(jsonMatch[0]);
  return {
    ...tip,
    longExplanation: details.longExplanation,
    steps: details.steps,
  };
}
```I'll help you remove all the fallbacks from your `aiService.ts` file. Here's the cleaned up version without any fallback mechanisms, error handling fallbacks, model retry logic, or the `generateFallbackTips` function:

```typescript name=src/lib/aiService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY!);

export interface UserProfile {
  age: number;
  gender: string;
  goals: string[];
}

export interface WellnessTip {
  id: string;
  title: string;
  shortDescription: string;
  icon: string;
  category: string;
  longExplanation?: string;
  steps?: string[];
}

export async function generateWellnessTips(
  profile: UserProfile
): Promise<WellnessTip[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const prompt = `Generate 5 personalized wellness tips for a ${
    profile.age
  }-year-old ${profile.gender} with goals: ${profile.goals.join(", ")}.

For each tip, provide:
1. A catchy, concise title (max 8 words)
2. A brief description (max 20 words)
3. A relevant emoji icon
4. A category (nutrition, exercise, mental-health, sleep, lifestyle)

Format as JSON array with this structure:
[
  {
    "title": "string",
    "shortDescription": "string",
    "icon": "emoji",
    "category": "string"
  }
]

Make tips actionable, age-appropriate, and goal-specific. Keep them engaging and motivational.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  // Extract JSON from the response
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error("Failed to extract JSON from AI response");
  }

  const tips = JSON.parse(jsonMatch[0]);
  const timestamp = Date.now();
  const sessionId = Math.random().toString(36).substring(2, 8);
  
  return tips.map((tip: any, index: number) => ({
    ...tip,
    id: `tip-${timestamp}-${sessionId}-${index + 1}`,
  }));
}

export async function generateDetailedTip(
  tip: WellnessTip,
  profile: UserProfile
): Promise<WellnessTip> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const prompt = `Provide a detailed explanation and step-by-step guide for this wellness tip:

Title: ${tip.title}
Description: ${tip.shortDescription}
Category: ${tip.category}
User Profile: ${profile.age}-year-old ${
    profile.gender
  }, Goals: ${profile.goals.join(", ")}

Provide:
1. A comprehensive explanation (2-3 paragraphs, max 200 words)
2. 4-6 specific, actionable steps to implement this tip
3. Make it personalized for the user's age, gender, and goals

Format as JSON:
{
  "longExplanation": "string",
  "steps": ["step1", "step2", "step3", ...]
}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  // Extract JSON from the response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to extract JSON from AI response");
  }

  const details = JSON.parse(jsonMatch[0]);
  return {
    ...tip,
    longExplanation: details.longExplanation,
    steps: details.steps,
  };
}
