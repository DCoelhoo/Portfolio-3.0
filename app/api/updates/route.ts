import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET() {
  const updates: {
    title: string
    url: string
    description?: string
    image?: string | null
    source: string
    date: string
  }[] = []

  const token = process.env.GITHUB_TOKEN
  const headers = {
    Accept: "application/vnd.github+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  /** -----------------------------------------
   * 1. FETCH ALL PUBLIC REPOSITORIES
   * ----------------------------------------- */
  let repos: any[] = []
  try {
    const repoRes = await fetch(
      "https://api.github.com/users/DCoelhoo/repos?per_page=100",
      { headers }
    )

    if (!repoRes.ok) throw new Error(await repoRes.text())
    repos = await repoRes.json()
  } catch (err) {
    console.error("Error fetching repositories:", err)
  }

  /** -----------------------------------------
   * 2. FETCH RECENT COMMITS FROM EACH REPO
   * ----------------------------------------- */
  try {
    const commits: any[] = []

    for (const repo of repos) {
      const repoName = repo.full_name
      const commitRes = await fetch(
        `https://api.github.com/repos/${repoName}/commits?per_page=3`,
        { headers }
      )

      if (!commitRes.ok) continue
      const commitData = await commitRes.json()

      commitData.forEach((c: any) => {
        commits.push({
          title: c.commit.message?.split("\n")[0] || "Commit",
          url: c.html_url,
          description: `Commit in repository ${repoName}`,
          image: c.author?.avatar_url || c.committer?.avatar_url || null,
          source: "GitHub",
          date: new Date(c.commit.author.date).toISOString(),
        })
      })
    }

    // Sort commits by date and limit globally (optional)
    const sorted = commits
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)

    updates.push(...sorted)
  } catch (error) {
    console.error("Error fetching commits:", error)
  }

  /** -----------------------------------------
   * 3. FETCH HASHNODE BLOG POSTS
   * ----------------------------------------- */
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
                    coverImage { url }
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

    posts.forEach((p: any) =>
      updates.push({
        title: p.node.title,
        url: `https://404nights.hashnode.dev/${p.node.slug}`,
        description: p.node.brief,
        image: p.node.coverImage?.url || null,
        source: "Hashnode",
        date: new Date(p.node.publishedAt).toISOString(),
      })
    )
  } catch (error) {
    console.error("Error fetching blog posts:", error)
  }

  /** Sort everything */
  updates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return NextResponse.json(updates)
}