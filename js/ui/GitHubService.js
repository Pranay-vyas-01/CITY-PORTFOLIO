/**
 * GITHUB COMMAND CENTER SERVICE
 * Connects to GitHub API with live repository telemetry, loading states,
 * and robust rate-limit / offline fallbacks.
 */

export class GitHubService {
  constructor(username) {
    this.username = username || "Pranay-vyas-01";
    this.cachedRepos = null;
  }

  async fetchRepositories() {
    if (this.cachedRepos) return this.cachedRepos;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(`https://api.github.com/users/${this.username}/repos?sort=updated&per_page=6`, {
        signal: controller.signal,
        headers: { Accept: "application/vnd.github.v3+json" }
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`GitHub API responded with status ${res.status}`);
      }

      const data = await res.json();
      this.cachedRepos = data;
      return { success: true, data };
    } catch (err) {
      console.warn("GitHub API fetch fallback:", err.message);
      return {
        success: false,
        error: err.message,
        fallbackData: this.getFallbackRepositories()
      };
    }
  }

  getFallbackRepositories() {
    return [
      {
        name: "DSA-Problem-Solving",
        description: "Curated implementations of core Data Structures & Algorithms in C and C++.",
        html_url: `https://github.com/${this.username}`,
        language: "C++",
        stargazers_count: 0,
        forks_count: 0,
        updated_at: new Date().toISOString()
      },
      {
        name: "C-Fundamentals-Suite",
        description: "Low-level system programs, memory allocation experiments, and pointer logic in C.",
        html_url: `https://github.com/${this.username}`,
        language: "C",
        stargazers_count: 0,
        forks_count: 0,
        updated_at: new Date().toISOString()
      },
      {
        name: "Competitive-Programming",
        description: "Solutions to algorithmic problems from LeetCode and CodeChef with complexity analysis.",
        html_url: `https://github.com/${this.username}`,
        language: "C++",
        stargazers_count: 0,
        forks_count: 0,
        updated_at: new Date().toISOString()
      }
    ];
  }
}
