export const onRequestGet: PagesFunction = async (context) => {
  // Cache simples para não bateres no rate limit (60s)
  const cacheKey = new Request(new URL(context.request.url).toString(), {
    method: "GET",
  });
  const cache = caches.default;
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

  const token = context.env.GITHUB_TOKEN as string | undefined;

  const ghHeaders: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // 1) GitHub commits
  try {
    const commitRes = await fetch(
      "https://api.github.com/search/commits?q=author:DCoelhoo&sort=committer-date&order=desc&per_page=10",
      {
        headers: ghHeaders,
      },
    );

    if (!commitRes.ok) throw new Error(await commitRes.text());
    const data = await commitRes.json();

    const commits = (data.items ?? []).map((c: any) => ({
      title: c.commit?.message?.split("\n")[0] || "Commit",
      url: c.html_url,
      description: `Commit in repository ${c.repository?.full_name ?? ""}`.trim(),
      image: c.author?.avatar_url || null,
      source: "GitHub",
      date: new Date(
        c.commit?.committer?.date ?? c.commit?.author?.date,
      ).toISOString(),
    }));

    updates.push(...commits);
  } catch (error) {
    console.error("Error fetching commits:", error);
  }

  updates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const response = new Response(JSON.stringify(updates), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=60",
    },
  });

  context.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
};
