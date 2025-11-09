import type { Metadata } from "next"
import "@/styles/globals.css"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { AnimatedBackground } from "@/components/AnimatedBackground"

export const metadata: Metadata = {
  title: "Diogo Gonçalves – Portfolio",
  description: "Coding the future, one line at a time",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body className="min-h-screen flex flex-col text-white relative overflow-hidden">
        <AnimatedBackground />
        <Navbar />
        <main className="flex-1 flex flex-col z-10">{children}</main>
        <Footer />
      </body>
    </html>
  )
}