"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Brain, Code, Database, MessageSquare, Server, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { AuthStatus } from "@/components/auth-status"


// Typewriter text animation component
const TypewriterText = ({ text, delay = 0, speed = 50 }: { 
  text: string;
  delay?: number;
  speed?: number;
}) => {
  const [displayedText, setDisplayedText] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTyping, setStartTyping] = useState(false);
  
  useEffect(() => {
    const delayTimer = setTimeout(() => {
      setStartTyping(true);
    }, delay * 1000);
    
    return () => clearTimeout(delayTimer);
  }, [delay]);
  
  useEffect(() => {
    if (!startTyping) return;
    
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      
      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed, startTyping]);
  
  return (
    <div>
      {displayedText}
      {currentIndex < text.length && startTyping && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block w-1 h-4 ml-0.5 bg-primary"
        />
      )}
    </div>
  );
};

// Custom animated cursor component
// Fix the cursor gradient opacity values - they're currently set too high at 500
const AnimatedCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [clicked, setClicked] = useState(false)

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    const handleClick = () => {
      setClicked(true)
      setTimeout(() => setClicked(false), 500)
    }
    
    window.addEventListener("mousemove", updatePosition)
    window.addEventListener("click", handleClick)
    
    return () => {
      window.removeEventListener("mousemove", updatePosition)
      window.removeEventListener("click", handleClick)
    }
  }, [])
  
  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-50 mix-blend-difference"
      animate={{
        x: position.x - 16,
        y: position.y - 16,
        scale: clicked ? 1.5 : 1,
      }}
      transition={{ 
        type: "spring", 
        stiffness: 500, 
        damping: 28,
        scale: { duration: 0.15 }
      }}
    >
      <div className="relative w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/50 to-pink-500/50 rounded-full blur-[2px] opacity-70" />
        <div className="absolute inset-[2px] bg-gradient-to-r from-purple-500/50 to-pink-500/50 rounded-full" />
        {clicked && (
          <motion.div
            className="absolute inset-0 bg-white rounded-full"
            initial={{ opacity: 0.8, scale: 0.2 }}
            animate={{ opacity: 0, scale: 2 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </div>
    </motion.div>
  )
}

// Replace the existing GridBackground with this enhanced version
const GridBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/10 bg-[size:50px_50px] [mask-image:radial-gradient(black,transparent_70%)] dark:bg-grid-white/5"></div>
      
      {/* Animated gradient overlay - more responsive */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5"
        animate={{ 
          background: [
            "linear-gradient(to bottom right, rgba(168, 85, 247, 0.05), transparent, rgba(236, 72, 153, 0.05))",
            "linear-gradient(to bottom left, rgba(168, 85, 247, 0.05), transparent, rgba(236, 72, 153, 0.05))",
            "linear-gradient(to top right, rgba(168, 85, 247, 0.05), transparent, rgba(236, 72, 153, 0.05))",
            "linear-gradient(to bottom right, rgba(168, 85, 247, 0.05), transparent, rgba(236, 72, 153, 0.05))"
          ]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Radial pulse effect - more responsive */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-full max-w-[800px] aspect-square rounded-full bg-gradient-to-r from-purple-500/5 to-pink-500/5"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background"></div>
    </div>
  )
}

// Update the FloatingElements component to better handle large screens
const FloatingElements = () => {
  // Generate random positions for the elements
  const elements = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 1,
    x: Math.random() * 90 + 5, // Keep elements 5% away from edges
    y: Math.random() * 90 + 5, // Keep elements 5% away from edges
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.5 + 0.1
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {elements.map((el) => (
        <motion.div
          key={el.id}
          className={`absolute rounded-full ${el.id % 3 === 0 ? 'bg-primary/20' : el.id % 3 === 1 ? 'bg-purple-500/20' : 'bg-pink-500/20'}`}
          style={{ 
            width: `${el.size}px`, 
            height: `${el.size}px`,
            left: `${el.x}%`,
            top: `${el.y}%`,
          }}
          animate={{
            y: [0, Math.random() * 50 - 25, 0], // Reduced movement range
            x: [0, Math.random() * 50 - 25, 0], // Reduced movement range
            opacity: [el.opacity, el.opacity * 1.5, el.opacity],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: el.duration,
            delay: el.delay,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
      
      {/* Smaller, more visible glowing orbs */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-xl"
          style={{
            width: `${Math.random() * 20 + 10}vw`, // Responsive sizing
            height: `${Math.random() * 20 + 10}vw`, // Responsive sizing
            left: `${Math.random() * 80 + 10}%`, // Keep away from edges
            top: `${Math.random() * 80 + 10}%`, // Keep away from edges
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0], // Reduced movement
            y: [0, Math.random() * 100 - 50, 0], // Reduced movement
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: Math.random() * 20 + 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

// Update the NetworkEffect component to be more visible
const NetworkEffect = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="network-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <circle cx="50" cy="50" r="1" fill="currentColor" className="text-primary" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#network-pattern)" />
      </svg>
      
      {/* Animated connection lines */}
      {[...Array(8)].map((_, i) => {
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const endX = Math.random() * 100;
        const endY = Math.random() * 100;
        
        return (
          <motion.div
            key={`line-${i}`}
            className="absolute bg-gradient-to-r from-purple-500/20 to-pink-500/20 h-[1px]"
            style={{
              left: `${startX}%`,
              top: `${startY}%`,
              width: '0%',
              transformOrigin: 'left center',
              rotate: `${Math.atan2(endY - startY, endX - startX) * (180 / Math.PI)}deg`
            }}
            animate={{
              width: [`0%`, `${Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2))}%`, `0%`],
              opacity: [0, 0.5, 0]
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              repeatDelay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  )
}

// Feature card component with animation
const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  link, 
  delay = 0 
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -10, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden"
    >
      <Link href={link} className="block">
        <div className="relative z-10 h-full rounded-xl border border-primary/10 bg-background/50 p-6 backdrop-blur-sm transition-all duration-300 group-hover:border-primary/30 group-hover:bg-background/80 group-hover:shadow-lg">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary/20">
            {icon}
          </div>
          <h3 className="mb-2 text-xl font-bold">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
          <div className="mt-4 flex items-center text-primary">
            <span className="mr-2 text-sm font-medium">Explore</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"></div>
    </motion.div>
  )
}

// REMOVE THIS DUPLICATE DECLARATION
// Animated background grid
// const GridBackground = () => {
//   return (
//     <div className="absolute inset-0 overflow-hidden">
//       <div className="absolute inset-0 bg-grid-white/10 bg-[size:50px_50px] [mask-image:radial-gradient(black,transparent_70%)] dark:bg-grid-white/5"></div>
//       <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background"></div>
//     </div>
//   )
// }

// REMOVE THIS DUPLICATE DECLARATION TOO
// Floating elements animation
// const FloatingElements = () => {
//   return (
//     <div className="absolute inset-0 overflow-hidden pointer-events-none">
//       {[...Array(20)].map((_, i) => (
//         <motion.div
//           key={i}
//           className="absolute w-2 h-2 rounded-full bg-primary/20"
//           initial={{
//             x: Math.random() * 100 + "%",
//             y: Math.random() * 100 + "%",
//             scale: Math.random() * 0.5 + 0.5,
//             opacity: Math.random() * 0.5 + 0.25,
//           }}
//           animate={{
//             y: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
//             x: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
//             opacity: [Math.random() * 0.5 + 0.25, Math.random() * 0.5 + 0.25],
//           }}
//           transition={{
//             duration: Math.random() * 20 + 10,
//             repeat: Infinity,
//             repeatType: "reverse",
//           }}
//         />
//       ))}
//     </div>
//   )
// }

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background overflow-hidden p-8">
      {/* Enable the animated cursor */}
      <AnimatedCursor />
      
      {/* Background elements */}
      <GridBackground />
      <FloatingElements />
      <NetworkEffect />
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tighter">CodeNexus</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <AuthStatus />
            <Button className="relative overflow-hidden group">
              <span className="relative z-10">Get Started</span>
              <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32">
          <div className="container relative z-10">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  AI-Powered Interview Prep
                </div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  Master Tech Interviews with{" "}
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                    AI-Powered
                  </span>{" "}
                  Tools
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                  Elevate your interview preparation with our cutting-edge AI tools. Practice with personalized mentorship, system design simulations, and real-time DSA feedback.
                </p>
                <motion.div 
                  className="flex flex-wrap gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Button size="lg" className="relative overflow-hidden group">
                    <span className="relative z-10 flex items-center gap-2">
                      Start Now <ArrowRight className="h-4 w-4" />
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </Button>
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="relative lg:ml-auto w-full mx-auto lg:mx-0"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden rounded-xl border border-primary/10 bg-background/50 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-grid-white/5 bg-[size:20px_20px]"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10"></div>
                  
                  {/* Animated code editor with typing effect */}
                  <motion.div 
                    className="absolute top-[15%] left-[10%] w-[70%] rounded-lg border border-primary/20 bg-background/80 p-4 backdrop-blur-md shadow-lg"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <div className="ml-2 text-xs text-muted-foreground">interview.js</div>
                    </div>
                    <pre className="text-xs text-primary/80 font-mono overflow-x-auto">
                      <TypewriterText text={`function findOptimalSolution(array) {
  // Find the maximum value in the array
  let result = 0;
  for (let i = 0; i < array.length; i++) {
    result = Math.max(result, array[i]);
  }
  return result;
}`} delay={0.5} speed={30} />
                    </pre>
                  </motion.div>
                  
                  {/* AI feedback that appears progressively as code is being typed */}
                  <motion.div 
                    className="absolute bottom-[15%] right-[10%] w-[75%] rounded-lg border border-primary/20 bg-background/80 p-4 backdrop-blur-md shadow-lg"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 4.5, duration: 0.5 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <div className="ml-2 text-xs text-muted-foreground">ai-feedback.md</div>
                    </div>
                    <div className="text-xs text-primary/80">
                      <TypewriterText 
                        text={`✨ AI Feedback: Consider using a more efficient approach.

🔍 Suggestion: Use a single pass with O(n) time complexity.

⚡ Optimization: Try implementing a sliding window technique.

🧠 Question: "How would you modify this to handle negative numbers?"`}
                        delay={5}
                        speed={20}
                      />
                    </div>
                  </motion.div>
                  
                  {/* Floating question suggestions that appear after feedback */}
                  <motion.div
                    className="absolute top-[60%] left-[5%] max-w-[200px] rounded-lg border border-purple-500/30 bg-background/60 p-3 backdrop-blur-md shadow-lg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 7.5, duration: 0.5 }}
                  >
                    <div className="text-xs font-medium text-primary mb-1">Try these variations:</div>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li className="hover:text-primary cursor-pointer transition-colors">• Maximum product subarray</li>
                      <li className="hover:text-primary cursor-pointer transition-colors">• Circular subarray sum</li>
                    </ul>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Feature Cards Section */}
        <section className="py-12 md:py-24">
          <div className="container">
            <motion.div 
              className="mx-auto text-center md:max-w-[58rem] mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Supercharge Your Interview Prep
              </h2>
              <p className="mt-4 text-muted-foreground md:text-xl/relaxed">
                Our cutting-edge tools combine AI technology with proven interview strategies to help you succeed.
              </p>
            </motion.div>
            
            <div className="grid gap-8 md:grid-cols-4">
              <FeatureCard
                icon={<MessageSquare className="h-6 w-6" />}
                title="AI Mentor"
                description="Talk with a personalized AI avatar for 1:1 mentorship."
                link="/mentorship/"
                delay={0.1}
              />
              <FeatureCard
                icon={<Server className="h-6 w-6" />}
                title="System Design"
                description="Simulate real-world system design interviews with AI feedback."
                link="/system-design"
                delay={0.2}
              />
              <FeatureCard
                icon={<Code className="h-6 w-6" />}
                title="DSA Interviewer"
                description="Real-time mock interviews with a code editor, Gemini feedback, and Judge0 code evaluation."
                link="/dsa-interview/onboarding"
                delay={0.3}
              />
              <FeatureCard
                icon={<Database className="h-6 w-6" />}
                title="Insight View"
                description="Analyze your performance metrics and track your interview preparation progress."
                link="/insights-view"
                delay={0.4}
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-12 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5"></div>
          <div className="container relative z-10">
            <motion.div 
              className="mx-auto text-center md:max-w-[58rem]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Ace Your Next Interview?
              </h2>
              <p className="mt-4 text-muted-foreground md:text-xl/relaxed">
                Join thousands of engineers who have successfully prepared for technical interviews using our platform.
              </p>
              <motion.div 
                className="mt-8 flex flex-wrap justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Button size="lg" className="relative overflow-hidden group">
                  <span className="relative z-10">Get Started Now</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold">CodeNexus</span>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} CodeNexus. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
              <Brain className="h-4 w-4" />
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
              <Code className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

