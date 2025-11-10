"use client"

import { motion } from "framer-motion"
import Link from "next/link"

/**
 * List of featured projects to display on the portfolio.
 * Each project includes a title, description, and an external or internal link.
 */
const projects = [
  {
    title: "Personal Portfolio",
    desc: "Developed with Next.js and Tailwind CSS, featuring Framer Motion animations and API integrations.",
    link: "https://github.com/DCoelhoo/Portfolio-3.0",
  },
  {
    title: "Task Management App",
    desc: "React + Node.js app for task organization with JWT authentication and MongoDB database.",
    link: "#",
  },
  {
    title: "Financial Dashboard",
    desc: "Dynamic dashboard built with Next.js, featuring interactive charts and financial API integration.",
    link: "#",
  },
  {
    title: "Minimalist Landing Page",
    desc: "Optimized website for performance and accessibility, with a fully responsive modern design.",
    link: "#",
  },
]

/**
 * Projects Component
 *
 * Displays a responsive grid of portfolio projects.
 * Each project card includes hover animations, shadow highlights,
 * and smooth entrance animations triggered by viewport visibility.
 */
export default function Projects() {
  return (
    <section id="projects" className="min-h-screen flex flex-col justify-center items-center px-6">
      {/* Section Title */}
      <h2 className="text-3xl font-semibold mb-8 text-cyan-400">Projects</h2>

      {/* Projects Grid */}
      <motion.div
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: 0.15 }}
      >
        {projects.map((project, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 50, scale: 0.95 },
              visible: { opacity: 1, y: 0, scale: 1 },
            }}
            whileHover={{
              y: -8,
              scale: 1.02,
              borderColor: "rgba(34,211,238,0.9)",
              boxShadow: "0 0 25px rgba(34,211,238,0.2)",
            }}
            transition={{ type: "spring", stiffness: 350, damping: 20, mass: 0.3 }}
            className="p-6 rounded-xl border border-white/10 bg-white/5 cursor-pointer transition-all duration-300"
          >
            {/* Project Title */}
            <h3 className="font-semibold text-lg mb-2">{project.title}</h3>

            {/* Project Description */}
            <p className="text-sm text-white/70 mb-3">{project.desc}</p>

            {/* Project Link */}
            <Link
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline text-sm"
            >
              View Project →
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}