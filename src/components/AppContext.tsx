"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserProfile, WellnessTip, Screen } from "@/lib/types";
import { getUserProfile, getFavoriteTips, getAllTips } from "@/lib/storage";

interface AppContextType {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  wellnessTips: WellnessTip[];
  setWellnessTips: (tips: WellnessTip[]) => void;
  selectedTip: WellnessTip | null;
  setSelectedTip: (tip: WellnessTip | null) => void;
  favoriteTips: WellnessTip[];
  setFavoriteTips: (tips: WellnessTip[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [currentScreen, setCurrentScreen] = useState<Screen>("tips");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [wellnessTips, setWellnessTips] = useState<WellnessTip[]>([]);
  const [selectedTip, setSelectedTip] = useState<WellnessTip | null>(null);
  const [favoriteTips, setFavoriteTips] = useState<WellnessTip[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Custom setter for userProfile that handles clearing data when profile changes
  const updateUserProfile = (newProfile: UserProfile | null) => {
    if (userProfile && newProfile) {
      // Check if this is a significant change
      const significantChange =
        userProfile.age !== newProfile.age ||
        userProfile.gender !== newProfile.gender ||
        JSON.stringify(userProfile.goals.sort()) !==
          JSON.stringify(newProfile.goals.sort());

      if (significantChange) {
        // Clear tips and favorites for fresh start
        setWellnessTips([]);
        setFavoriteTips([]);
        setSelectedTip(null);
      }
    }
    setUserProfile(newProfile);
  };

  useEffect(() => {
    // Load saved data on component mount
    const savedProfile = getUserProfile();
    const savedFavorites = getFavoriteTips();
    const savedTips = getAllTips();

    if (!savedProfile) {
      // If no profile, redirect to profile page
      router.push("/profile");
      return;
    }

    updateUserProfile(savedProfile);
    setFavoriteTips(savedFavorites);

    if (savedTips.length > 0) {
      setWellnessTips(savedTips);
    }
  }, [router]);

  const value = {
    currentScreen,
    setCurrentScreen,
    userProfile,
    setUserProfile: updateUserProfile,
    wellnessTips,
    setWellnessTips,
    selectedTip,
    setSelectedTip,
    favoriteTips,
    setFavoriteTips,
    isLoading,
    setIsLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
