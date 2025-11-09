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

// 🐙 GITHUB COMMITS (últimos commits reais, sem duplicados)
try {
  const repos = ["DCoelhoo/Portfolio-3.0"]; // podes adicionar mais repositórios se quiseres
  const commits: any[] = [];

  for (const repoName of repos) {
    const commitRes = await fetch(`https://api.github.com/repos/${repoName}/commits?per_page=5`, {
      headers: {
        Accept: "application/vnd.github+json",
        ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
      },
      next: { revalidate: 300 },
    });

    if (!commitRes.ok) throw new Error(await commitRes.text());
    const commitData = await commitRes.json();

    commitData.forEach((c: any) => {
      commits.push({
        title: c.commit.message?.split("\n")[0] || "Commit",
        url: c.html_url,
        description: `Commit no repositório ${repoName}`,
        image: c.author?.avatar_url || c.committer?.avatar_url || null,
        source: "GitHub",
        date: new Date(c.commit.author.date).toISOString(),
      });
    });
  }

  const sortedCommits = commits
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  console.log(`🐙 ${sortedCommits.length} commits encontrados no GitHub.`);
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