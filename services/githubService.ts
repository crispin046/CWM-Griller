import type { Repository, Commit, Issue, PullRequest, User } from '../types';

const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Parses a GitHub URL to extract the owner and repository name.
 * @param url The full GitHub URL.
 * @returns An object with owner and repo, or null if the URL is invalid.
 */
export const parseGitHubUrl = (url: string): { owner: string, repo: string } | null => {
  try {
    const urlObject = new URL(url);
    if (urlObject.hostname !== 'github.com') {
      return null;
    }
    const pathParts = urlObject.pathname.split('/').filter(part => part);
    if (pathParts.length >= 2) {
      return { owner: pathParts[0], repo: pathParts[1] };
    }
    return null;
  } catch (error) {
    return null;
  }
};

// --- Data Transformation Helpers ---

const transformUser = (user: any): User | null => {
    if (!user) return null;
    return {
        login: user.login,
        avatar_url: user.avatar_url,
    };
};

const transformCommit = (commit: any): Commit => {
    return {
        sha: commit.sha,
        // The author object can be null if the user has been deleted.
        author: transformUser(commit.author) || { login: commit.commit.author.name || 'unknown', avatar_url: '' },
        message: commit.commit.message,
        date: commit.commit.author.date,
    };
};

const transformIssue = (issue: any): Issue => {
    return {
        id: issue.number,
        title: issue.title,
        user: transformUser(issue.user)!,
        state: issue.state,
        body: issue.body || '',
        created_at: issue.created_at,
        assignees: issue.assignees?.map(transformUser).filter(Boolean) as User[] || [],
    };
};

const transformPullRequest = (pr: any): PullRequest => {
    return {
        id: pr.number,
        title: pr.title,
        user: transformUser(pr.user)!,
        state: pr.merged_at ? 'merged' : pr.state,
        body: pr.body || '',
        created_at: pr.created_at,
        merged_at: pr.merged_at,
    };
};

/**
 * Fetches and transforms repository data from the GitHub API.
 * @param owner The repository owner's username.
 * @param repo The repository name.
 * @returns A promise that resolves with the formatted repository data.
 */
export const fetchRepoData = async (owner: string, repo: string): Promise<Repository> => {
    const repoUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}`;
    
    try {
        const [commitsRes, issuesRes, pullsRes] = await Promise.all([
            fetch(`${repoUrl}/commits?per_page=25`),
            fetch(`${repoUrl}/issues?per_page=25`),
            fetch(`${repoUrl}/pulls?state=all&per_page=25`),
        ]);

        if (!commitsRes.ok) {
            if (commitsRes.status === 404) {
                 throw new Error(`Repository not found at ${owner}/${repo}. Check for typos or if it's a private repository.`);
            }
             throw new Error(`Failed to fetch commits: ${commitsRes.statusText}. You may have hit the GitHub API rate limit.`);
        }

        const rawCommits = await commitsRes.json();
        const rawIssues = issuesRes.ok ? await issuesRes.json() : [];
        const rawPulls = pullsRes.ok ? await pullsRes.json() : [];
        
        // GitHub's issues endpoint returns both issues and PRs, so we filter out PRs.
        const filteredIssues = rawIssues.filter((issue: any) => !issue.pull_request);

        const repository: Repository = {
            name: `${owner}/${repo}`,
            commits: rawCommits.map(transformCommit),
            issues: filteredIssues.map(transformIssue),
            pullRequests: rawPulls.map(transformPullRequest),
        };

        return repository;

    } catch (error: any) {
        console.error("Error fetching from GitHub API:", error);
        // Re-throw a more user-friendly error message.
        throw new Error(error.message || 'An unknown error occurred while fetching repository data.');
    }
};
