import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const updates: {
    title: string;
    url: string;
    description?: string;
    image?: string | null;
    source: string;
    date: string;
  }[] = [];

  const token = process.env.GITHUB_TOKEN;
  const headers = {
    Accept: "application/vnd.github+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  /** -----------------------------------------
   * GITHUB: FETCH LATEST COMMITS (1 request)
   * ----------------------------------------- */
  try {
    const commitRes = await fetch(
      "https://api.github.com/search/commits?q=author:DCoelhoo&sort=committer-date&order=desc&per_page=10",
      {
        headers: {
          ...headers,
          // GitHub requer este Accept para search commits em algumas configs
          Accept: "application/vnd.github+json",
        },
        cache: "no-store",
      },
    );

    if (!commitRes.ok) throw new Error(await commitRes.text());
    const data = await commitRes.json();

    const commits = (data.items ?? []).map((c: any) => ({
      title: c.commit?.message?.split("\n")[0] || "Commit",
      url: c.html_url,
      description:
        `Commit in repository ${c.repository?.full_name ?? ""}`.trim(),
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

  /** Sort everything */
  updates.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return NextResponse.json(updates);
}
