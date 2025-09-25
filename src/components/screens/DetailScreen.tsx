"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Heart,
  BookOpen,
  CheckCircle,
  Copy,
  Check,
} from "lucide-react";
import { useAppContext } from "@/components/AppContext";
import { WellnessTip } from "@/lib/types";
import { CATEGORY_COLORS } from "@/lib/types";
import {
  addToFavorites,
  removeFromFavorites,
  isFavorite,
  getFavoriteTips,
} from "@/lib/storage";

interface DetailScreenProps {
  onGenerateDetails: (tip: WellnessTip) => Promise<WellnessTip>;
}

const cleanMarkdownText = (text: string): string => {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/_{2}(.*?)_{2}/g, "$1")
    .replace(/_(.*?)_/g, "$1")
    .replace(/\`(.*?)\`/g, "$1")
    .replace(/#{1,6}\s*(.*)/g, "$1")
    .replace(/^\s*[-*+]\s*/gm, "")
    .replace(/^\s*\d+\.\s*/gm, "")
    .trim();
};

export function DetailScreen({ onGenerateDetails }: DetailScreenProps) {
  const {
    selectedTip,
    setSelectedTip,
    setCurrentScreen,
    userProfile,
    setFavoriteTips,
  } = useAppContext();

  const [detailedTip, setDetailedTip] = useState<WellnessTip | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [copiedContent, setCopiedContent] = useState<string | null>(null);

  useEffect(() => {
    if (selectedTip && (!selectedTip.longExplanation || !selectedTip.steps)) {
      generateDetails();
    } else if (selectedTip) {
      setDetailedTip(selectedTip);
    }
  }, [selectedTip]);

  const copyToClipboard = async (content: string, type: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedContent(type);
      setTimeout(() => setCopiedContent(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const generateDetails = async () => {
    if (!selectedTip || !userProfile) return;
    setIsDetailLoading(true);
    try {
      const detailed = await onGenerateDetails(selectedTip);
      setDetailedTip(detailed);
    } catch (error) {
      console.error("Failed to generate detailed tip:", error);
      setDetailedTip(selectedTip);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleToggleFavorite = () => {
    if (!detailedTip) return;
    const isFav = isFavorite(detailedTip.id);
    if (isFav) {
      removeFromFavorites(detailedTip.id);
    } else {
      addToFavorites(detailedTip);
    }
    setFavoriteTips(getFavoriteTips());
  };

  const handleBack = () => {
    setSelectedTip(null);
    setDetailedTip(null);
    setCurrentScreen("tips");
  };

  if (!selectedTip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100/30 dark:from-gray-900 dark:via-black dark:to-blue-950/30 relative overflow-hidden transition-colors duration-300">
        <div className="container max-w-4xl mx-auto p-6 flex items-center justify-center min-h-screen">
          <Card className="text-center bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <p className="text-gray-600 dark:text-gray-400">
                No tip selected
              </p>
              <Button
                onClick={() => setCurrentScreen("tips")}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition-all duration-300 hover:scale-105"
              >
                Back to Tips
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100/30 dark:from-gray-900 dark:via-black dark:to-blue-950/30 relative overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-blue-600/10 dark:from-blue-500/20 dark:to-blue-700/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-blue-300/8 to-blue-500/8 dark:from-blue-400/15 dark:to-blue-600/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container max-w-5xl mx-auto p-6 lg:p-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-6 flex items-center gap-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-base px-4 py-2"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Tips
          </Button>
        </div>

        <Card className="shadow-2xl bg-white/90 dark:bg-gray-900/90 border-blue-200 dark:border-blue-800/50 overflow-hidden">
          <CardHeader className="p-0 m-0 border-b border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between p-4 sm:p-6 gap-4 lg:gap-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 flex-1">
                <div className="text-4xl sm:text-5xl lg:text-6xl transform transition-transform duration-300 hover:scale-110 hover:rotate-12 cursor-pointer flex-shrink-0">
                  {selectedTip.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-xl sm:text-2xl lg:text-3xl text-gray-900 dark:text-white font-bold mb-2 leading-tight">
                    {selectedTip.title}
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    {selectedTip.shortDescription}
                  </CardDescription>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:flex-col lg:items-end">
                <Badge
                  className={`text-xs sm:text-sm px-3 sm:px-4 py-2 ${
                    CATEGORY_COLORS[
                      selectedTip.category as keyof typeof CATEGORY_COLORS
                    ] || "bg-gray-100 text-gray-800"
                  } transition-all duration-300 hover:scale-105 cursor-pointer text-center`}
                  variant="secondary"
                >
                  {selectedTip.category
                    .replace("-", " ")
                    .split(" ")
                    .map(
                      (word) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                    )
                    .join(" ")}
                </Badge>
                <Button
                  variant={isFavorite(selectedTip.id) ? "default" : "outline"}
                  size="default"
                  onClick={handleToggleFavorite}
                  className="flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 hover:scale-105 px-4 sm:px-6 py-2 text-sm sm:text-base"
                >
                  <Heart
                    className={`h-4 w-4 ${
                      isFavorite(selectedTip.id) ? "fill-current" : ""
                    }`}
                  />
                  <span className="hidden sm:inline">
                    {isFavorite(selectedTip.id)
                      ? "Favorited"
                      : "Add to Favorites"}
                  </span>
                  <span className="sm:hidden">
                    {isFavorite(selectedTip.id) ? "Favorited" : "Add"}
                  </span>
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8 p-8">
            {isDetailLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-6"></div>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Generating detailed explanation...
                </p>
              </div>
            ) : (
              <>
                {detailedTip?.longExplanation && (
                  <div className="bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-950/20 dark:to-transparent p-6 rounded-xl border border-blue-200/30 dark:border-blue-800/30">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                          <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          Why This Works
                        </h3>
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            cleanMarkdownText(
                              detailedTip.longExplanation || ""
                            ),
                            "explanation"
                          )
                        }
                        className="p-2 rounded-lg bg-white/70 dark:bg-gray-800/70 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110 cursor-pointer border border-blue-200 dark:border-blue-700"
                      >
                        {copiedContent === "explanation" ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                        )}
                      </button>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                      {cleanMarkdownText(detailedTip.longExplanation)}
                    </p>
                  </div>
                )}

                {detailedTip?.steps && detailedTip.steps.length > 0 && (
                  <div className="bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-950/20 dark:to-transparent p-6 rounded-xl border border-blue-200/30 dark:border-blue-800/30">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                          <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          Step-by-Step Guide
                        </h3>
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            detailedTip.steps
                              ?.map(
                                (step, i) =>
                                  `${i + 1}. ${cleanMarkdownText(step)}`
                              )
                              .join("\n") || "",
                            "steps"
                          )
                        }
                        className="p-2 rounded-lg bg-white/70 dark:bg-gray-800/70 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110 cursor-pointer border border-blue-200 dark:border-blue-700"
                      >
                        {copiedContent === "steps" ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                        )}
                      </button>
                    </div>
                    <div className="space-y-4">
                      {detailedTip.steps.map((step, index) => (
                        <div key={index} className="flex gap-4 group">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 group-hover:scale-110">
                            {index + 1}
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed pt-1 flex-1 text-base">
                            {cleanMarkdownText(step)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            <Separator className="bg-blue-200 dark:bg-blue-800" />

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
              <div className="text-sm text-gray-600 dark:text-gray-400 italic">
                ✨ Personalized for your wellness journey
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="cursor-pointer transition-all duration-300 hover:scale-105 border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-900/30 px-6"
                >
                  More Tips
                </Button>
                <Button
                  onClick={handleToggleFavorite}
                  className="cursor-pointer transition-all duration-300 hover:scale-105 bg-blue-600 hover:bg-blue-700 text-white px-6"
                >
                  {isFavorite(selectedTip.id)
                    ? "Remove from Favorites"
                    : "Save to Favorites"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
