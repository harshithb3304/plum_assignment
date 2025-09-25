"use server";

import {
  generateWellnessTips,
  generateDetailedTip,
  UserProfile,
  WellnessTip,
} from "@/lib/aiService";

export async function generateTipsAction(
  profile: UserProfile
): Promise<
  { success: true; data: WellnessTip[] } | { success: false; error: string }
> {
  try {
    const tips = await generateWellnessTips(profile);
    return { success: true, data: tips };
  } catch (error) {
    console.error("Failed to generate tips:", error);
    return { success: false, error: "Failed to generate tips" };
  }
}

export async function generateDetailsAction(
  tip: WellnessTip,
  profile: UserProfile
): Promise<
  { success: true; data: WellnessTip } | { success: false; error: string }
> {
  try {
    const detailedTip = await generateDetailedTip(tip, profile);
    return { success: true, data: detailedTip };
  } catch (error) {
    console.error("Failed to generate detailed tip:", error);
    return { success: false, error: "Failed to generate detailed tip" };
  }
}
