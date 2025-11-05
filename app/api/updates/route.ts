import { NextResponse } from "next/server"
import { XMLParser } from "fast-xml-parser"
import socials from "@/data/socials.json"
export const runtime = "nodejs"

export async function GET() {
    // ✅ garante que o array é reconhecido como lista de objetos
    const updates: {
        title: string
        url: string
        description?: string
        image?: string | null
        source: string
        date: string
    }[] = []

    // ✅ lê diretamente o token do ambiente
    const token = process.env.GITHUB_TOKEN

    // 🐙 GITHUB COMMITS
    try {
        console.log("🧠 Preparando fetch GitHub com headers:", {
            Accept: "application/vnd.github+json",
            Authorization: token ? `Bearer ${token.slice(0, 8)}...` : "❌ sem token",
        })
        const res = await fetch("https://api.github.com/users/DCoelhoo/events/public", {
            headers: {
                "Accept": "application/vnd.github+json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            cache: "no-store",
        })

        if (!res.ok) {
            const text = await res.text()
            console.error("Erro GitHub:", text)
            throw new Error(text)
        }

        const events = await res.json()
        const commits = events
            .filter((e: any) => e.type === "PushEvent" && e.payload?.commits)
            .flatMap((e: any) => {
                if (e.type === "PushEvent" && e.payload?.commits) {
                    return e.payload.commits.map((c: any) => ({
                        title: c.message || "Commit",
                        url: `https://github.com/${e.repo.name}/commit/${c.sha}`,
                        description: `Commit no repositório ${e.repo.name}`,
                        source: "GitHub",
                        date: new Date(e.created_at).toISOString(),
                    }))
                }

                // Outros eventos interessantes
                if (e.type === "CreateEvent") {
                    return [{
                        title: `Novo repositório: ${e.repo.name}`,
                        url: `https://github.com/${e.repo.name}`,
                        description: "Repositório criado",
                        source: "GitHub",
                        date: new Date(e.created_at).toISOString(),
                    }]
                }

                if (e.type === "IssuesEvent") {
                    return [{
                        title: e.payload.action === "opened" ? "Issue aberta" : "Issue atualizada",
                        url: e.payload.issue?.html_url,
                        description: e.payload.issue?.title,
                        source: "GitHub",
                        date: new Date(e.created_at).toISOString(),
                    }]
                }

                return []
            })

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