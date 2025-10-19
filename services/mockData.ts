import type { Repository } from '../types';

const userAlice = { login: 'alice', avatar_url: 'https://avatars.githubusercontent.com/u/1' };
const userBob = { login: 'bob', avatar_url: 'https://avatars.githubusercontent.com/u/2' };
const userCharlie = { login: 'charlie', avatar_url: 'https://avatars.githubusercontent.com/u/3' };

/**
 * A mock repository object for testing and demonstration purposes.
 * Note: The application is currently wired to fetch live data from the GitHub API.
 * This data is not actively used unless the data fetching service is modified.
 */
export const genkitDemoRepo: Repository = {
  name: 'google/genkit-demo',
  commits: [
    {
      sha: 'a1b2c3d4e5f6',
      author: userAlice,
      message: 'feat: Initial commit for Genkit flow',
      date: '2023-10-26T10:00:00Z',
    },
    {
      sha: 'b2c3d4e5f6a1',
      author: userBob,
      message: 'fix: Corrected embedding model name',
      date: '2023-10-26T12:30:00Z',
    },
    {
      sha: 'c3d4e5f6a1b2',
      author: userAlice,
      message: 'refactor: Simplify the retrieval chain logic',
      date: '2023-10-27T09:15:00Z',
    },
  ],
  issues: [
    {
      id: 1,
      title: 'Support for Firestore as a vector store',
      user: userCharlie,
      state: 'open',
      body: 'We should add built-in support for using Firestore as a vector database for embeddings.',
      created_at: '2023-10-25T14:00:00Z',
      assignees: [userAlice],
    },
    {
      id: 2,
      title: 'Documentation for custom flows is unclear',
      user: userBob,
      state: 'closed',
      body: 'The section on creating custom Genkit flows could be improved with more examples.',
      created_at: '2023-10-24T11:00:00Z',
      assignees: [],
    },
  ],
  pullRequests: [
    {
      id: 5,
      title: 'Feat: Add OpenAI provider',
      user: userBob,
      state: 'merged',
      body: 'This PR adds a new provider for OpenAI models, including GPT-4.',
      created_at: '2023-10-26T18:00:00Z',
      merged_at: '2023-10-27T10:00:00Z',
    },
    {
      id: 6,
      title: 'Docs: Update quickstart guide',
      user: userCharlie,
      state: 'open',
      body: 'Improves the quickstart guide based on feedback from issue #2.',
      created_at: '2023-10-27T11:45:00Z',
      merged_at: null,
    },
  ],
};
