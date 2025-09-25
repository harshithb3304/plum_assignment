'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ThemeToggle } from '@/components/theme-toggle';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { RefreshCw, Heart, User, Star, ArrowLeft, Sparkles, Copy, Check, Download, AlertTriangle } from 'lucide-react';
import { useAppContext } from '@/components/AppContext';
import { WellnessTip } from '@/lib/types';
import { CATEGORY_COLORS } from '@/lib/types';
import { saveAllTips, isFavorite, addToFavorites, removeFromFavorites, getFavoriteTips, saveFavoriteTips } from '@/lib/storage';
import { exportFavoritesToPDF } from '@/lib/pdfExport';

interface TipsScreenProps {
  onGenerateTips: () => Promise<WellnessTip[]>;
}

export function TipsScreen({ onGenerateTips }: TipsScreenProps) {
  const { 
    wellnessTips, 
    setWellnessTips, 
    setSelectedTip, 
    setCurrentScreen, 
    userProfile,
    isLoading,
    setIsLoading
  } = useAppContext();

  const [progress, setProgress] = useState(0);
  const [copiedTipId, setCopiedTipId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Update favorites when tips change
  useEffect(() => {
    const currentFavorites = getFavoriteTips();
    setFavorites(currentFavorites.map(tip => tip.id));
    
    // Remove favorites for tips that no longer exist
    if (wellnessTips.length > 0) {
      const currentTipIds = wellnessTips.map(tip => tip.id);
      const updatedFavorites = currentFavorites.filter(fav => 
        currentTipIds.includes(fav.id)
      );
      if (updatedFavorites.length !== currentFavorites.length) {
        saveFavoriteTips(updatedFavorites);
        setFavorites(updatedFavorites.map(tip => tip.id));
      }
    }
  }, [wellnessTips]);

  useEffect(() => {
    if (wellnessTips.length === 0 && userProfile) {
      generateTips();
    }
  }, [userProfile, wellnessTips.length]);

  const copyToClipboard = async (tip: WellnessTip) => {
    try {
      const textToCopy = `${tip.title}\n\n${tip.shortDescription}\n\nCategory: ${tip.category.replace('-', ' ')}`;
      await navigator.clipboard.writeText(textToCopy);
      setCopiedTipId(tip.id);
      setTimeout(() => setCopiedTipId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const toggleFavorite = (tip: WellnessTip) => {
    if (favorites.includes(tip.id)) {
      removeFromFavorites(tip.id);
      setFavorites(prev => prev.filter(id => id !== tip.id));
    } else {
      addToFavorites(tip);
      setFavorites(prev => [...prev, tip.id]);
    }
  };

  const generateTips = async () => {
    if (!userProfile) return;

    setIsLoading(true);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      const tips = await onGenerateTips();
      setWellnessTips(tips);
      saveAllTips(tips);
      setProgress(100);
    } catch (error) {
      console.error('Failed to generate tips:', error);
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 500);
    }
  };

  const handleTipClick = async (tip: WellnessTip) => {
    const cardElement = document.getElementById(`tip-card-${tip.id}`);
    if (cardElement) {
      // Add immediate feedback
      cardElement.style.transform = 'scale(0.98)';
      cardElement.style.transition = 'transform 0.1s ease-out';
      
      // Wait a bit then do the fancy animation
      setTimeout(() => {
        cardElement.style.transform = 'scale(1.02)';
        cardElement.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
          setSelectedTip(tip);
          setCurrentScreen('detail');
        }, 150);
      }, 100);
    } else {
      // Fallback if no element found
      setSelectedTip(tip);
      setCurrentScreen('detail');
    }
  };

  const handleRegenerate = () => {
    const currentFavorites = getFavoriteTips();
    if (currentFavorites.length > 0) {
      setShowConfirmDialog(true);
    } else {
      proceedWithRegeneration();
    }
  };

  const proceedWithRegeneration = async () => {
    setShowConfirmDialog(false);
    onGenerateTips();
  };

  const handleExportPDF = async () => {
    const currentFavorites = getFavoriteTips();
    if (currentFavorites.length > 0) {
      await exportFavoritesToPDF(currentFavorites, userProfile);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100/30 dark:from-gray-900 dark:via-black dark:to-blue-950/30 relative overflow-hidden transition-colors duration-300">
        {/* Blue theme background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/15 to-blue-600/15 dark:from-blue-500/25 dark:to-blue-700/25 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-blue-300/10 to-blue-500/10 dark:from-blue-400/20 dark:to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 container max-w-4xl mx-auto p-4 sm:p-6 flex items-center justify-center min-h-screen">
          <Card className="text-center max-w-md w-full shadow-2xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-blue-200 dark:border-blue-800">
            <CardHeader>
              <div className="mx-auto mb-4 p-4 rounded-2xl bg-blue-100 dark:bg-blue-900/50 w-fit animate-pulse">
                <Sparkles className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Creating Your Personalized Tips ✨
              </CardTitle>
              <CardDescription className="text-base text-gray-600 dark:text-gray-400">
                AI is analyzing your profile and generating custom recommendations...
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Progress value={progress} className="w-full h-2 bg-blue-100 dark:bg-blue-900/30" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {progress < 30 && "Analyzing your wellness goals..."}
                {progress >= 30 && progress < 60 && "Crafting personalized recommendations..."}
                {progress >= 60 && progress < 90 && "Adding finishing touches..."}
                {progress >= 90 && "Almost ready!"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100/30 dark:from-gray-900 dark:via-black dark:to-blue-950/30 relative overflow-hidden transition-colors duration-300">
      {/* Animated background elements - matching landing page */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-blue-600/10 dark:from-blue-500/20 dark:to-blue-700/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-blue-300/8 to-blue-500/8 dark:from-blue-400/15 dark:to-blue-600/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Glow accent similar to landing */}
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-3/4 w-[80vw] h-[40vw] bg-blue-400/15 dark:bg-blue-500/25 rounded-t-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 py-6">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 cursor-pointer group">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-white/10 backdrop-blur-sm transition-transform group-hover:scale-105">
              <Sparkles className="h-6 w-6 text-blue-600 dark:text-white animate-gentle-pulse-alt" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              WellnessAI
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="cursor-pointer border-gray-300 text-gray-800 hover:bg-blue-50 hover:text-blue-900 dark:border-white/20 dark:text-white dark:hover:bg-white/10 dark:hover:text-white transition-all duration-300 hover:scale-105">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="relative z-10 container max-w-[1600px] mx-auto p-6 lg:p-8">
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-100 dark:bg-white/10 backdrop-blur-sm">
                <User className="h-7 w-7 text-blue-600 dark:text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Your Wellness Board
              </h1>
            </div>
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                size="default" 
                onClick={() => setCurrentScreen('favorites')}
                className="flex items-center gap-2 cursor-pointer transition-all duration-300 hover:scale-105 border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-900/30 px-6 py-2"
              >
                <Link href="/favorites" className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Favorites
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="default" 
                onClick={handleRegenerate}
                className="flex items-center gap-2 cursor-pointer transition-all duration-300 hover:scale-105 border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-900/30 px-6 py-2"
                disabled={isLoading}
              >
                <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
                Regenerate
              </Button>
            </div>
          </div>
          
          {userProfile && (
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-800 backdrop-blur-sm shadow-lg">
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <Badge variant="secondary" className="font-medium bg-white/70 dark:bg-gray-800/70 text-blue-800 dark:text-blue-200 px-3 py-1.5">
                  {userProfile.age} years old
                </Badge>
                <Badge variant="secondary" className="font-medium bg-white/70 dark:bg-gray-800/70 text-blue-800 dark:text-blue-200 px-3 py-1.5">
                  {userProfile.gender}
                </Badge>
                <span className="text-gray-700 dark:text-gray-300 font-medium text-base">Goals:</span>
                <div className="flex flex-wrap gap-2">
                  {userProfile.goals.slice(0, 8).map(goal => (
                    <Badge key={goal} variant="outline" className="text-sm border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 px-3 py-1 cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-blue-50 dark:hover:bg-blue-900/30">
                      {goal}
                    </Badge>
                  ))}
                  {userProfile.goals.length > 8 && (
                    <Badge variant="outline" className="text-sm border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 px-3 py-1 cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-blue-50 dark:hover:bg-blue-900/30">
                      +{userProfile.goals.length - 8} more
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>

        {wellnessTips.length === 0 ? (
          <Card className="text-center max-w-md mx-auto shadow-lg bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-blue-200 dark:border-blue-800">
            <CardContent className="pt-8 pb-8">
              <Sparkles className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4 animate-gentle-pulse-alt" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">No tips generated yet.</p>
              <Button onClick={handleRegenerate} className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                Generate Tips
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="relative px-8">
            <Carousel
              opts={{
                align: "start",
                loop: false,
              }}
              className="w-full max-w-full mx-auto"
            >
              <CarouselContent className="-ml-4 md:-ml-6 py-8">
                {wellnessTips.map((tip, index) => (
                  <CarouselItem key={tip.id} className="pl-4 md:pl-6 basis-full sm:basis-1/2 xl:basis-1/3 2xl:basis-1/4">
                    <div className="p-2 h-full">
                      <Card
                        className="cursor-pointer transition-all duration-500 hover:shadow-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm group transform-gpu hover:-translate-y-3 hover:scale-[1.02] border-blue-200/50 dark:border-blue-800/50 relative overflow-hidden h-[320px] flex flex-col animate-fadeInScale active:scale-95"
                        onClick={() => handleTipClick(tip)}
                        id={`tip-card-${tip.id}`}
                        style={{ 
                          animationDelay: `${index * 120}ms`
                        }}
                      >
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-blue-100/10 dark:from-blue-950/40 dark:to-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                        
                        {/* Action buttons */}
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-400 transform translate-y-3 group-hover:translate-y-0 z-10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(tip);
                            }}
                            className="p-2 rounded-full bg-white/95 dark:bg-gray-800/95 shadow-xl hover:scale-110 transition-transform duration-200 border border-blue-200/50 dark:border-blue-700/50"
                          >
                            {copiedTipId === tip.id ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(tip);
                            }}
                            className="p-2 rounded-full bg-white/95 dark:bg-gray-800/95 shadow-xl hover:scale-110 transition-transform duration-200 border border-blue-200/50 dark:border-blue-700/50"
                          >
                            <Heart 
                              className={`h-4 w-4 transition-colors duration-200 ${
                                favorites.includes(tip.id) 
                                  ? 'text-red-500 fill-current' 
                                  : 'text-gray-400 dark:text-gray-500'
                              }`} 
                            />
                          </button>
                        </div>

                        <CardHeader className="pb-4 relative flex-shrink-0">
                          <div className="flex items-start justify-between mb-4">
                            <div className="text-5xl transition-all duration-500 group-hover:scale-125 group-hover:-rotate-12 transform-gpu will-change-transform">
                              {tip.icon}
                            </div>
                          </div>
                          <CardTitle className="text-xl font-bold line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 leading-tight">
                            {tip.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="relative flex-1 flex flex-col">
                          <CardDescription className="mb-4 line-clamp-4 leading-relaxed text-gray-600 dark:text-gray-300 flex-1 text-sm">
                            {tip.shortDescription}
                          </CardDescription>
                          <div className="mt-auto pt-2">
                            <Badge
                              className={`text-xs transition-all duration-300 px-3 py-1 ${CATEGORY_COLORS[tip.category as keyof typeof CATEGORY_COLORS] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'} group-hover:scale-105`}
                              variant="secondary"
                            >
                              {tip.category.replace('-', ' ').split(' ').map(word => 
                                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                              ).join(' ')}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden lg:flex -left-16 bg-white/95 dark:bg-gray-800/95 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/50 shadow-xl w-12 h-12" />
              <CarouselNext className="hidden lg:flex -right-16 bg-white/95 dark:bg-gray-800/95 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/50 shadow-xl w-12 h-12" />
            </Carousel>
          </div>
        )}
      </div>
      
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Regenerate Tips
            </DialogTitle>
            <DialogDescription>
              Regenerating tips will clear your current favorites. Do you want to continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            {getFavoriteTips().length > 0 && (
              <Button
                variant="outline"
                onClick={handleExportPDF}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export PDF First
              </Button>
            )}
            <div className="flex gap-2 sm:ml-auto">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={proceedWithRegeneration}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Continue
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}