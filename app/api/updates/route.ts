import { NextResponse } from "next/server"
import { XMLParser } from "fast-xml-parser"
import socials from "@/data/socials.json"

export const runtime = "nodejs"

/**
 * GET handler for the /api/updates route.
 * Fetches the latest updates from GitHub and Hashnode.
 * Returns a JSON array containing recent commits and blog posts.
 */
export async function GET() {
  // Define the structure of an update item
  const updates: {
    title: string
    url: string
    description?: string
    image?: string | null
    source: string
    date: string
  }[] = []

  const token = process.env.GITHUB_TOKEN

  /**
   * GITHUB COMMITS
   * Fetches the most recent commits from selected repositories.
   */
  try {
    const repos = ["DCoelhoo/Portfolio-3.0"]
    const commits: any[] = []

    for (const repoName of repos) {
      const commitRes = await fetch(
        `https://api.github.com/repos/${repoName}/commits?per_page=5`,
        {
          headers: {
            Accept: "application/vnd.github+json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          next: { revalidate: 300 }, // Cache for 5 minutes
        }
      )

      if (!commitRes.ok) throw new Error(await commitRes.text())
      const commitData = await commitRes.json()

      commitData.forEach((commit: any) => {
        commits.push({
          title: commit.commit.message?.split("\n")[0] || "Commit",
          url: commit.html_url,
          description: `Commit in repository ${repoName}`,
          image: commit.author?.avatar_url || commit.committer?.avatar_url || null,
          source: "GitHub",
          date: new Date(commit.commit.author.date).toISOString(),
        })
      })
    }

    // Sort commits by date and limit to the 5 most recent
    const sortedCommits = commits
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)

    console.log(`${sortedCommits.length} commits fetched from GitHub.`)
    updates.push(...sortedCommits)
  } catch (error) {
    console.error("Error fetching commits from GitHub:", error)
  }

  /**
   * HASHNODE BLOG POSTS
   * Fetches the latest blog posts using the Hashnode GraphQL API.
   */
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
      console.log(`${posts.length} post(s) fetched from Hashnode.`)
    } else {
      console.warn("No posts found on Hashnode (GraphQL API).")
    }
  } catch (error) {
    console.error("Error fetching posts from Hashnode:", error)
  }

  /**
   * Sort all updates by date (most recent first)
   */
  updates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return NextResponse.json(updates)
}