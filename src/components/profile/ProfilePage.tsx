"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserProfile, WELLNESS_GOALS, GENDER_OPTIONS } from "@/lib/types";
import { saveUserProfile, saveAllTips, getUserProfile } from "@/lib/storage";
import { generateTipsAction } from "@/lib/actions";
import { ArrowLeft, ArrowRight, Sparkles, Plus, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function ProfilePage() {
  const router = useRouter();
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [customGoals, setCustomGoals] = useState<string[]>([]);
  const [customGoalInput, setCustomGoalInput] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Load existing profile data when component mounts (for editing)
  useEffect(() => {
    const existingProfile = getUserProfile();
    if (existingProfile) {
      setAge(existingProfile.age.toString());
      setGender(existingProfile.gender);
      setSelectedGoals(
        existingProfile.goals.filter((goal) =>
          WELLNESS_GOALS.includes(goal as any)
        )
      );
      setCustomGoals(
        existingProfile.goals.filter(
          (goal) => !WELLNESS_GOALS.includes(goal as any)
        )
      );

      // Show custom input if there are custom goals or if "Others" was selected
      if (
        existingProfile.goals.some(
          (goal) => !WELLNESS_GOALS.includes(goal as any)
        ) ||
        existingProfile.goals.includes("Others")
      ) {
        setShowCustomInput(true);
        setSelectedGoals((prev) =>
          prev.includes("Others") ? prev : [...prev, "Others"]
        );
      }
    }
  }, []);

  const handleGoalToggle = (goal: string) => {
    if (goal === "Others") {
      setShowCustomInput(!showCustomInput);
      if (showCustomInput) {
        setSelectedGoals((prev) => prev.filter((g) => g !== "Others"));
      } else {
        setSelectedGoals((prev) =>
          prev.includes("Others") ? prev : [...prev, "Others"]
        );
      }
    } else {
      setSelectedGoals((prev) =>
        prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
      );
    }
  };

  const addCustomGoal = () => {
    if (
      customGoalInput.trim() &&
      !customGoals.includes(customGoalInput.trim())
    ) {
      setCustomGoals((prev) => [...prev, customGoalInput.trim()]);
      setCustomGoalInput("");
    }
  };

  const removeCustomGoal = (goalToRemove: string) => {
    setCustomGoals((prev) => prev.filter((goal) => goal !== goalToRemove));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!age || parseInt(age) < 13 || parseInt(age) > 120) {
      newErrors.age = "Please enter a valid age between 13 and 120";
    }

    if (!gender) {
      newErrors.gender = "Please select your gender";
    }

    if (selectedGoals.length === 0 && customGoals.length === 0) {
      newErrors.goals = "Please select at least one wellness goal";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const allGoals = [
      ...selectedGoals.filter((g) => g !== "Others"),
      ...customGoals,
    ];

    const profile: UserProfile = {
      age: parseInt(age),
      gender: gender as UserProfile["gender"],
      goals: allGoals,
      customGoals,
    };

    // Save profile locally first so the wellness page can read it
    saveUserProfile(profile);

    // Call server action to generate tips (same logic as regenerate)
    try {
      setIsSubmitting(true);

      let progress = 0;
      const progressInterval = setInterval(() => {
        progress = Math.min(95, progress + Math.random() * 12);
      }, 200);

      const result = await generateTipsAction(profile as UserProfile);
      clearInterval(progressInterval);

      if (!result.success) {
        console.error("Failed to generate tips:", result.error);
        setIsSubmitting(false);
        return;
      }

      // Save generated tips to localStorage so WellnessApp picks them up
      saveAllTips(result.data);

      // Navigate to wellness page
      router.push("/wellness");
    } catch (err) {
      console.error("Error generating tips:", err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-background dark:bg-black transition-colors duration-300 flex flex-col">
      <div className="absolute inset-0 bg-background dark:bg-black" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-blue-500/5 dark:bg-blue-500/10 opacity-50 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col flex-1">
        <header className="px-4 sm:px-6 py-4 sm:py-6">
          <div className="container mx-auto flex justify-between items-center">
            <Link
              href="/"
              className="flex items-center space-x-2 cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              <div className="p-2 rounded-xl bg-blue-100 dark:bg-white/10 backdrop-blur-sm">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-white" />
              </div>
              <span className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
                Wellness AI
              </span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-4">
              <ThemeToggle />
              <Link href="/" className="cursor-pointer">
                <Button
                  variant="ghost"
                  size="sm"
                  className="cursor-pointer hover:scale-105 transition-transform duration-300 hover:bg-accent dark:hover:bg-accent/50"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-2xl flex-1">
          <Card className="shadow-2xl border-0 bg-white/50 dark:bg-white/5 backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Create Your Wellness Profile
              </CardTitle>
              <CardDescription className="text-base sm:text-lg text-gray-700 dark:text-gray-400 mt-2">
                Tell us about yourself to get personalized AI-powered wellness
                recommendations
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8">
              {isSubmitting ? (
                <div className="space-y-6 text-center">
                  <div className="mx-auto mb-2 p-3 rounded-2xl bg-blue-100 dark:bg-white/10 w-fit animate-pulse">
                    <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Creating Your Personalized Tips ✨
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-400">
                    AI is analyzing your profile and generating custom
                    recommendations...
                  </p>
                  <Progress
                    value={50}
                    className="w-full h-2 bg-muted/30 dark:bg-white/10"
                  />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="age"
                      className="text-sm font-medium text-foreground dark:text-white"
                    >
                      Age *
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Enter your age"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className={`w-full cursor-pointer transition-all duration-200 focus:scale-[1.02] bg-background/50 dark:bg-white/5 border-muted dark:border-white/20 ${
                        errors.age ? "border-red-500" : ""
                      }`}
                      min="13"
                      max="120"
                    />
                    {errors.age && (
                      <p className="text-red-500 text-sm">{errors.age}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-foreground dark:text-white">
                      Gender *
                    </Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger
                        className={`w-full cursor-pointer transition-all duration-200 hover:scale-[1.02] bg-background/50 dark:bg-white/5 border-muted dark:border-white/20 ${
                          errors.gender ? "border-red-500" : ""
                        }`}
                      >
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                      <SelectContent className="bg-background dark:bg-black border-muted dark:border-white/20">
                        {GENDER_OPTIONS.map((option) => (
                          <SelectItem
                            key={option}
                            value={option}
                            className="cursor-pointer hover:bg-muted dark:hover:bg-white/10 text-foreground dark:text-white"
                          >
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.gender && (
                      <p className="text-red-500 text-sm">{errors.gender}</p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-foreground dark:text-white">
                      Wellness Goals * (Select all that apply)
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {WELLNESS_GOALS.map((goal) => (
                        <Button
                          key={goal}
                          type="button"
                          variant={
                            selectedGoals.includes(goal) ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => handleGoalToggle(goal)}
                          className={`cursor-pointer transition-all duration-200 hover:scale-105 text-xs sm:text-sm px-3 py-2 h-auto min-h-[2.5rem] ${
                            selectedGoals.includes(goal)
                              ? "bg-blue-600 hover:bg-blue-600 text-white dark:bg-blue-600 dark:text-white"
                              : "bg-white/50 dark:bg-white/5 border-muted dark:border-white/20 text-gray-800 dark:text-white hover:bg-blue-50 dark:hover:bg-white/10"
                          }`}
                        >
                          {goal}
                        </Button>
                      ))}
                    </div>

                    {showCustomInput && (
                      <div className="space-y-3 p-4 bg-muted/30 dark:bg-white/5 rounded-lg border border-muted dark:border-white/10">
                        <Label className="text-sm font-medium text-foreground dark:text-white">
                          Add Your Custom Goals
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Enter a custom wellness goal..."
                            value={customGoalInput}
                            onChange={(e) => setCustomGoalInput(e.target.value)}
                            className="flex-1 cursor-pointer bg-background/50 dark:bg-white/5 border-muted dark:border-white/20"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addCustomGoal();
                              }
                            }}
                          />
                          <Button
                            type="button"
                            onClick={addCustomGoal}
                            size="sm"
                            className="cursor-pointer hover:scale-105 transition-transform duration-200 bg-blue-600 hover:bg-blue-400"
                            disabled={!customGoalInput.trim()}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {customGoals.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {customGoals.map((goal, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="flex items-center gap-1 bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-600/30 cursor-pointer hover:scale-105 transition-transform duration-200"
                              >
                                {goal}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeCustomGoal(goal)}
                                  className="h-4 w-4 p-0 hover:bg-transparent cursor-pointer"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {errors.goals && (
                      <p className="text-red-500 text-sm">{errors.goals}</p>
                    )}
                  </div>

                  <div className="pt-6">
                    <Button
                      onClick={handleSubmit}
                      className="w-full cursor-pointer hover:scale-[1.02] transition-all duration-300 bg-blue-600 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-primary-foreground dark:text-white py-3 text-base font-medium"
                      size="lg"
                    >
                      Create My Wellness Board
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
