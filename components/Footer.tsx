"use client"

import { Github, Linkedin, Mail } from "lucide-react"
import socials from "@/data/socials.json"

/**
 * Footer Component
 *
 * Displays copyright information and social media links.
 * Uses Lucide icons and dynamically renders the current year.
 */
export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 py-8 text-sm text-white/70">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4 px-6">
        {/* Copyright */}
        <p>© {new Date().getFullYear()} Diogo Gonçalves. All rights reserved.</p>

        {/* Social Media Links */}
        <div className="flex gap-4">
          <a
            href={socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors cursor-pointer"
            aria-label="GitHub"
          >
            <Github size={18} />
          </a>

          <a
            href={socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors cursor-pointer"
            aria-label="LinkedIn"
          >
            <Linkedin size={18} />
          </a>

          <a
            href={`mailto:${socials.email}`}
            className="hover:text-white transition-colors cursor-pointer"
            aria-label="Email"
          >
            <Mail size={18} />
          </a>
        </div>
      </div>
    </footer>
  )
}