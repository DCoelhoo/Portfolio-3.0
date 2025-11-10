import type { Metadata } from "next"
import "@/styles/globals.css"
import Navbar from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { AnimatedBackground } from "@/components/AnimatedBackground"

/**
 * Application metadata used by Next.js for SEO and browser configuration.
 */
export const metadata: Metadata = {
  title: "Diogo Gonçalves – Portfolio",
  description: "Coding the future, one line at a time",
}

/**
 * Root layout for the application.
 * This component wraps all pages and includes global elements such as:
 * - Animated background
 * - Navbar
 * - Footer
 *
 * The layout ensures consistent styling and structure across all routes.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col text-white relative overflow-hidden">
        {/* Global animated particle background */}
        <AnimatedBackground />

        {/* Top navigation bar */}
        <Navbar />

        {/* Main content area */}
        <main className="flex-1 flex flex-col z-10">{children}</main>

        {/* Global footer */}
        <Footer />
      </body>
    </html>
  )
}