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

    // 🐙 GITHUB COMMITS (últimos commits reais)
    try {
        const res = await fetch(`https://api.github.com/users/DCoelhoo/events/public`, {
            headers: {
                Accept: "application/vnd.github+json",
                ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
            },
            next: { revalidate: 300 },
        });

        if (!res.ok) {
            const text = await res.text();
            console.error("❌ Erro GitHub:", text);
            throw new Error(text);
        }

        const events = await res.json();

        // Pega só os eventos PushEvent recentes
        const pushEvents = events.filter((e: any) => e.type === "PushEvent" && e.repo?.name);

        // Busca commits reais de cada repositório envolvido
        const allCommits: any[] = [];

        for (const e of pushEvents) {
            try {
                const repoName = e.repo.name;
                const commitsUrl = `https://api.github.com/repos/${repoName}/commits?per_page=5`;

                const commitRes = await fetch(commitsUrl, {
                    headers: {
                        Accept: "application/vnd.github+json",
                        ...(process.env.GITHUB_TOKEN
                            ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
                            : {}),
                    },
                });

                if (!commitRes.ok) continue;

                const commitData = await commitRes.json();

                commitData.forEach((c: any) => {
                    allCommits.push({
                        title: c.commit.message?.split("\n")[0] || "Commit",
                        url: c.html_url,
                        description: `Commit no repositório ${repoName}`,
                        image: e.actor?.avatar_url || null,
                        source: "GitHub",
                        date: new Date(c.timestamp || e.created_at).toISOString(),
                    });
                });
            } catch (innerError) {
                console.warn("⚠️ Falha ao buscar commits do repo:", e.repo?.name, innerError);
            }
        }

        // Ordena por data mais recente
        const sortedCommits = allCommits
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5);

        console.log(`🐙 ${sortedCommits.length} commits reais encontrados no GitHub.`);
        updates.push(...sortedCommits);
    } catch (error) {
        console.error("Erro ao buscar commits do GitHub:", error);
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