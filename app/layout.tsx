import type { Metadata } from "next"
import "@/styles/globals.css"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import BackgroundShapes from "@/components/BackgroundShapes"


export const metadata: Metadata = {
  title: "Diogo Gonçalves – Portfolio",
  description: "Coding the future, one line at a time",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body className="min-h-screen flex flex-col bg-black text-white">
        <Navbar />
        <main className="lex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  )
}