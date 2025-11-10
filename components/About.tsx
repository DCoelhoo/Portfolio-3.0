"use client"

import { motion } from "framer-motion"
import { Download } from "lucide-react"

/**
 * AboutSection Component
 *
 * Displays a brief introduction, soft skills, a button to download the resume,
 * and a vertical timeline of professional and academic experiences.
 */
export default function AboutSection() {
  /** List of soft skills to display as tags */
  const softSkills = [
    "Attention to Detail",
    "Empathy",
    "Problem Solving",
    "Teamwork",
    "Curiosity",
  ]

  /** Timeline entries for career and education milestones */
  const timeline = [
    {
      year: "September 2025",
      text: "ERASMUS+ Internship in Vilnius, Lithuania as Full Stack Developer",
    },
    {
      year: "March 2025",
      text: "Invisible Meaning – Internship as Full Stack Developer",
    },
    {
      year: "January 2025",
      text: "Freelance Backend Developer",
    },
    {
      year: "October 2022",
      text: "Bachelor’s Degree in Computer Engineering",
    },
    {
      year: "March 2022",
      text: "Werk It Solutions – Full Stack Developer",
    },
    {
      year: "September 2020",
      text: "Professional Higher Technical Course (CTeSP) in Mobile Device Development",
    },
  ]

  return (
    <section
      id="about"
      className="min-h-screen flex flex-col justify-center items-center px-6 text-center max-w-6xl mx-auto py-24"
    >
      {/* Section Title */}
      <motion.h2
        className="text-3xl font-bold text-cyan-400 mb-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        About Me
      </motion.h2>

      {/* Main Description */}
      <motion.p
        className="text-white/70 leading-relaxed mb-4 max-w-2xl"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        I’m a Computer Science graduate passionate about building efficient,
        user-focused web applications. With hands-on experience in full-stack
        development, systems design, and project collaboration, I strive to turn
        technical knowledge into practical, meaningful solutions that make
        technology simple, intuitive, and genuinely useful — helping people
        spend less time managing technology and more time living their lives.
      </motion.p>

      {/* Soft Skills */}
      <motion.div
        className="flex flex-wrap justify-center gap-3 mt-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        {softSkills.map((skill) => (
          <span
            key={skill}
            className="px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-sm hover:bg-cyan-400/20 transition"
          >
            {skill}
          </span>
        ))}
      </motion.div>

      {/* Resume Download Button */}
      <motion.a
        href="/DiogoGoncalves_Resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-10 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 font-medium hover:bg-cyan-500/20 transition-all cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
      >
        <Download size={18} />
        View Resume
      </motion.a>

      {/* Vertical Timeline */}
      <motion.div
        className="mt-16 flex flex-col items-center w-full"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <div className="relative w-full max-w-4xl">
          {/* Timeline Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-[2px] bg-cyan-400/40 h-full" />

          <div className="space-y-12">
            {timeline.map((item, i) => (
              <div
                key={i}
                className="relative flex flex-col items-center text-center"
              >
                {/* Timeline Dot */}
                <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.7)] mb-4" />
                <p className="text-cyan-400 font-semibold">{item.year}</p>
                <p className="text-white/70 text-sm mt-2 leading-relaxed max-w-xs">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}