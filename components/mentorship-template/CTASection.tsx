import { ArrowRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CTASection() {
  return (
    <section className="w-full py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-600/10 via-transparent to-transparent"></div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 relative">
        <div className="mx-auto max-w-3xl">
          <div className="group relative">
            <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-70 blur-lg"></div>
            <div className="relative rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl p-8 md:p-12">
              <div className="flex flex-col items-center justify-center space-y-6 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                    Ready to Get Started?
                  </h2>
                  <p className="max-w-[600px] text-zinc-400 md:text-xl/relaxed">
                    Join thousands of professionals learning from AI mentors.
                  </p>
                </div>
                <div className="flex flex-col gap-3 min-[400px]:flex-row">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white border-0 h-12 px-6 font-medium"
                  >
                    Create Free Account <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-zinc-700 text-slate-700 hover:bg-zinc-800 hover:text-white h-12 px-6 font-medium"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}