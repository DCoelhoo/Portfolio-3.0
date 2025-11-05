import { NextResponse } from "next/server"
import { XMLParser } from "fast-xml-parser"
import socials from "@/data/socials.json"

export async function GET() {
    const updates: any[] = []


    // GITHUB COMMITS (públicos de qualquer repositório)
    try {
        const token = process.env.GITHUB_TOKEN

        if (!token) {
            console.warn("⚠️ Nenhum token do GitHub encontrado. Usa .env.local → GITHUB_TOKEN=...")
        }

        const res = await fetch(`https://api.github.com/users/DCoelhoo/events/public`, {
            headers: {
                "Accept": "application/vnd.github+json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}), // ✅ Só adiciona se existir
            },
            next: { revalidate: 900 }, // cache 15 min
        })

        if (!res.ok) {
            const msg = await res.text()
            console.error("Erro ao buscar dados do GitHub:", msg)
            throw new Error("GitHub API error")
        }

        const events = await res.json()

        const commits = events
            .filter((e: any) => e.type === "PushEvent" && e.payload?.commits)
            .flatMap((e: any) =>
                e.payload.commits.map((c: any) => ({
                    title: c.message || "Commit",
                    url: `https://github.com/${e.repo.name}/commit/${c.sha}`,
                    description: `Commit no repositório ${e.repo.name}`,
                    source: "GitHub",
                    date: new Date(e.created_at).toISOString(),
                }))
            )

        console.log(`🐙 ${commits.length} commits encontrados no GitHub.`)
        updates.push(...commits.slice(0, 5))
    } catch (error) {
        console.error("Erro ao buscar commits do GitHub:", error)
    }

    // 📰 HASHNODE BLOG (API GraphQL oficial)
    try {
        const res = await fetch("https://gql.hashnode.com", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                query: `
        query {
          publication(host: "404nights.hashnode.dev") {
            posts(first: 3) {
              edges {
                node {
                  title
                  brief
                  slug
                  coverImage {
                    url
                  }
                  publishedAt
                }
              }
            }
          }
        }
      `,
            }),
        })

        const { data } = await res.json()
        const posts = data?.publication?.posts?.edges || []

        if (posts.length > 0) {
            updates.push(
                ...posts.map((edge: any) => ({
                    title: edge.node.title,
                    url: `https://404nights.hashnode.dev/${edge.node.slug}`,
                    description: edge.node.brief,
                    image: edge.node.coverImage?.url || null,
                    source: "Hashnode",
                    date: new Date(edge.node.publishedAt).toISOString(),
                }))
            )
            console.log(`📰 ${posts.length} artigo(s) encontrados no Hashnode.`)
        } else {
            console.warn("⚠️ Nenhum artigo encontrado no Hashnode (API GraphQL).")
        }
    } catch (error) {
        console.error("Erro ao buscar posts do Hashnode:", error)
    }
    // 🔁 Ordenar por data (mais recente primeiro)
    updates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return NextResponse.json(updates)
}