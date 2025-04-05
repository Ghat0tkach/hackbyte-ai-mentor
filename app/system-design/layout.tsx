import type React from "react"

import type { Metadata } from "next"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "System Design AI - Master System Design Interviews",
  description:
    "AI-powered platform to help engineers master system design interviews through realistic simulations and personalized feedback.",
}

export default function SystemDesignLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
        {children}
    </div>
     
  )
}

