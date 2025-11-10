/**
 * Returns the appropriate headers for GitHub API requests.
 * Includes an Authorization header if a GitHub token is available in the environment.
 *
 * @returns {Record<string, string>} Headers to be used in GitHub API fetch requests.
 */
export function getGitHubHeaders(): Record<string, string> {
  const token = process.env.GITHUB_TOKEN

  if (!token) {
    console.warn("⚠️ No GitHub token found in the server environment.")
    return { Accept: "application/vnd.github+json" }
  }

  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
  }
}