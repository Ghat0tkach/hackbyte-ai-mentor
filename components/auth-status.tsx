"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { User, LogOut } from "lucide-react"

export function AuthStatus() {
  const { data: session, status } = useSession()
  const isLoading = status === "loading"

  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" disabled className="gap-2">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <span>Loading...</span>
      </Button>
    )
  }

  if (session) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm hidden md:inline-block">
          {session.user?.name || session.user?.email}
        </span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => signOut({ callbackUrl: "/" })}
          className="gap-2"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden md:inline-block">Sign out</span>
        </Button>
      </div>
    )
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={() => signIn()}
      className="gap-2"
    >
      <User className="h-4 w-4" />
      <span>Sign in</span>
    </Button>
  )
}