'use client';

import React from 'react';
import { AppProvider, useAppContext } from '@/components/AppContext';
import { TipsScreen } from '@/components/screens/TipsScreen';
import { DetailScreen } from '@/components/screens/DetailScreen';
import { generateTipsAction, generateDetailsAction } from '@/lib/actions';
import { WellnessTip } from '@/lib/types';

function AppContent() {
  const { currentScreen, userProfile } = useAppContext();

  const handleGenerateTips = async (): Promise<WellnessTip[]> => {
    if (!userProfile) throw new Error('No user profile available');
    
    const result = await generateTipsAction(userProfile);
    if (!result.success) {
      throw new Error(result.error);
    }
    return result.data;
  };

  const handleGenerateDetails = async (tip: WellnessTip): Promise<WellnessTip> => {
    if (!userProfile) throw new Error('No user profile available');
    
    const result = await generateDetailsAction(tip, userProfile);
    if (!result.success) {
      throw new Error(result.error);
    }
    return result.data;
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'tips':
        return <TipsScreen onGenerateTips={handleGenerateTips} />;
      case 'detail':
        return <DetailScreen onGenerateDetails={handleGenerateDetails} />;
      default:
        return <TipsScreen onGenerateTips={handleGenerateTips} />;
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-black transition-colors duration-300">
      <div className="absolute inset-0 bg-background dark:bg-black" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-blue-500/5 dark:bg-blue-500/10 opacity-50 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10">
        {renderScreen()}
      </div>
    </div>
  );
}

export function WellnessApp() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}