import { NextResponse } from "next/server"
import { XMLParser } from "fast-xml-parser"
import socials from "@/data/socials.json"

export async function GET() {
  const updates: any[] = []

  // 🐙 GITHUB COMMITS (públicos de qualquer repositório)
  try {
    const res = await fetch(`https://api.github.com/users/DCoelhoo/events/public`, {
      headers: { "Accept": "application/vnd.github+json" },
      next: { revalidate: 3600 },
    })
    const events = await res.json()

    const commits = events
      .filter((e: any) => e.type === "PushEvent")
      .flatMap((e: any) =>
        e.payload.commits.map((c: any) => ({
          title: c.message,
          url: `https://github.com/${e.repo.name}/commit/${c.sha}`,
          description: `Commit no repositório ${e.repo.name}`,
          source: "GitHub",
          date: new Date(e.created_at).toISOString(),
        }))
      )

    updates.push(...commits.slice(0, 5))
  } catch (error) {
    console.error("Erro ao buscar commits do GitHub:", error)
  }

  // 📰 HASHNODE BLOG (RSS)
  try {
    const rssUrl = `${socials.blog}/rss.xml`
    const rss = await fetch(rssUrl).then(r => r.text())
    const parser = new XMLParser()
    const json = parser.parse(rss)
    const items = json.rss.channel.item.slice(0, 3)

    updates.push(
      ...items.map((p: any) => ({
        title: p.title,
        url: p.link,
        description: p.description || "Artigo publicado no blog",
        source: "Hashnode",
        date: new Date(p.pubDate).toISOString(),
      }))
    )
  } catch (error) {
    console.error("Erro ao buscar RSS do Hashnode:", error)
  }

  // 💼 LINKEDIN POSTS (opcional, via RSS)
  // Se criares um feed com rss.app ou n8n, adiciona-o aqui:
  try {
    const linkedinRSS = "" // exemplo: "https://rss.app/feeds/<teu-id>.xml"
    if (linkedinRSS) {
      const rss = await fetch(linkedinRSS).then(r => r.text())
      const parser = new XMLParser()
      const json = parser.parse(rss)
      const posts = json.rss.channel.item.slice(0, 3)
      updates.push(
        ...posts.map((p: any) => ({
          title: p.title,
          url: p.link,
          description: p.description || "Publicação recente no LinkedIn",
          source: "LinkedIn",
          date: new Date(p.pubDate).toISOString(),
        }))
      )
    }
  } catch (error) {
    console.error("Erro ao buscar RSS do LinkedIn:", error)
  }

  // 🔁 Ordenar por data (mais recente primeiro)
  updates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return NextResponse.json(updates)
}