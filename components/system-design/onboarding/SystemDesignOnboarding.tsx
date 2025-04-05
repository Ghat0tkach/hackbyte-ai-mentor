"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, ChevronRight, Building2, Briefcase, GraduationCap, Code2 } from "lucide-react"
import { useSystemDesignStore, ExperienceLevel, TargetCompany } from "@/store/system-design-store"

const experienceLevels = [
  {
    id: "junior" as ExperienceLevel,
    title: "Junior Engineer",
    description: "0-2 years of experience, looking to learn system design fundamentals",
    icon: <GraduationCap className="h-6 w-6 text-blue-500" />,
  },
  {
    id: "mid" as ExperienceLevel,
    title: "Mid-Level Engineer",
    description: "2-5 years of experience, preparing for technical interviews",
    icon: <Code2 className="h-6 w-6 text-indigo-500" />,
  },
  {
    id: "senior" as ExperienceLevel,
    title: "Senior Engineer",
    description: "5+ years of experience, refining advanced system design skills",
    icon: <Briefcase className="h-6 w-6 text-purple-500" />,
  },
  {
    id: "architect" as ExperienceLevel,
    title: "System Architect",
    description: "Looking to master complex distributed systems design",
    icon: <Building2 className="h-6 w-6 text-pink-500" />,
  },
]

const targetCompanies = [
  { id: "faang" as TargetCompany, name: "FAANG (Meta, Apple, Amazon, Netflix, Google)" },
  { id: "unicorns" as TargetCompany, name: "Unicorn Startups" },
  { id: "fintech" as TargetCompany, name: "FinTech Companies" },
  { id: "enterprise" as TargetCompany, name: "Enterprise Software" },
  { id: "gaming" as TargetCompany, name: "Gaming Companies" },
  { id: "ecommerce" as TargetCompany, name: "E-commerce" },
  { id: "healthcare" as TargetCompany, name: "Healthcare Tech" },
  { id: "other" as TargetCompany, name: "Other" },
]

export default function SystemDesignOnboarding() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  
  // Use the store
  const { 
    experienceLevel, 
    targetCompanies: selectedCompanies, 
    setExperienceLevel, 
    setTargetCompanies 
  } = useSystemDesignStore()

  const handleExperienceSelect = (id: ExperienceLevel) => {
    setExperienceLevel(id)
  }

  // This function is causing the infinite loop
  const handleCompanySelect = (id: TargetCompany) => {
    // Create a new array instead of directly modifying the state
    const updatedCompanies = selectedCompanies.includes(id)
      ? selectedCompanies.filter(companyId => companyId !== id)
      : [...selectedCompanies, id]
    
    // Set the new array directly
    setTargetCompanies(updatedCompanies)
  }

  const handleNext = () => {
    if (step === 1 && experienceLevel) {
      setStep(2)
    } else if (step === 2 && selectedCompanies.length > 0) {
      // Navigate to system design session
      router.push("/system-design/session")
    }
  }

  const handleSkip = () => {
    router.push("/system-design/session")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white flex flex-col">
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            SystemDesign.io
          </h1>
          <Button variant="ghost" onClick={handleSkip}>
            Skip
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 max-w-5xl">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">Personalize Your Experience</h2>
            <p className="text-gray-400">
              Help us tailor system design challenges to your experience level and target companies
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className={`flex items-center justify-center h-6 w-6 rounded-full ${step === 1 ? "bg-purple-600 text-white" : "bg-gray-800"}`}>
              1
            </div>
            <div className="h-px w-4 bg-gray-700"></div>
            <div className={`flex items-center justify-center h-6 w-6 rounded-full ${step === 2 ? "bg-purple-600 text-white" : "bg-gray-800"}`}>
              2
            </div>
          </div>
        </div>

        <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
          <CardContent className="p-6">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-xl font-semibold mb-6 text-gray-700">What's your experience level?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {experienceLevels.map((level) => (
                    <div
                      key={level.id}
                      className={`p-4 text-gray-400 rounded-lg border cursor-pointer transition-all ${
                        experienceLevel === level.id
                          ? "border-purple-500 bg-purple-900/20"
                          : "border-gray-700 hover:border-gray-600 bg-gray-800/50"
                      }`}
                      onClick={() => handleExperienceSelect(level.id)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-1">{level.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{level.title}</h4>
                          <p className="text-sm text-gray-400">{level.description}</p>
                        </div>
                        {experienceLevel === level.id && (
                          <CheckCircle2 className="h-5 w-5 text-purple-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-xl font-semibold mb-6 text-gray-600">Which companies are you targeting?</h3>
                <p className="text-gray-400 mb-6">Select all that apply</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {targetCompanies.map((company) => (
                    <div
                      key={company.id}
                      className={`text-gray-400 p-3 rounded-lg border cursor-pointer transition-all flex items-center ${
                        selectedCompanies.includes(company.id)
                          ? "border-purple-500 bg-purple-900/20"
                          : "border-gray-700 hover:border-gray-600 bg-gray-800/50"
                      }`}
                      onClick={() => handleCompanySelect(company.id)}
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{company.name}</h4>
                      </div>
                      {selectedCompanies.includes(company.id) && (
                        <CheckCircle2 className="h-5 w-5 text-purple-500 ml-2" />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </CardContent>
          <CardFooter className="border-t border-gray-800 p-6">
            <Button
              className="ml-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              size="lg"
              disabled={(step === 1 && !experienceLevel) || (step === 2 && selectedCompanies.length === 0)}
              onClick={handleNext}
            >
              {step === 2 ? "Start System Design" : "Continue"}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}