import Link from "next/link"
import { Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
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
  )
}