import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { Speech } from "lucide-react"
import { SpeechProvider } from "@/hooks/use-speech"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
        <SpeechProvider>
          {children}
         </SpeechProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

