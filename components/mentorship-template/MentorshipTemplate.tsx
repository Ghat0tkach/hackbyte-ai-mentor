import { ArrowRight, Code, Database, FileText, MessageSquare, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function MentorshipTemplate() {
  return (
    <section className="w-full py-12 sm:py-16 md:py-24 lg:py-32 relative overflow-hidden bg-zinc-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-600/10 via-transparent to-transparent"></div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 relative">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1 text-sm">
            <span className="text-zinc-400">Mentorship</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
              Learn From Industry Experts
            </h2>
            <p className="max-w-[900px] text-zinc-400 md:text-xl/relaxed">
              Our AI mentors are trained on real-world knowledge from top tech companies
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {mentors.map((mentor) => (
            <div key={mentor.name} className="group relative flex h-full">
              <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-70 blur-lg group-hover:opacity-100 transition duration-300"></div>
              <Card className="relative bg-zinc-950 border-zinc-800 shadow-xl overflow-hidden flex flex-col w-full">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 to-fuchsia-600"></div>
                <CardHeader className="pb-2 pt-6">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-white">{mentor.name}</CardTitle>
                      <CardDescription className="text-zinc-400">{mentor.role}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <p className="text-zinc-300 mb-6">{mentor.description}</p>
                  <div className="mt-auto space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-violet-400 flex-shrink-0" />
                        <span className="text-sm text-zinc-400">{mentor.expertise}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-fuchsia-400 flex-shrink-0" />
                        <span className="text-sm text-zinc-400">{mentor.resources} resources</span>
                      </div>
                    </div>
                    <Link href="/mentorship/onboarding">
                    <Button 
                      className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-100 mt-4 h-10"
                      variant="ghost"
                    >
                       Start Learning  <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const mentors = [
  {
    name: "Microsoft Mentor",
    role: "Azure & Cloud Expert",
    description: "Learn cloud architecture, Azure services, and Microsoft's best practices from an AI trained on Microsoft's knowledge base.",
    expertise: "Cloud Computing, Azure, .NET",
    resources: "1,200+"
  },
  {
    name: "Google Mentor",
    role: "Web & ML Expert",
    description: "Master web technologies, machine learning, and Google Cloud with an AI trained on Google's engineering practices.",
    expertise: "Web Dev, ML, Google Cloud",
    resources: "1,500+"
  },
  {
    name: "Custom Mentor",
    role: "Specialized Learning",
    description: "Create a custom mentor for any company or technology stack you want to learn about.",
    expertise: "Your choice of specialization",
    resources: "Generated on demand"
  }
]