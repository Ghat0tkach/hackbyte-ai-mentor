"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Code, Cpu, Layers, Sparkles, Trophy } from "lucide-react";
import Image from "next/image";

export default function InterviewConfig() {
  const router = useRouter();
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // List of companies
  const companies = [
    { id: "facebook", name: "Facebook" },
    { id: "amazon", name: "Amazon" },
    { id: "apple", name: "Apple" },
    { id: "netflix", name: "Netflix" },
    { id: "google", name: "Google" },
    { id: "microsoft", name: "Microsoft" },
    { id: "uber", name: "Uber" },
    { id: "airbnb", name: "Airbnb" },
  ];

  // List of difficulty levels
  const difficultyLevels = [
    { id: "easy", name: "Easy", icon: <Sparkles className="h-4 w-4 text-green-500" /> },
    { id: "medium", name: "Medium", icon: <Sparkles className="h-4 w-4 text-yellow-500" /> },
    { id: "hard", name: "Hard", icon: <Sparkles className="h-4 w-4 text-red-500" /> },
  ];

  // Load saved preferences from localStorage on component mount
  useEffect(() => {
    const savedCompany = localStorage.getItem("selectedCompany");
    const savedDifficulty = localStorage.getItem("selectedDifficulty");

    if (savedCompany) setSelectedCompany(savedCompany);
    if (savedDifficulty) setSelectedDifficulty(savedDifficulty);
  }, []);

  const handleStartInterview = () => {
    if (!selectedCompany || !selectedDifficulty) {
      alert("Please select both a company and difficulty level");
      return;
    }

    setIsLoading(true);

    // Save selections to localStorage
    localStorage.setItem("selectedCompany", selectedCompany);
    localStorage.setItem("selectedDifficulty", selectedDifficulty);

    // Navigate to the main interview page
    router.push("/dsa-interview/session");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Code className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              DSA Interview Practice
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Prepare for technical interviews with our AI-powered mock interview system. 
            Practice data structures and algorithms questions tailored to your target company.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border border-blue-100 dark:border-blue-900/40 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-blue-500" />
                <span>Realistic Practice</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Experience interview conditions with real-time feedback and guidance from our AI mentor.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border border-purple-100 dark:border-purple-900/40 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-purple-500" />
                <span>Company Specific</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Questions tailored to match the style and difficulty of top tech companies.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border border-indigo-100 dark:border-indigo-900/40 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-indigo-500" />
                <span>Skill Building</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Improve your problem-solving skills with progressive difficulty levels and detailed explanations.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border border-blue-100 dark:border-blue-900/40 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Configure Your Interview</CardTitle>
            <CardDescription>
              Select a company and difficulty level to start practicing DSA questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="company" className="text-sm font-medium flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  Target Company
                </label>
                <Select
                  value={selectedCompany}
                  onValueChange={setSelectedCompany}
                >
                  <SelectTrigger id="company" className="border-blue-200 dark:border-blue-900/40">
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="difficulty" className="text-sm font-medium flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                  Difficulty Level
                </label>
                <Select
                  value={selectedDifficulty}
                  onValueChange={setSelectedDifficulty}
                >
                  <SelectTrigger id="difficulty" className="border-blue-200 dark:border-blue-900/40">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficultyLevels.map((level) => (
                      <SelectItem key={level.id} value={level.id} className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          {level.icon}
                          {level.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleStartInterview}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Preparing your interview...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Start Interview</span>
                  <Code className="h-4 w-4" />
                </div>
              )}
            </Button>
          </CardContent>
        </Card>
        
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Powered by AI Mentor - Your personal interview coach</p>
        </div>
      </div>
    </div>
  );
}