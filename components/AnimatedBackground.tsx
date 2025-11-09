"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useEffect, useMemo, useState } from "react"

type Particle = { x: number; y: number; size: number; delay: number }

export function AnimatedBackground() {
  // ⚡️ parallax por scroll
  const { scrollYProgress } = useScroll() // 0 → topo, 1 → fundo
  // camada de gradiente move mais (parallax forte)
  const gradX = useTransform(scrollYProgress, [0, 1], ["0px", "140px"])
  const gradY = useTransform(scrollYProgress, [0, 1], ["0px", "220px"])
  // partículas movem menos (parallax subtil)
  const layerX = useTransform(scrollYProgress, [0, 1], ["0px", "60px"])
  const layerY = useTransform(scrollYProgress, [0, 1], ["0px", "100px"])
  // podes também brincar com opacidade/scale se quiseres:
  // const fogOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.85])

  // ✨ partículas só no cliente (evita hydration mismatch)
  const [particles, setParticles] = useState<Particle[]>([])
  useEffect(() => {
    const count = 50 // reduz se precisares de mais perf
    const arr = Array.from({ length: count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 5,
    }))
    setParticles(arr)
  }, [])

  // memo para não re-renderizar tudo
  const particleNodes = useMemo(
    () =>
      particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-cyan-300/30 shadow-lg shadow-cyan-400/20"
          style={{
            top: `${p.y}%`,
            left: `${p.x}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            translateX: layerX,
            translateY: layerY,
          }}
          animate={{
            y: ["0%", "-30%", "0%"],
            opacity: [0.35, 0.9, 0.35],
            x: ["0%", "3%", "-3%", "0%"],
          }}
          transition={{
            duration: 5 + Math.random() * 6,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )),
    [particles, layerX, layerY]
  )

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* 🌫️ névoa/gradiente com parallax mais intenso */}
      <motion.div
        className="absolute inset-0"
        style={{
          translateX: gradX,
          translateY: gradY,
          background:
            "radial-gradient(circle at 20% 30%, rgba(34,211,238,0.20), transparent 60%), radial-gradient(circle at 80% 70%, rgba(147,51,234,0.22), transparent 60%), radial-gradient(circle at 50% 50%, rgba(14,165,233,0.14), transparent 80%)",
          backgroundSize: "200% 200%",
          filter: "blur(100px)",
          // opacity: fogOpacity,
        }}
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 25, ease: "linear", repeat: Infinity }}
      />

      {/* ✨ partículas com parallax suave */}
      <div className="absolute inset-0">{particleNodes}</div>
    </div>
  )
}