import { Code2, Database, FileSearch, Search, Server, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HowItWorks() {
  return (
    <section className="w-full py-16 sm:py-20 md:py-32 relative px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/50 via-transparent to-transparent"></div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 relative">
        <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12">
          <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-sm">
            <span className="text-zinc-400">How it works</span>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
              Choose Your Learning Path
            </h2>
            <p className="max-w-[900px] text-zinc-400 text-base sm:text-lg md:text-xl/relaxed">
              Select your preferred company and get mentorship from AI avatars trained on their knowledge base.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:gap-16">
          <div className="group relative">
            <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-70 blur-lg group-hover:opacity-100 transition duration-300"></div>
            <Card className="relative bg-zinc-900 border-zinc-800 shadow-xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 to-fuchsia-600"></div>
              <CardHeader className="pb-2 px-4 sm:px-6 text-white">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Database className="h-4 w-4 sm:h-5 sm:w-5 text-violet-500" />
                  Pre-Scraped Knowledge Base
                </CardTitle>
                <CardDescription className="text-zinc-400 text-sm">For popular companies like Microsoft</CardDescription>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="rounded-full bg-zinc-800 p-1.5 sm:p-2 flex-shrink-0">
                      <FileSearch className="h-4 w-4 sm:h-5 sm:w-5 text-violet-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-zinc-200 text-sm sm:text-base">Dedicated Articles</h3>
                      <p className="text-xs sm:text-sm text-zinc-400">
                        Access curated content from dev.co, Medium, and other trusted sources.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="rounded-full bg-zinc-800 p-1.5 sm:p-2 flex-shrink-0">
                      <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-fuchsia-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-zinc-200 text-sm sm:text-base">Instant Access</h3>
                      <p className="text-xs sm:text-sm text-zinc-400">
                        Get immediate mentorship with no waiting time for content processing.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="group relative">
            <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-70 blur-lg group-hover:opacity-100 transition duration-300"></div>
            <Card className="relative bg-zinc-900 border-zinc-800 shadow-xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 to-fuchsia-600"></div>
              <CardHeader className="pb-2 px-4 sm:px-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-white">
                  <Server className="h-4 w-4 sm:h-5 sm:w-5 text-fuchsia-500" />
                  Runtime RAG Pipeline
                </CardTitle>
                <CardDescription className="text-zinc-400 text-sm">For any other company of your choice</CardDescription>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="rounded-full bg-zinc-800 p-1.5 sm:p-2 flex-shrink-0">
                      <Search className="h-4 w-4 sm:h-5 sm:w-5 text-violet-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-zinc-200 text-sm sm:text-base">Real-time Gathering</h3>
                      <p className="text-xs sm:text-sm text-zinc-400">
                        Articles are gathered at runtime using Travily search and web scraping.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="rounded-full bg-zinc-800 p-1.5 sm:p-2 flex-shrink-0">
                      <Code2 className="h-4 w-4 sm:h-5 sm:w-5 text-fuchsia-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-zinc-200 text-sm sm:text-base">Custom RAG Pipeline</h3>
                      <p className="text-xs sm:text-sm text-zinc-400">
                        Advanced retrieval-augmented generation for accurate mentorship.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}