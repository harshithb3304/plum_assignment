"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, Trash2, Download } from "lucide-react";
import { useAppContext } from "@/components/AppContext";
import { CATEGORY_COLORS } from "@/lib/types";
import { removeFromFavorites, getFavoriteTips } from "@/lib/storage";
import { exportFavoritesToPDF } from "@/lib/pdfExport";
import Link from "next/link";

export function FavoritesScreen() {
  const {
    favoriteTips,
    setFavoriteTips,
    setSelectedTip,
    setCurrentScreen,
    userProfile,
  } = useAppContext();

  const handleTipClick = (tip: any) => {
    setSelectedTip(tip);
    setCurrentScreen("detail");
  };

  const handleRemoveFromFavorites = (e: React.MouseEvent, tipId: string) => {
    e.stopPropagation();
    removeFromFavorites(tipId);
    setFavoriteTips(getFavoriteTips());
  };

  const handleExportPDF = async () => {
    if (favoriteTips.length > 0) {
      await exportFavoritesToPDF(favoriteTips, userProfile);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-white dark:bg-black overflow-hidden transition-colors duration-300 flex flex-col">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-black" />

      {/* Glow accents */}
      <div
        className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2
                     w-[90vw] h-[45vw] sm:w-[80vw] sm:h-[40vw] lg:w-[70vw] lg:h-[35vw] xl:w-[1400px] xl:h-[700px]
                     bg-blue-400/20 dark:bg-blue-500/30 rounded-t-full blur-[100px] sm:blur-[140px] lg:blur-[180px]"
      />

      <div
        className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2
                     w-[60vw] h-[30vw] sm:w-[50vw] sm:h-[25vw] lg:w-[40vw] lg:h-[20vw] xl:w-[800px] xl:h-[400px]
                     bg-blue-300/10 dark:bg-blue-400/20 rounded-t-full blur-[60px] sm:blur-[100px] lg:blur-[120px]"
      />

      <div className="relative z-10 container max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <Link href="/wellness">
            <Button
              variant="ghost"
              className="mb-4 flex items-center gap-2 text-gray-600 dark:text-white/80 hover:text-blue-600 dark:hover:text-blue-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tips
            </Button>
          </Link>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-500 fill-current" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Your Favorite Tips
              </h1>
            </div>

            {favoriteTips.length > 0 && (
              <Button
                onClick={handleExportPDF}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Download className="h-4 w-4" />
                Export PDF
              </Button>
            )}
          </div>

          <p className="text-gray-600 dark:text-white/80">
            Keep track of the wellness tips that resonate with you most
          </p>
        </div>

        {favoriteTips.length === 0 ? (
          <Card className="text-center bg-white/80 dark:bg-white/5 backdrop-blur-sm border-blue-200 dark:border-blue-800/50">
            <CardContent className="pt-6 pb-8">
              <Heart className="h-12 w-12 text-blue-400 dark:text-blue-300 mx-auto mb-4" />
              <CardTitle className="mb-2 text-gray-900 dark:text-white">
                No Favorites Yet
              </CardTitle>
              <CardDescription className="mb-4 text-gray-600 dark:text-white/70">
                Start adding tips to your favorites to see them here
              </CardDescription>
              <Link href="/wellness">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Browse Tips
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600 dark:text-white/70">
              {favoriteTips.length} tip{favoriteTips.length !== 1 ? "s" : ""}{" "}
              saved
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteTips.map((tip) => (
                <Card
                  key={tip.id}
                  className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] bg-white/80 dark:bg-white/5 backdrop-blur-sm border-blue-200 dark:border-blue-800/50 hover:border-blue-300 dark:hover:border-blue-700"
                  onClick={() => handleTipClick(tip)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="text-3xl mb-2">{tip.icon}</div>
                      <div className="flex gap-1 items-center justify-center">
                        <Heart className="h-4 w-4 fill-current text-red-500" />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-1 hover:bg-red-50 dark:hover:bg-red-900/20"
                          onClick={(e) => handleRemoveFromFavorites(e, tip.id)}
                        >
                          <Trash2 className="h-3 w-3 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-lg line-clamp-2 text-gray-900 dark:text-white">
                      {tip.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-3 line-clamp-3 text-gray-600 dark:text-white/70">
                      {tip.shortDescription}
                    </CardDescription>
                    <Badge
                      className={`text-xs ${
                        CATEGORY_COLORS[
                          tip.category as keyof typeof CATEGORY_COLORS
                        ] ||
                        "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                      }`}
                      variant="secondary"
                    >
                      {tip.category
                        .replace("-", " ")
                        .split(" ")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase()
                        )
                        .join(" ")}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
