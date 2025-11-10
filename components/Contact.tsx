"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, CheckCircle } from "lucide-react"

/**
 * ContactSection Component
 *
 * Displays a contact form connected to Formspree.
 * Includes animated feedback for sending, success, and error states.
 * All transitions use Framer Motion for smooth, modern animations.
 */
export default function ContactSection() {
  /** Current form submission state */
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle")

  /**
   * Handles the form submission via Formspree.
   * Displays a success or error message accordingly.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus("loading")

    const form = e.currentTarget
    const data = new FormData(form)

    try {
      const response = await fetch("https://formspree.io/f/xldbwnqk", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      })

      if (response.ok) {
        setStatus("sent")
        form.reset()
        setTimeout(() => setStatus("idle"), 4000)
      } else {
        setStatus("error")
        setTimeout(() => setStatus("idle"), 4000)
      }
    } catch {
      setStatus("error")
      setTimeout(() => setStatus("idle"), 4000)
    }
  }

  return (
    <section
      id="contact"
      className="min-h-[80vh] flex flex-col justify-center items-center px-6 py-20 text-center max-w-3xl mx-auto"
    >
      {/* Section Title */}
      <motion.h2
        className="text-3xl font-bold text-cyan-400 mb-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Contact Me
      </motion.h2>

      {/* Section Description */}
      <p className="text-white/70 mb-10">
        Have a project in mind or just want to say hi?  
        Feel free to reach out!
      </p>

      {/* Contact Form */}
      <motion.form
        onSubmit={handleSubmit}
        className="w-full bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 space-y-4 shadow-lg backdrop-blur-md relative"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        {/* Success Message Overlay */}
        <AnimatePresence>
          {status === "sent" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex flex-col justify-center items-center bg-zinc-900/80 rounded-2xl text-cyan-300"
            >
              <CheckCircle size={40} className="mb-2 text-cyan-400" />
              <p className="text-lg font-medium">Message sent successfully!</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Fields */}
        <input
          type="text"
          name="name"
          placeholder="Your name"
          required
          disabled={status === "loading"}
          className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 disabled:opacity-60"
        />
        <input
          type="email"
          name="email"
          placeholder="Your email"
          required
          disabled={status === "loading"}
          className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 disabled:opacity-60"
        />
        <textarea
          name="message"
          placeholder="Your message..."
          required
          disabled={status === "loading"}
          rows={5}
          className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 resize-none disabled:opacity-60"
        />

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={status === "loading" || status === "sent"}
          className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl border font-medium transition-all cursor-pointer ${
            status === "loading"
              ? "opacity-60 cursor-not-allowed"
              : "bg-cyan-500/20 border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/30"
          }`}
          whileHover={status === "idle" ? { scale: 1.02 } : {}}
          whileTap={status === "idle" ? { scale: 0.97 } : {}}
        >
          {status === "loading" ? (
            <>
              <motion.div
                className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"
              />
              Sending...
            </>
          ) : (
            <>
              <Send size={18} />
              Send Message
            </>
          )}
        </motion.button>
      </motion.form>
    </section>
  )
}