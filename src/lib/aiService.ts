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
  let modelsToTry = ["gemini-2.5-flash","gemini-2.0-flash-lite","gemini-1.5-flash"];

  // Try to list available models and filter the candidates to avoid 404s
  try {
    // @ts-ignore - listModels may exist on the client
    const list = await (genAI as any).listModels?.();
    const availableNames: string[] =
      list?.models?.map((m: any) => m.name) || [];
    if (availableNames.length > 0) {
      modelsToTry = modelsToTry.filter((m) => availableNames.includes(m));
    }
  } catch (err) {
    // If listing fails, continue with the preconfigured list
    console.warn(
      "Could not list models, proceeding with default candidates",
      err
    );
  }

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

  // Try models in order; if a model returns a 503 or overloaded message, try the next one.
  for (const modelName of modelsToTry) {
    const model = genAI.getGenerativeModel({ model: modelName });
    try {
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
    } catch (error: any) {
      // Inspect error for a transient overload (503). If so, try the next model.
      const status = error?.status;
      const statusText = error?.statusText || "";
      const message = error?.message || "";
      console.warn(
        `Model ${modelName} failed:`,
        status || statusText || message
      );

      const isTransient =
        status === 503 ||
        /Service Unavailable|overloaded|503/.test(statusText + message);
      if (isTransient) {
        // try next model
        continue;
      }

      // non-transient error: break and fall back
      console.error("Error generating wellness tips:", error);
      return generateFallbackTips();
    }
  }

  // If all models fail, return fallback tips
  console.error("All models failed; returning fallback tips");
  return generateFallbackTips();
}

export async function generateDetailedTip(
  tip: WellnessTip,
  profile: UserProfile
): Promise<WellnessTip> {
  const modelsToTry = ["gemini-1.5-flash", "gemini-1.5", "gemini-1.0"];

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

  // Try multiple models, falling back on transient errors
  for (const modelName of modelsToTry) {
    const model = genAI.getGenerativeModel({ model: modelName });
    try {
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
    } catch (error: any) {
      const status = error?.status;
      const statusText = error?.statusText || "";
      const message = error?.message || "";
      console.warn(
        `Model ${modelName} failed for detailed tip:`,
        status || statusText || message
      );
      const isTransient =
        status === 503 ||
        /Service Unavailable|overloaded|503/.test(statusText + message);
      if (isTransient) continue;

      console.error("Error generating detailed tip:", error);
      return {
        ...tip,
        longExplanation: `This ${
          tip.category
        } tip focuses on ${tip.shortDescription.toLowerCase()}. It's particularly beneficial for your goals and can be easily incorporated into your daily routine.`,
        steps: [
          "Start with small, manageable changes",
          "Set a consistent daily schedule",
          "Track your progress regularly",
          "Stay motivated and be patient with yourself",
        ],
      };
    }
  }

  console.error(
    "All models failed for detailed tip; returning simple fallback details"
  );
  return {
    ...tip,
    longExplanation: `This ${
      tip.category
    } tip focuses on ${tip.shortDescription.toLowerCase()}. It's particularly beneficial for your goals and can be easily incorporated into your daily routine.`,
    steps: [
      "Start with small, manageable changes",
      "Set a consistent daily schedule",
      "Track your progress regularly",
      "Stay motivated and be patient with yourself",
    ],
  };
}

function generateFallbackTips(): WellnessTip[] {
  return [
    {
      id: "tip-1",
      title: "Start Your Day with Water",
      shortDescription: "Hydrate immediately after waking up",
      icon: "💧",
      category: "lifestyle",
    },
    {
      id: "tip-2",
      title: "Take Walking Breaks",
      shortDescription: "Move every hour for better health",
      icon: "🚶",
      category: "exercise",
    },
    {
      id: "tip-3",
      title: "Practice Deep Breathing",
      shortDescription: "Reduce stress with mindful breathing",
      icon: "🧘",
      category: "mental-health",
    },
    {
      id: "tip-4",
      title: "Eat Rainbow Foods",
      shortDescription: "Colorful plates ensure nutrient variety",
      icon: "🌈",
      category: "nutrition",
    },
    {
      id: "tip-5",
      title: "Set a Sleep Schedule",
      shortDescription: "Consistent bedtime improves rest quality",
      icon: "😴",
      category: "sleep",
    },
  ];
}
