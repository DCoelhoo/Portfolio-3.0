"use client"

import { useEffect, useState } from "react"
import { Github, Newspaper, Linkedin } from "lucide-react"

interface Update {
  title: string
  url: string
  description?: string
  image?: string | null
  source: string
  date: string
}

export default function UpdateFeed() {
  const [updates, setUpdates] = useState<Update[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/updates")
      .then((r) => r.json())
      .then((data) => setUpdates(data))
      .finally(() => setLoading(false))
  }, [])

  if (loading)
    return <p className="text-center text-gray-400 mt-10">A carregar atualizações...</p>

  // 🔹 Separar por tipo de origem
  const github = updates
    .filter((u) => u.source === "GitHub")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  const blog = updates
    .filter((u) => u.source === "Hashnode")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)

  const linkedin = updates
    .filter((u) => u.source === "LinkedIn")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)

  const Column = ({
    title,
    icon: Icon,
    color,
    data,
  }: {
    title: string
    icon: any
    color: string
    data: Update[]
  }) => (
    <div className="flex-1 min-w-[340px] bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800 shadow-md">
      <div className="flex items-center justify-center gap-2 mb-5">
        <Icon className={`w-5 h-5 text-${color}-400`} />
        <h3 className={`text-xl font-semibold text-${color}-400`}>{title}</h3>
      </div>
      {data.length === 0 ? (
        <p className="text-sm text-gray-500 text-center">Nada encontrado</p>
      ) : (
        <ul className="space-y-3">
          {data.map((u, i) => (
            <li key={i}>
              <a
                href={u.url}
                target="_blank"
                className="block rounded-xl bg-zinc-800/60 hover:bg-zinc-800 p-4 transition"
              >
                <p className="font-medium text-gray-200 truncate">{u.title}</p>
                {u.description && (
                  <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                    {u.description}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(u.date).toLocaleDateString("pt-PT", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-center text-cyan-400 mb-10">
        Updates
      </h2>

      <div className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto">
        <Column title="GitHub" icon={Github} color="cyan" data={github} />
        <Column title="Blog" icon={Newspaper} color="purple" data={blog} />
        <Column title="LinkedIn" icon={Linkedin} color="blue" data={linkedin} />
      </div>
    </section>
  )
}