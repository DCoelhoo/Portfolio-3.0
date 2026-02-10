"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import socials from "@/data/socials.json"
import UpdatesFeed from "@/components/UpdateFeed"
import TechCarousel from "@/components/TechCarousel"
import Projects from "@/components/Projects"
import About from "@/components/About"
import Contact from "@/components/Contact"

/**
 * HomePage Component
 *
 * This is the main landing page of the portfolio.
 * It contains the hero section, about section, technology carousel,
 * projects showcase, updates feed, and contact form.
 */
export default function HomePage() {
  const [viewportWidth, setViewportWidth] = useState(0)
  const ref = useRef<HTMLDivElement | null>(null)

  /**
   * Updates viewport width on resize.
   * Used for responsive behavior in animations or layout adjustments.
   */
  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <main
      ref={ref}
      className="flex flex-col items-center justify-center min-h-screen w-full text-white text-center overflow-hidden"
    >
      {/* HERO SECTION — main introduction */}
      <section className="flex flex-col items-center justify-center h-screen w-full px-4 text-center space-y-6">
        <motion.h1
          className="text-5xl md:text-7xl font-bold tracking-tight"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Developer
        </motion.h1>

        <motion.p
          className="text-lg md:text-2xl text-white/70"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1 }}
        >
          Coding the future, one line at a time
        </motion.p>

        {/* Hero Buttons */}
        <motion.div
          className="flex flex-wrap gap-4 mt-4 justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
        >
          <a
            href="#projects"
            className="px-6 py-3 bg-cyan-500/20 border border-cyan-400/30 hover:bg-cyan-500/40 text-cyan-400 rounded-xl transition-all cursor-pointer"
          >
            View Projects ↓
          </a>
          <a
            href={socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-white/20 rounded-xl hover:bg-white/10 transition-all cursor-pointer"
          >
            Contact Me
          </a>
        </motion.div>
      </section>

      {/* ABOUT SECTION */}
      <About />

      {/* TECHNOLOGIES CAROUSEL */}
      <TechCarousel />

      {/* PROJECTS SECTION */}
      <Projects />

      {/* UPDATES FEED */}
      <section
        id="updates"
        className="min-h-screen flex flex-col justify-center items-center px-6"
      >
        <UpdatesFeed />
      </section>

      {/* CONTACT SECTION */}
      <Contact />
    </main>
  )
}