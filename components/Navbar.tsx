"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

const links = [
  { href: "/", label: "Início" },
  { href: "/projects", label: "Projetos" },
  { href: "/about", label: "Sobre mim" },
  { href: "/contact", label: "Contacto" },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full border-b border-white/10 bg-black/40 backdrop-blur-sm fixed top-0 left-0 z-50"
    >
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <Link href="/" className="text-xl font-bold text-white hover:text-blue-400 transition-colors">
          Diogo Gonçalves
        </Link>

        <div className="flex gap-6 text-sm">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`transition-colors ${
                pathname === href ? "text-blue-400" : "text-white/80 hover:text-white"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </motion.nav>
  )
}