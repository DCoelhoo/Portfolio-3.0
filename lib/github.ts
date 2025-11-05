export function getGitHubHeaders(): Record<string, string> {
  const token = process.env.GITHUB_TOKEN

  if (!token) {
    console.warn("⚠️ Nenhum token GitHub encontrado no ambiente do servidor.")
    return { "Accept": "application/vnd.github+json" }
  }

  return {
    "Accept": "application/vnd.github+json",
    "Authorization": `Bearer ${token}`,
  }
}