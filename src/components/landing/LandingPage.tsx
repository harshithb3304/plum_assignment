'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { 
  Sparkles, 
  Star,
  Target,
  Lightbulb,
  BookOpen,
  Save
} from 'lucide-react';

export function LandingPage() {
  const [stars, setStars] = useState<Array<{
    id: number;
    left: number;
    delay: number;
    duration: number;
    size: number;
  }>>([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars = [];
      for (let i = 0; i < 15; i++) {
        newStars.push({
          id: i,
          left: Math.random() * window.innerWidth,
          delay: Math.random() * 5,
          duration: 3 + Math.random() * 4,
          size: 12 + Math.random() * 20,
        });
      }
      setStars(newStars);
    };

    generateStars();
    const interval = setInterval(generateStars, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-white dark:bg-black overflow-hidden transition-colors duration-300 flex flex-col">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-black" />

      {/* Glow accents */}
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2
                     w-[90vw] h-[45vw] sm:w-[80vw] sm:h-[40vw] lg:w-[70vw] lg:h-[35vw] xl:w-[1400px] xl:h-[700px]
                     bg-blue-400/20 dark:bg-blue-500/30 rounded-t-full blur-[100px] sm:blur-[140px] lg:blur-[180px]" />

      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2
                     w-[60vw] h-[30vw] sm:w-[50vw] sm:h-[25vw] lg:w-[40vw] lg:h-[20vw] xl:w-[800px] xl:h-[400px]
                     bg-blue-300/10 dark:bg-blue-400/20 rounded-t-full blur-[60px] sm:blur-[100px] lg:blur-[120px]" />

      {/* Stars */}
      {stars.map((star) => (
        <Star
          key={star.id}
          className="absolute text-blue-400/60 dark:text-blue-200/60 animate-float-up"
          style={{
            left: `${star.left}px`,
            bottom: '-20px',
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}

      {/* Header */}
      <header className="relative z-10 px-4 sm:px-6 py-4 sm:py-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer hover:scale-105 transition-transform">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-white/10 backdrop-blur-sm">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-white animate-gentle-pulse" />
            </div>
            <span className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
              Wellness AI
            </span>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            <Link href="/profile" className="cursor-pointer">
              <Button
                variant="outline"
                size="lg"
                className="border-gray-300 text-gray-800 hover:bg-gray-100 hover:text-gray-900 dark:border-white dark:text-white dark:hover:bg-white/10 dark:hover:text-white transition-all duration-300 hover:scale-105 text-sm"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex items-center justify-center flex-1 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8 sm:gap-12 max-w-6xl mx-auto py-12 sm:py-16 lg:py-20">
          {/* Title Section */}
          <div className="flex flex-col items-center gap-4 sm:gap-7 text-center">
            <div className="text-gray-900 dark:text-white font-semibold text-lg sm:text-xl tracking-tight border-2 border-blue-200 dark:border-blue-400 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10">
              Wellness AI
            </div>
            
            <h1 className="text-blue-600 dark:text-white font-medium text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight max-w-4xl">
              Your Personal
              <br />
              <span className="text-blue-400 dark:text-blue-300">Wellness Journey</span>
              <br />
              Starts Here
            </h1>
            
            <div className="text-gray-600 dark:text-white/80 font-normal text-base sm:text-lg leading-7 sm:leading-8 tracking-tight max-w-full sm:max-w-[850px] space-y-4 px-2 sm:px-0">
              <p>
                Get personalized health recommendations powered by AI. Create your profile, receive 5 tailored wellness tips, 
                and dive deep into step-by-step guidance designed just for you.
              </p>
              
              <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm">
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full backdrop-blur-sm cursor-pointer hover:bg-blue-100 dark:bg-white/10 dark:hover:bg-white/20 transition-all">
                  <Target className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                  <span className="text-gray-800 dark:text-white">Personalized Goals</span>
                </div>
                <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-full backdrop-blur-sm cursor-pointer hover:bg-yellow-100 dark:bg-white/10 dark:hover:bg-white/20 transition-all">
                  <Lightbulb className="w-4 h-4 text-yellow-600 dark:text-yellow-300" />
                  <span className="text-gray-800 dark:text-white">AI-Generated Tips</span>
                </div>
                <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full backdrop-blur-sm cursor-pointer hover:bg-green-100 dark:bg-white/10 dark:hover:bg-white/20 transition-all">
                  <BookOpen className="w-4 h-4 text-green-600 dark:text-green-300" />
                  <span className="text-gray-800 dark:text-white">Step-by-Step Guides</span>
                </div>
                <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full backdrop-blur-sm cursor-pointer hover:bg-purple-100 dark:bg-white/10 dark:hover:bg-white/20 transition-all">
                  <Save className="w-4 h-4 text-purple-600 dark:text-purple-300" />
                  <span className="text-gray-800 dark:text-white">Save Favorites</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/profile">
              <Button variant="outline" size="lg" className="border-gray-300 text-gray-800 hover:bg-gray-100 hover:text-gray-900 dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black">
                Start Your Journey
              </Button>
            </Link>
          </div>

          {/* Steps preview removed for responsive layout */}
        </div>
      </main>
    </div>
  );
}
