// FIX: Import d3 to provide types for SimulationNodeDatum and SimulationLinkDatum, which resolves the 'd3' namespace error.
import * as d3 from 'd3';

export interface User {
  login: string;
  avatar_url: string;
}

export interface Commit {
  sha: string;
  author: User;
  message: string;
  date: string;
}

export interface Issue {
  id: number;
  title: string;
  user: User;
  state: 'open' | 'closed';
  body: string;
  created_at: string;
  assignees: User[];
}

export interface PullRequest {
  id: number;
  title: string;
  user: User;
  state: 'open' | 'closed' | 'merged';
  body: string;
  created_at: string;
  merged_at: string | null;
}

export interface Repository {
  name: string;
  commits: Commit[];
  issues: Issue[];
  pullRequests: PullRequest[];
}

export enum NodeType {
  Commit = 'COMMIT',
  Issue = 'ISSUE',
  PullRequest = 'PULL_REQUEST',
  User = 'USER'
}

// FIX: Changed GraphNode to a type alias using an intersection to ensure properties from d3.SimulationNodeDatum are correctly inherited.
// This resolves TypeScript errors where properties like x, y, fx, and fy were not recognized.
export type GraphNode = d3.SimulationNodeDatum & {
  id: string;
  type: NodeType;
  label: string;
  data: Commit | Issue | PullRequest | User;
};

// FIX: Removed the overly restrictive 'source' and 'target' string properties.
// d3.SimulationLinkDatum<GraphNode> correctly types them, allowing d3-force to manage them as either strings or node objects during simulation.
export interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
}
