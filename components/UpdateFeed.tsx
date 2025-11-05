"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Github, Newspaper, Linkedin } from "lucide-react"

// 🧠 Função para mostrar “há X tempo”
function timeAgo(dateString?: string): string {
  if (!dateString) return ""
  const date = new Date(dateString)
  const diff = Math.floor((Date.now() - date.getTime()) / 1000)
  const intervals = [
    { label: "ano", seconds: 31536000 },
    { label: "mês", seconds: 2592000 },
    { label: "dia", seconds: 86400 },
    { label: "hora", seconds: 3600 },
    { label: "minuto", seconds: 60 },
  ]
  for (const i of intervals) {
    const count = Math.floor(diff / i.seconds)
    if (count >= 1) return `há ${count} ${i.label}${count > 1 ? "s" : ""}`
  }
  return "agora mesmo"
}

type Update = {
  title: string
  url: string
  description?: string
  source?: string
  date?: string
}

// 💾 Cache leve em memória (5 min)
let cachedUpdates: Update[] | null = null
let lastFetch = 0

export default function UpdatesFeed() {
  const [updates, setUpdates] = useState<Update[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const isFresh = Date.now() - lastFetch < 5 * 60 * 1000
      if (cachedUpdates && isFresh) {
        setUpdates(cachedUpdates)
        setLoading(false)
        return
      }
      try {
        const res = await fetch("/api/updates")
        const data = await res.json()
        cachedUpdates = data
        lastFetch = Date.now()
        setUpdates(data)
      } catch (err) {
        console.error("Erro ao carregar updates:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading)
    return (
      <p className="text-white/50 text-center mt-4 animate-pulse">
        A carregar atualizações...
      </p>
    )

  if (updates.length === 0)
    return (
      <p className="text-white/50 text-center mt-4">
        Sem atualizações recentes.
      </p>
    )

  return (
    <div className="w-full max-w-3xl space-y-4 mt-6">
      {updates.map((u, i) => {
        const ago = timeAgo(u.date)

        // Definir ícone, cor e avatar por origem
        let icon = null
        let badgeColor = ""
        let avatar = ""
        switch (u.source) {
          case "GitHub":
            icon = <Github className="h-4 w-4" />
            badgeColor = "bg-gray-800 text-gray-200 border border-gray-600"
            avatar = "https://github.com/DCoelhoo.png"
            break
          case "Hashnode":
            icon = <Newspaper className="h-4 w-4" />
            badgeColor = "bg-purple-700/30 text-purple-300 border border-purple-500/40"
            avatar = "https://cdn.hashnode.com/res/hashnode/image/upload/v1611248822667/CDyAuTy75.png"
            break
          case "LinkedIn":
            icon = <Linkedin className="h-4 w-4" />
            badgeColor = "bg-blue-700/30 text-blue-300 border border-blue-500/40"
            avatar = "https://cdn-icons-png.flaticon.com/512/174/174857.png"
            break
          default:
            badgeColor = "bg-white/10 text-white/60"
        }

        // ✨ Animação de entrada
        const fadeUp = {
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0 },
        }

        return (
          <motion.a
            key={i}
            href={u.url}
            target="_blank"
            rel="noreferrer"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: i * 0.1, duration: 0.4, ease: "easeOut" }}
            className="block border border-white/10 rounded-xl p-4 bg-white/5 hover:bg-white/10 transition-all group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3">
                {avatar && (
                  <img
                    src={avatar}
                    alt={u.source}
                    className="w-8 h-8 rounded-full object-cover border border-white/10"
                  />
                )}
                <div>
                  <h3 className="font-semibold text-cyan-400 group-hover:underline">
                    {u.title}
                  </h3>
                  {u.description && (
                    <p className="text-white/70 text-sm mt-1 line-clamp-2">
                      {u.description}
                    </p>
                  )}
                  {ago && (
                    <p className="text-xs text-white/50 mt-1">{ago}</p>
                  )}
                </div>
              </div>

              {/* Badge */}
              <div
                className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg whitespace-nowrap ${badgeColor}`}
              >
                {icon}
                <span>{u.source}</span>
              </div>
            </div>
          </motion.a>
        )
      })}
    </div>
  )
}