"use client"

import { Github, Linkedin, Mail } from "lucide-react"
import socials from "@/data/socials.json"

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 py-8 text-sm text-white/70">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4 px-6">
        <p>© {new Date().getFullYear()} Diogo Gonçalves. Todos os direitos reservados.</p>
        <div className="flex gap-4">
          <a href={socials.github} target="_blank" rel="noopener noreferrer" className="hover:text-white">
            <Github size={18} />
          </a>
          <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white">
            <Linkedin size={18} />
          </a>
          <a href={`mailto:${socials.email}`} className="hover:text-white">
            <Mail size={18} />
          </a>
        </div>
      </div>
    </footer>
  )
}