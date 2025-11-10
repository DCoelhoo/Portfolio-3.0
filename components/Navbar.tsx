"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar() {
  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 80) {
        setVisible(false)
      } else {
        setVisible(true)
      }
      setLastScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  const navItems = [
    { label: "Home", id: "home" },
    { label: "About", id: "about" },
    { label: "Projects", id: "projects" },
    { label: "Updates", id: "updates" },
    { label: "Contact", id: "contact" },
  ]

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed top-0 left-0 w-full z-50 px-8 py-4 flex justify-between items-center 
                     bg-zinc-900/30 backdrop-blur-md border-b border-white/10 text-white
                     shadow-[0_2px_10px_rgba(0,0,0,0.2)]"
        >
          {/* 🔹 Logo com glow */}
          <motion.span
            className="text-cyan-400 font-bold text-lg cursor-pointer select-none tracking-tight"
            onClick={() => scrollToSection("home")}
            whileHover={{ scale: 1.05 }}
            animate={{
              textShadow: [
                "0 0 4px rgba(34,211,238,0.6)",
                "0 0 12px rgba(34,211,238,0.8)",
                "0 0 4px rgba(34,211,238,0.6)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
          >
            dgportfolio
          </motion.span>

          {/* 🔹 Links com cursor e animação */}
          <div className="flex gap-6 text-sm">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="relative text-gray-300 hover:text-cyan-400 transition font-medium cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                {item.label}
                <motion.span
                  className="absolute left-0 bottom-0 w-full h-[1px] bg-cyan-400 origin-left scale-x-0"
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            ))}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}