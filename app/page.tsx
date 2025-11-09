"use client"

import { useEffect, useMemo, useState, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import socials from "@/data/socials.json"
import UpdatesFeed from "@/components/UpdateFeed"

export default function HomePage() {
  const [vw, setVw] = useState(0)
  useEffect(() => {
    const onResize = () => setVw(window.innerWidth)
    onResize()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])
  const ref = useRef(null)

  return (
    <main ref={ref} className="flex flex-col items-center justify-center min-h-screen w-full text-white text-center overflow-hidden">
      {/* HERO COM PARALLAX SUAVE E PROFUNDIDADE REAL */}
      <section className="flex flex-col items-center justify-center h-screen w-full px-4 text-center space-y-6">
        <motion.h1
          className="text-5xl md:text-7xl font-bold tracking-tight"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Diogo Gonçalves
        </motion.h1>

        <motion.p
          className="text-lg md:text-2xl text-white/70"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1 }}
        >
          Coding the future, one line at a time
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-4 mt-4 justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
        >
          <a
            href="#projects"
            className="px-6 py-3 bg-cyan-500/20 border border-cyan-400/30 hover:bg-cyan-500/40 text-cyan-400 rounded-xl transition-all"
          >
            Ver Projetos ↓
          </a>
          <a
            href={socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-white/20 rounded-xl hover:bg-white/10 transition-all"
          >
            Contactar
          </a>
        </motion.div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="min-h-screen flex flex-col justify-center items-center px-6 text-center max-w-3xl"
      >
        <h2 className="text-3xl font-semibold mb-4 text-cyan-400">Sobre mim</h2>
        <p className="text-white/70 leading-relaxed">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quod ex maxime excepturi itaque eum praesentium cum, obcaecati error quos. Doloribus a ullam, deleniti quisquam aliquid facilis eaque fugit reprehenderit sed.
        </p>
      </section>

      {/* PROJECTS, UPDATES e CONTACT — mantém igual */}
      <section id="projects" className="min-h-screen flex flex-col justify-center items-center px-6">
        <h2 className="text-3xl font-semibold mb-8 text-cyan-400">Projetos</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
            >
              <h3 className="font-semibold text-lg mb-2">Projeto {i}</h3>
              <p className="text-sm text-white/70">
                Breve descrição do projeto {i}. Aqui podes mostrar o que fizeste e as tecnologias usadas.
              </p>
              <Link href="#" className="inline-block mt-3 text-cyan-400 hover:underline text-sm">
                Ver mais →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section id="updates" className="min-h-screen flex flex-col justify-center items-center px-6">
        <UpdatesFeed />
      </section>

      <section id="contact" className="min-h-[60vh] flex flex-col justify-center items-center text-center space-y-4">
        <h2 className="text-3xl font-semibold text-cyan-400 mb-2">Contacta-me</h2>
        <p className="text-white/70">Aberto a colaborações e novas oportunidades.</p>
        <div className="flex gap-6 mt-4">
          <a href={socials.github} target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition">GitHub</a>
          <a href={socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition">LinkedIn</a>
          <a href={`mailto:${socials.email}`} className="hover:text-cyan-400 transition">Email</a>
        </div>
      </section>
    </main>
  )
}