import { ArrowRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MentorShipHeroSection() {
  return (
    <section className="w-full py-16 sm:py-16 md:py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-600/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-fuchsia-600/10 via-transparent to-transparent"></div>
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-8 relative">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-6">
            <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-sm">
              <span className="flex h-2 w-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 mr-2"></span>
              <span>Now in public beta</span>
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                AI-Powered Mentorship Avatars
              </h1>
              <p className="max-w-[600px] text-zinc-400 text-lg sm:text-xl md:text-2xl">
                Get personalized mentorship from AI avatars trained on industry-leading companies' knowledge bases.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white border-0 h-12 px-6 font-medium w-full sm:w-auto"
              >
                Start Learning <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-zinc-800 text-slate-800 hover:bg-zinc-900 hover:text-white h-12 px-6 font-medium w-full sm:w-auto"
              >
                Watch Demo
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center mt-8 lg:mt-0">
            <div className="relative w-full max-w-[500px] aspect-video rounded-xl bg-zinc-900 border border-zinc-800 p-1 shadow-[0_0_30px_-5px_rgba(124,58,237,0.3)]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-3/4 h-3/4 bg-zinc-950 rounded-lg border border-zinc-800 shadow-lg p-4 flex items-center justify-center">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
                      <Zap className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-sm font-medium text-zinc-300">Interactive AI Mentorship</p>
                    <div className="flex justify-center space-x-1">
                      <div className="w-2 h-2 rounded-full bg-violet-600 animate-pulse"></div>
                      <div className="w-2 h-2 rounded-full bg-fuchsia-600 animate-pulse delay-150"></div>
                      <div className="w-2 h-2 rounded-full bg-violet-600 animate-pulse delay-300"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}