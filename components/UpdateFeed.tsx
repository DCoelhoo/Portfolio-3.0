"use client"
import { useEffect, useState } from "react"
import { Github, Newspaper, Linkedin } from "lucide-react"

type Update = {
  title: string
  url: string
  description?: string
  source?: string
  date?: string
}

export default function UpdatesFeed() {
  const [updates, setUpdates] = useState<Update[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/updates")
      .then((r) => r.json())
      .then(setUpdates)
      .finally(() => setLoading(false))
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
        const date = u.date
          ? new Date(u.date).toLocaleDateString("pt-PT", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : null

        // 🎨 Escolher cor/ícone da origem
        let icon = null
        let badgeColor = ""
        switch (u.source) {
          case "GitHub":
            icon = <Github className="h-4 w-4" />
            badgeColor = "bg-gray-800 text-gray-200 border border-gray-600"
            break
          case "Hashnode":
            icon = <Newspaper className="h-4 w-4" />
            badgeColor = "bg-purple-700/30 text-purple-300 border border-purple-500/40"
            break
          case "LinkedIn":
            icon = <Linkedin className="h-4 w-4" />
            badgeColor = "bg-blue-700/30 text-blue-300 border border-blue-500/40"
            break
          default:
            badgeColor = "bg-white/10 text-white/60"
        }

        return (
          <a
            key={i}
            href={u.url}
            target="_blank"
            rel="noreferrer"
            className="block border border-white/10 rounded-xl p-4 bg-white/5 hover:bg-white/10 transition-all group"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-cyan-400 group-hover:underline">
                  {u.title}
                </h3>
                {u.description && (
                  <p className="text-white/70 text-sm mt-1 line-clamp-2">
                    {u.description}
                  </p>
                )}
                {date && (
                  <p className="text-xs text-white/50 mt-1">{date}</p>
                )}
              </div>

              {/* Badge */}
              <div
                className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg whitespace-nowrap ${badgeColor}`}
              >
                {icon}
                <span>{u.source}</span>
              </div>
            </div>
          </a>
        )
      })}
    </div>
  )
}