"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

const technologies = [
  { name: "Angular", logo: "/logos/angular.svg", url: "https://angular.dev/" },
  { name: "CSS3", logo: "/logos/css.svg", url: "https://developer.mozilla.org/docs/Web/CSS" },
  { name: "JavaScript", logo: "/logos/javascript.svg", url: "https://developer.mozilla.org/docs/Web/JavaScript" },
  { name: "MySQL", logo: "/logos/mysql.svg", url: "https://www.mysql.com/" },
  { name: "Next.js", logo: "/logos/next.svg", url: "https://nextjs.org/" },
  { name: "PHP", logo: "/logos/php.svg", url: "https://www.php.net/" },
  { name: "Python", logo: "/logos/python.svg", url: "https://www.python.org/" },
  { name: "React", logo: "/logos/react.svg", url: "https://react.dev/" },
]

export default function TechCarousel() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)

  // velocidade alvo e velocidade atual
  const baseSpeed = 0.6
  let currentSpeed = baseSpeed
  let targetSpeed = baseSpeed

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const contentWidth = wrapper.scrollWidth / 2
    let x = 0
    let frameId: number

    const loop = () => {
      // interpolação suave → acelera ou desacelera gradualmente
      currentSpeed += (targetSpeed - currentSpeed) * 0.1

      x -= currentSpeed
      if (Math.abs(x) >= contentWidth) x = 0
      wrapper.style.transform = `translate3d(${x}px, 0, 0)`

      frameId = requestAnimationFrame(loop)
    }

    frameId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frameId)
  }, [])

  // Atualiza targetSpeed quando pausa ou retoma
  useEffect(() => {
    targetSpeed = paused ? 0 : baseSpeed
  }, [paused])

  return (
    <section className="w-full flex flex-col items-center py-32 overflow-hidden relative">
      <h2 className="text-3xl font-semibold mb-12 text-cyan-400">Tecnologias</h2>

      <div className="relative w-full max-w-7xl px-8 overflow-hidden">
        <div
          ref={wrapperRef}
          className="flex gap-8 min-w-max will-change-transform transition-transform duration-200 ease-linear"
        >
          {[...technologies, ...technologies].map((tech, i) => (
            <motion.a
              key={i}
              href={tech.url}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              whileHover={{
                backgroundColor: "rgba(34,211,238,0.08)",
                borderColor: "rgba(34,211,238,0.5)",
                boxShadow:
                  "0 0 12px rgba(34,211,238,0.25), inset 0 0 6px rgba(34,211,238,0.15)",
              }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex items-center gap-3 px-6 py-3 rounded-xl 
                         border border-white/10 bg-white/5 cursor-pointer 
                         transition-all duration-300"
            >
              <div className="relative w-7 h-7 opacity-80 group-hover:opacity-100 transition-all duration-300">
                <Image
                  src={tech.logo}
                  alt={tech.name}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-gray-300 group-hover:text-cyan-400 transition-colors text-sm font-medium">
                {tech.name}
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}