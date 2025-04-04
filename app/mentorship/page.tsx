import Link from "next/link"
import { Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import MentorShipHeroSection from "@/components/mentorship-template/Hero"
import LogoSection from "@/components/mentorship-template/LogoSection"
import HowItWorks from "@/components/mentorship-template/how-it-works"
import Visualization from "@/components/mentorship-template/Visualization"
import CTASection from "@/components/mentorship-template/CTASection"
import MentorshipTemplate from "@/components/mentorship-template/MentorshipTemplate"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      {/* Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/90 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/60">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-8 flex h-16 items-center justify-between">
          <div className="flex gap-4 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative w-7 h-7 md:w-8 md:h-8 overflow-hidden rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
                <Zap className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
              </div>
              <span className="inline-block font-bold text-lg md:text-xl tracking-tight">MentorAI</span>
            </Link>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <nav className="hidden sm:flex items-center space-x-1 md:space-x-2">
              <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800">
                Features
              </Button>
              <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800">
                Pricing
              </Button>
              <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800">
                Documentation
              </Button>
            </nav>
            <Button className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white border-0 text-sm px-3 py-1.5 md:px-4 md:py-2">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center w-full mx-auto">
        {/* Hero Section */}
        <MentorShipHeroSection/>
        <MentorshipTemplate/>
        
        <LogoSection/>
        
        {/* How It Works Section */}
        <HowItWorks/>
        
        {/* Visualization Section */}
        <Visualization/>
        
        {/* CTA Section */}
        <CTASection/>
      </div>

      {/* Footer */}
      <footer className="w-full py-12 bg-zinc-950 border-t border-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="flex items-center space-x-2">
              <div className="relative w-8 h-8 overflow-hidden rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">MentorAI</span>
            </div>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-zinc-500">
              <Link href="#" className="hover:text-zinc-300 transition-colors">
                Features
              </Link>
              <Link href="#" className="hover:text-zinc-300 transition-colors">
                Pricing
              </Link>
              <Link href="#" className="hover:text-zinc-300 transition-colors">
                Documentation
              </Link>
              <Link href="#" className="hover:text-zinc-300 transition-colors">
                Blog
              </Link>
              <Link href="#" className="hover:text-zinc-300 transition-colors">
                About
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="#" className="text-zinc-500 hover:text-zinc-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-zinc-500 hover:text-zinc-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect width="4" height="12" x="2" y="9"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="#" className="text-zinc-500 hover:text-zinc-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M12 2H2v10h10V2zM22 2h-10v10h10V2zM12 12H2v10h10V12zM22 12h-10v10h10V12z"></path>
                </svg>
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
            <p className="text-sm text-zinc-500">© 2025 MentorAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}