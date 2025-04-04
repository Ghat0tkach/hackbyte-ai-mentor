"use client"

import { SpeechProvider } from "@/hooks/use-speech";

export default function MentorshipLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
   return(
      <SpeechProvider>
        {children}
      </SpeechProvider>
   )
}