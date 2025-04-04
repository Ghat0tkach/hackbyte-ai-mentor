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
  ];

  // List of difficulty levels
  const difficultyLevels = [
    { id: "easy", name: "Easy" },
    { id: "medium", name: "Medium" },
    { id: "hard", name: "Hard" },
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
    router.push("/interview-config");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">DSA Interview Practice</h1>
        </div>

        <div className="bg-card border rounded-lg shadow-lg p-6 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Configure Your Interview</h2>
            <p className="text-muted-foreground">
              Select a company and difficulty level to start practicing DSA
              questions
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="company" className="text-sm font-medium">
                Company
              </label>
              <Select
                value={selectedCompany}
                onValueChange={setSelectedCompany}
              >
                <SelectTrigger id="company">
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
              <label htmlFor="difficulty" className="text-sm font-medium">
                Difficulty Level
              </label>
              <Select
                value={selectedDifficulty}
                onValueChange={setSelectedDifficulty}
              >
                <SelectTrigger id="difficulty">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficultyLevels.map((level) => (
                    <SelectItem key={level.id} value={level.id}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleStartInterview}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Start Interview"}
          </Button>
        </div>
      </div>
    </div>
  );
}