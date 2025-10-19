
import type { Repository, GraphNode, GraphLink, User, Commit, Issue, PullRequest } from '../types';
import { NodeType } from '../types';

export const processRepoDataToGraph = (repo: Repository): { nodes: GraphNode[], links: GraphLink[] } => {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];
  const userMap = new Map<string, User>();

  // Helper to add a user node if it doesn't exist
  const addUserNode = (user: User) => {
    if (user && !userMap.has(user.login)) {
      userMap.set(user.login, user);
      nodes.push({
        id: `user-${user.login}`,
        type: NodeType.User,
        label: user.login,
        data: user,
      });
    }
  };

  repo.commits.forEach((commit: Commit) => {
    const commitId = `commit-${commit.sha.substring(0, 7)}`;
    nodes.push({
      id: commitId,
      type: NodeType.Commit,
      label: commit.message.split('\n')[0].substring(0, 30) + '...',
      data: commit,
    });
    if (commit.author) {
      addUserNode(commit.author);
      links.push({ source: `user-${commit.author.login}`, target: commitId });
    }
  });

  repo.issues.forEach((issue: Issue) => {
    const issueId = `issue-${issue.id}`;
    nodes.push({
      id: issueId,
      type: NodeType.Issue,
      label: `#${issue.id} ${issue.title.substring(0,25)}...`,
      data: issue,
    });
    if(issue.user) {
        addUserNode(issue.user);
        links.push({ source: `user-${issue.user.login}`, target: issueId });
    }
    issue.assignees.forEach(assignee => {
        if(assignee) {
            addUserNode(assignee);
            links.push({ source: `user-${assignee.login}`, target: issueId });
        }
    });
  });
  
  repo.pullRequests.forEach((pr: PullRequest) => {
    const prId = `pr-${pr.id}`;
    nodes.push({
      id: prId,
      type: NodeType.PullRequest,
      label: `#${pr.id} ${pr.title.substring(0,25)}...`,
      data: pr,
    });
     if(pr.user) {
        addUserNode(pr.user);
        links.push({ source: `user-${pr.user.login}`, target: prId });
    }
  });

  return { nodes, links };
};
