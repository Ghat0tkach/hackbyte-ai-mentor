"use client"
import { BarChart3, LineChart, UserCheck, ShieldCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react"

export default function Visualization() {
  const [activeTab, setActiveTab] = useState(0)
  const tabs = [
    {
      icon: <BarChart3 className="h-5 w-5 text-violet-400" />,
      title: "Flow Charts",
      color: "text-violet-400"
    },
    {
      icon: <UserCheck className="h-5 w-5 text-emerald-400" />,
      title: "Always Available Mentor",
      color: "text-emerald-400"
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-fuchsia-400" />,
      title: "Authentic Information",
      color: "text-fuchsia-400"
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % tabs.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="w-full py-20 md:py-32 bg-zinc-900 relative overflow-hidden">
      {/* Enhanced background with multiple gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-600/10 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-fuchsia-600/10 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NGgtMXYtNHptMi0yaDF2MWgtMXYtMXptLTIgMmgtMXYxaDF2LTF6bS0yLTJoMXYxaC0xdi0xem0yLTJoMXYxaC0xdi0xem0yLTJoMXYxaC0xdi0xem0tMi0yaDF2MWgtMXYtMXptLTItMmgxdjFoLTF2LTF6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 relative">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1 text-sm">
            <span className="text-zinc-400">Visualize</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
              See Complex Concepts Clearly
            </h2>
            <p className="max-w-[900px] text-zinc-400 md:text-xl/relaxed">
              Our AI generates diagrams and visualizations to help you understand complex topics.
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-4xl">
          {/* Constant glowing effect for the card */}
          <div className="group relative animate-pulse-slow">
            <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-70 blur-lg"></div>
            <Card className="relative bg-zinc-900 border-zinc-800 shadow-xl overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="bg-zinc-950 p-8 flex flex-col justify-center space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-white">Interactive Diagrams</h3>
                      <p className="text-zinc-400">
                        Ask for insights or better visualization, and the AI will generate diagrams using Mermaid.
                      </p>
                    </div>
                    <div className="space-y-4">
                      {tabs.map((tab, index) => (
                        <div 
                          key={index}
                          className={`flex items-center gap-3 p-3 rounded-lg border border-zinc-800 transition-all duration-300 cursor-pointer ${
                            activeTab === index 
                              ? "bg-zinc-800 border-zinc-700 scale-105 shadow-lg" 
                              : "bg-zinc-900"
                          }`}
                          onClick={() => setActiveTab(index)}
                        >
                          <div className={`transition-transform duration-300 ${activeTab === index ? "scale-110" : ""}`}>
                            {tab.icon}
                          </div>
                          <span className={`text-zinc-300 ${activeTab === index ? tab.color : ""}`}>{tab.title}</span>
                          {activeTab === index && (
                            <div className="ml-auto w-2 h-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 animate-pulse"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-8 bg-zinc-900 flex items-center justify-center">
                    {/* Enhanced visualization box with constant glow */}
                    <div className="w-full max-w-[300px] aspect-square bg-zinc-950 rounded-lg border border-zinc-800 flex items-center justify-center p-6 shadow-lg relative">
                      {/* Glow effect */}
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 blur-md animate-glow"></div>
                      <div className="absolute inset-0 rounded-lg border border-zinc-700/50"></div>
                      
                      <div className="text-center space-y-4 w-full relative z-10">
                        <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-glow">
                          {activeTab === 0 && <BarChart3 className="h-6 w-6 text-white animate-fadeIn" />}
                          {activeTab === 1 && <UserCheck className="h-6 w-6 text-white animate-fadeIn" />}
                          {activeTab === 2 && <ShieldCheck className="h-6 w-6 text-white animate-fadeIn" />}
                        </div>
                        <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
                          {activeTab === 0 && "Sample Diagram"}
                          {activeTab === 1 && "24/7 Mentorship"}
                          {activeTab === 2 && "Verified Content"}
                        </p>
                        <div className="w-full h-32 bg-zinc-900/80 backdrop-blur-sm rounded-lg border border-zinc-800 flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-full bg-[linear-gradient(110deg,rgba(124,58,237,0.1)_45%,rgba(217,70,239,0.1)_50%,rgba(124,58,237,0.1)_55%)] bg-[length:200%_100%] animate-[shimmer_2s_infinite]"></div>
                          </div>
                          <div className="relative transition-opacity duration-500">
                            {activeTab === 0 && (
                              <div className="text-center animate-fadeIn">
                                <svg width="120" height="80" viewBox="0 0 120 80" className="mx-auto">
                                  <rect x="10" y="10" width="100" height="20" rx="5" fill="#4c1d95" fillOpacity="0.5" />
                                  <line x1="60" y1="30" x2="60" y2="40" stroke="#8b5cf6" strokeWidth="2" />
                                  <rect x="10" y="40" width="45" height="20" rx="5" fill="#4c1d95" fillOpacity="0.5" />
                                  <rect x="65" y="40" width="45" height="20" rx="5" fill="#4c1d95" fillOpacity="0.5" />
                                  <line x1="32.5" y1="60" x2="32.5" y2="70" stroke="#8b5cf6" strokeWidth="2" />
                                  <line x1="87.5" y1="60" x2="87.5" y2="70" stroke="#8b5cf6" strokeWidth="2" />
                                </svg>
                              </div>
                            )}
                            {activeTab === 1 && (
                              <div className="text-center animate-fadeIn">
                                <div className="flex flex-col items-center">
                                  <div className="w-8 h-8 rounded-full bg-emerald-900/50 flex items-center justify-center mb-2">
                                    <UserCheck className="h-4 w-4 text-emerald-400" />
                                  </div>
                                  <div className="w-20 h-1 bg-emerald-900/50 mb-2"></div>
                                  <div className="flex space-x-4">
                                    <div className="w-6 h-6 rounded-full bg-emerald-900/30 animate-pulse"></div>
                                    <div className="w-6 h-6 rounded-full bg-emerald-900/30 animate-pulse delay-300"></div>
                                    <div className="w-6 h-6 rounded-full bg-emerald-900/30 animate-pulse delay-500"></div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {activeTab === 2 && (
                              <div className="text-center animate-fadeIn">
                                <div className="flex flex-col items-center">
                                  <div className="w-8 h-8 rounded-full bg-fuchsia-900/50 flex items-center justify-center mb-2">
                                    <ShieldCheck className="h-4 w-4 text-fuchsia-400" />
                                  </div>
                                  <div className="space-y-2 w-full">
                                    <div className="w-full h-2 bg-fuchsia-900/30 rounded-full"></div>
                                    <div className="w-3/4 h-2 bg-fuchsia-900/30 rounded-full"></div>
                                    <div className="w-1/2 h-2 bg-fuchsia-900/30 rounded-full"></div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-zinc-500">
                          {activeTab === 0 && "Generated on request"}
                          {activeTab === 1 && "Available 24/7"}
                          {activeTab === 2 && "Verified sources"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .shadow-glow {
          box-shadow: 0 0 15px 2px rgba(139, 92, 246, 0.3);
        }
      `}</style>
    </section>
  )
}