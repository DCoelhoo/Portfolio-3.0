export const onRequestGet = async (context: any) => {
  const cacheKey = new Request(new URL(context.request.url).toString(), { method: "GET" });
  const cache = (caches as any).default;
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const updates: {
    title: string;
    url: string;
    description?: string;
    image?: string | null;
    source: string;
    date: string;
  }[] = [];

  const token = context.env?.GITHUB_TOKEN as string | undefined;

  const ghHeaders: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // GitHub commits
  try {
    const commitRes = await fetch(
      "https://api.github.com/search/commits?q=author:DCoelhoo&sort=committer-date&order=desc&per_page=10",
      { headers: ghHeaders },
    );

    if (!commitRes.ok) throw new Error(await commitRes.text());
    const data = await commitRes.json();

    const commits = (data.items ?? []).map((c: any) => ({
      title: c.commit?.message?.split("\n")[0] || "Commit",
      url: c.html_url,
      description: `Commit in repository ${c.repository?.full_name ?? ""}`.trim(),
      image: c.author?.avatar_url || null,
      source: "GitHub",
      date: new Date(c.commit?.committer?.date ?? c.commit?.author?.date).toISOString(),
    }));

    updates.push(...commits);
  } catch (error) {
    console.error("Error fetching commits:", error);
  }

  // Hashnode
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
    });

    const { data } = await res.json();
    const posts = data?.publication?.posts?.edges || [];

    posts.forEach((p: any) =>
      updates.push({
        title: p.node.title,
        url: `https://404nights.hashnode.dev/${p.node.slug}`,
        description: p.node.brief,
        image: p.node.coverImage?.url || null,
        source: "Hashnode",
        date: new Date(p.node.publishedAt).toISOString(),
      }),
    );
  } catch (error) {
    console.error("Error fetching blog posts:", error);
  }

  updates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const response = new Response(JSON.stringify(updates), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=60",
    },
  });

  context.waitUntil?.(cache.put(cacheKey, response.clone()));
  return response;
};
