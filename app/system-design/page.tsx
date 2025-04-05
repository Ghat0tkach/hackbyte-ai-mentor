"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ChevronRight, Code, Network, Server } from "lucide-react"
import type * as THREE from "three"
import Link from "next/link"



function BackgroundScene() {
 return (
    <div className="dark">
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Background visual effects */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20 animate-gradient-slow"></div>
          
          {/* Glowing orbs - enhanced size and opacity */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full blur-xl"
              style={{
                background: i % 2 === 0 
                  ? "radial-gradient(circle, rgba(168,85,247,0.6) 0%, rgba(168,85,247,0) 70%)" 
                  : "radial-gradient(circle, rgba(59,130,246,0.5) 0%, rgba(59,130,246,0) 70%)",
                height: `${150 + Math.random() * 250}px`,
                width: `${150 + Math.random() * 250}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 60 - 30, 0],
                y: [0, Math.random() * 60 - 30, 0],
                opacity: [0.5, 0.8, 0.5],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 8 + Math.random() * 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-15"></div>
          
          {/* Animated lines - enhanced visibility */}
          <div className="absolute inset-0">
            {[...Array(7)].map((_, i) => (
              <motion.div
                key={`line-${i}`}
                className="absolute h-[2px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent w-full"
                style={{ top: `${15 + i * 12}%` }}
                animate={{
                  scaleX: [0, 1, 0],
                  opacity: [0, 0.7, 0],
                  left: ["-100%", "0%", "100%"],
                }}
                transition={{
                  duration: 15 + i * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 2,
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-purple-500/20 to-white/30 blur-2xl opacity-20 animate-gradient-shift" />
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-300 to-blue-200 animate-gradient">
              Transform System Design Anxiety<br />
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Into Architect Confidence
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl mx-auto relative"
          >
            <p className="text-xl sm:text-2xl bg-gradient-to-r from-gray-300 to-gray-400 bg-clip-text text-transparent font-medium">
              Master system design interviews through{" "}
              <span className="underline decoration-purple-500/50 decoration-wavy underline-offset-4">
                AI-guided simulations
              </span>{" "}
              of real technical challenges used at top tech companies.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center relative"
          >
            <Button
              size="lg"
              className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg rounded-lg transition-all duration-300 hover:scale-[1.03] shadow-xl hover:shadow-purple-500/20"
            >
              <Link href="/system-design/session">
              <span className="relative z-10">
                Start Free Trial 
                <ChevronRight className="ml-2 h-5 w-5 inline-block transition-transform group-hover:translate-x-1" />
              </span>
              </Link>
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="border-gray-600/50 text-gray-300 hover:text-white px-8 py-6 text-lg rounded-lg backdrop-blur-xl bg-black/30 hover:bg-purple-900/20 transition-all duration-300 hover:border-purple-500/30 hover:scale-[1.03] relative"
            >
              <span className="relative z-10 flex items-center">
                <span className="mr-2">🎥</span>
                Watch Demo
              </span>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
            </Button>
          </motion.div>

          {/* Floating particles - enhanced size, quantity and visibility */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(35)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute rounded-full ${i % 5 === 0 ? 'h-3 w-3' : i % 3 === 0 ? 'h-2 w-2' : 'h-1 w-1'}`}
                style={{
                  background: i % 3 === 0 
                    ? "radial-gradient(circle, rgba(168,85,247,0.9) 0%, rgba(168,85,247,0.3) 70%)" 
                    : i % 2 === 0 
                      ? "radial-gradient(circle, rgba(59,130,246,0.9) 0%, rgba(59,130,246,0.3) 70%)"
                      : "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 70%)",
                  boxShadow: i % 4 === 0 ? '0 0 8px 2px rgba(168,85,247,0.6)' : '0 0 5px 1px rgba(59,130,246,0.5)',
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                initial={{ opacity: 0, y: 0 }}
                animate={{
                  opacity: [0, 0.9, 0],
                  y: [0, -150, -300],
                  x: [0, Math.random() * 80 - 40, Math.random() * 150 - 75],
                }}
                transition={{
                  duration: 5 + Math.random() * 8,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute bottom-10 left-0 right-0 flex justify-center"
        >
          <div className="animate-bounce">
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
              className="text-gray-400"
            >
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </div>
        </motion.div>
      </section>

      {/* Rest of the sections remain the same */}
      {/* Value Proposition Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        {/* Add subtle background effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 to-blue-900/5 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
              AI-Powered Scenario Engine
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Practice with the same challenges used in technical interviews at FAANG/MATAD companies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature cards remain the same */}
          </div>
        </div>
      </section>

      {/* Outcomes Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/40 backdrop-blur-sm">
        {/* Add subtle animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900 via-transparent to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto">
          {/* Content remains the same */}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        {/* Add subtle animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute inset-0 opacity-20 bg-gradient-to-r from-purple-900/30 to-blue-900/30"
            animate={{ 
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'linear',
            }}
          />
        </div>
        
        <div className="max-w-4xl mx-auto text-center">
          {/* Content remains the same */}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-500">© 2025 System Design AI. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-gray-300">
              Terms
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-300">
              Privacy
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-300">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  </div>
  )
}

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (

      <div className="dark">
        <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white overflow-hidden">
          {/* Hero Section */}
          <section className="relative h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="absolute inset-0 z-0">
              <BackgroundScene />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-purple-500/20 to-white/30 blur-2xl opacity-20 animate-gradient-shift" />
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-300 to-blue-200 animate-gradient">
                  Transform System Design Anxiety<br />
                  <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Into Architect Confidence
                  </span>
                </h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="max-w-3xl mx-auto relative"
              >
                <p className="text-xl sm:text-2xl bg-gradient-to-r from-gray-300 to-gray-400 bg-clip-text text-transparent font-medium">
                  Master system design interviews through{" "}
                  <span className="underline decoration-purple-500/50 decoration-wavy underline-offset-4">
                    AI-guided simulations
                  </span>{" "}
                  of real technical challenges used at top tech companies.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center relative"
              >
                <Button
                  size="lg"
                  className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg rounded-lg transition-all duration-300 hover:scale-[1.03] shadow-xl hover:shadow-purple-500/20"
                >
                  <Link href="/system-design/onboarding">
                  <span className="relative z-10">
                    Start Free Trial 
                    <ChevronRight className="ml-2 h-5 w-5 inline-block transition-transform group-hover:translate-x-1" />
                  </span>
                  </Link>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  className="border-gray-600/50 text-gray-300 hover:text-white px-8 py-6 text-lg rounded-lg backdrop-blur-xl bg-black/30 hover:bg-purple-900/20 transition-all duration-300 hover:border-purple-500/30 hover:scale-[1.03] relative"
                >
                  <span className="relative z-10 flex items-center">
                    <span className="mr-2">🎥</span>
                    Watch Demo
                  </span>
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                </Button>
              </motion.div>

              {/* Floating particles */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute h-1 w-1 bg-purple-400/30 rounded-full"
                    initial={{ opacity: 0, y: 0 }}
                    animate={{
                      opacity: [0, 0.3, 0],
                      y: [0, -40, 0],
                      x: Math.random() * 100 - 50
                    }}
                    transition={{
                      duration: 4 + Math.random() * 4,
                      repeat: Infinity,
                      delay: Math.random() * 2
                    }}
                  />
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="absolute bottom-10 left-0 right-0 flex justify-center"
            >
              <div className="animate-bounce">
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
                  className="text-gray-400"
                >
                  <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
              </div>
            </motion.div>
          </section>

          {/* Value Proposition Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
                  AI-Powered Scenario Engine
                </h2>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                  Practice with the same challenges used in technical interviews at FAANG/MATAD companies
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: <Server className="h-10 w-10 text-purple-500" />,
                    title: "Recreate Actual System Challenges",
                    description:
                      "Our AI generates realistic system design scenarios based on actual interview questions from top tech companies.",
                  },
                  {
                    icon: <Code className="h-10 w-10 text-blue-500" />,
                    title: "Line-by-Code Architectural Feedback",
                    description:
                      "Receive detailed feedback on your design decisions, with specific suggestions for improvement.",
                  },
                  {
                    icon: <Network className="h-10 w-10 text-indigo-500" />,
                    title: "Practice with Evolving Requirements",
                    description:
                      "Just like real interviews, requirements change. Learn to adapt your designs on the fly.",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-800 hover:border-purple-900/50 transition-all duration-300"
                  >
                    <div className="bg-gray-800/50 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-white">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Outcomes Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/40 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">
                  Join 25,000+ Engineers Who Improved Their Skills
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    metric: "4.8×",
                    title: "System Complexity Comprehension",
                    description: "Engineers report significantly better understanding of complex distributed systems.",
                  },
                  {
                    metric: "63%",
                    title: "Interview Success Rate",
                    description: "Increase in successful system design interviews after using our platform.",
                  },
                  {
                    metric: "2.1×",
                    title: "Technical Communication Speed",
                    description: "Faster and clearer communication of technical concepts during interviews.",
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-b from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-800"
                  >
                    <div className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
                      {stat.metric}
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-white">{stat.title}</h3>
                    <p className="text-gray-400">{stat.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-md p-10 rounded-2xl border border-gray-800"
              >
                <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">
                  Ready to Ace Your Next System Design Interview?
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                  Start practicing with our AI-powered platform today and build the confidence you need.
                </p>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg rounded-md"
                >
                  Get Started Now <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-10 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-gray-500">© 2025 System Design AI. All rights reserved.</p>
              </div>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-500 hover:text-gray-300">
                  Terms
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-300">
                  Privacy
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-300">
                  Contact
                </a>
              </div>
            </div>
          </footer>
        </main>
      </div>
   
  )
}

