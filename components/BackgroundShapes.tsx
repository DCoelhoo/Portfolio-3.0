"use client"
import { motion, useScroll, useTransform } from "framer-motion"

export default function BackgroundShapes() {
  const { scrollY } = useScroll()

  // Movimento com o scroll
  const y1 = useTransform(scrollY, [0, 1000], [0, 150])
  const y2 = useTransform(scrollY, [0, 1000], [0, -150])
  const rotate = useTransform(scrollY, [0, 1000], [0, 30])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Círculo azul */}
      <motion.div
        style={{ y: y1, rotate }}
        className="absolute top-[10%] left-[15%] w-[450px] h-[450px] rounded-full bg-cyan-500/25 blur-3xl"
      />

      {/* Círculo roxo */}
      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-[10%] right-[15%] w-[550px] h-[550px] rounded-full bg-purple-700/25 blur-3xl"
      />

      {/* Forma geométrica */}
      <motion.div
        style={{ rotate }}
        className="absolute top-[40%] left-[35%] w-[220px] h-[220px] bg-gradient-to-br from-cyan-400/20 to-purple-600/20 rotate-45 rounded-xl"
      />

      {/* Gradiente geral */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 via-black to-purple-950/20" />
    </div>
  )
}