import { Octokit } from "../common/octokit.ts";

export interface GitHubUserData {
  name: string;
  ownedRepositories: number;
  ownedStargazers: number;
  collaboratedRepositories: number;
  collaboratedStargazers: number;
  followers: number;
  total: {
    commits: number;
    issues: number;
    pullRequests: number;
    repositoriesContributedTo: number;
  };
  lastYear: {
    commits: number;
    issues: number;
    pullRequests: number;
    repositoriesContributedTo: number;
  };
}

interface GitHubUserFetcherOptions {
  userOctokit: Octokit;
  user: string;
}

export default async function fetchGitHubUser(
  { userOctokit, user }: GitHubUserFetcherOptions,
): Promise<GitHubUserData> {
  const {
    user: {
      name = "",
      followers: { totalCount: followers = 0 } = {},
      contributionsCollection: {
        totalCommitContributions: lastYearCommits = 0,
        totalIssueContributions: lastYearIssues = 0,
        totalPullRequestContributions: lastYearPullRequests = 0,
        totalRepositoryContributions: lastYearRepositoriesContributedTo = 0,
        contributionYears = [],
      } = {},
      owned: { totalCount: ownedRepositories = 0 } = {},
      collaborated: { totalCount: collaboratedRepositories = 0 } = {},
    } = {},
  } = await userOctokit.graphql(
    `#graphql
    query ($user: String!) {
      user(login: $user) {
        name
        followers {
          totalCount
        }
        contributionsCollection {
          totalCommitContributions
          totalIssueContributions
          totalPullRequestContributions
          totalRepositoryContributions
          contributionYears
        }
        owned: repositories(ownerAffiliations: OWNER, isFork: false) {
          totalCount
        }
        collaborated: repositories(ownerAffiliations: COLLABORATOR) {
          totalCount
        }
      }
    }
  `,
    { user },
  );

  const yearsInput = contributionYears.map((year: number) =>
    `$from_${year}: DateTime!, $to_${year}: DateTime!`
  ).join(", ");

  const yearsQuery = contributionYears.map((year: number) =>
    `#graphql
    contributions_${year}: contributionsCollection(from: $from_${year}, to: $to_${year}) {
      totalCommitContributions
      totalIssueContributions
      totalPullRequestContributions
      totalRepositoryContributions
    }
  `
  ).join("\n");

  const {
    user: {
      owned: { nodes: ownedRepositoriesNodes = [] } = {},
      collaborated: { nodes: collaboratedRepositoriesNodes = [] } = {},
      ...yearsContributions
    } = {},
  } = await userOctokit.graphql(
    `#graphql
    query ($user: String!, $ownedRepositories: Int!, $collaboratedRepositories: Int!, ${yearsInput}) {
      user(login: $user) {
        owned: repositories(ownerAffiliations: OWNER, last: $ownedRepositories, isFork: false) {
          nodes {
            stargazerCount
          }
        }
        collaborated: repositories(ownerAffiliations: COLLABORATOR, last: $collaboratedRepositories) {
          nodes {
            stargazerCount
          }
        }
        ${yearsQuery}
      }
    }
    `,
    {
      user,
      ownedRepositories,
      collaboratedRepositories,
      ...Object.fromEntries(
        contributionYears.flatMap((year: number) => [
          [`from_${year}`, `${year}-01-01T00:00:00Z`],
          [`to_${year}`, `${year + 1}-01-01T00:00:00Z`],
        ]),
      ),
    },
  );

  const ownedStargazers = ownedRepositoriesNodes.reduce(
    (acc: number, { stargazerCount = 0 }) => acc + stargazerCount,
    0,
  );
  const collaboratedStargazers = collaboratedRepositoriesNodes.reduce(
    (acc: number, { stargazerCount = 0 }) => acc + stargazerCount,
    0,
  );
  const total = contributionYears.map((year: number) =>
    yearsContributions[`contributions_${year}`]
  ).reduce(
    (
      acc: GitHubUserData["total"],
      {
        totalCommitContributions = 0,
        totalIssueContributions = 0,
        totalPullRequestContributions = 0,
        totalRepositoryContributions = 0,
      },
    ) => ({
      commits: acc.commits + totalCommitContributions,
      issues: acc.issues + totalIssueContributions,
      pullRequests: acc.pullRequests + totalPullRequestContributions,
      repositoriesContributedTo: acc.repositoriesContributedTo +
        totalRepositoryContributions,
    }),
    { commits: 0, issues: 0, pullRequests: 0, repositoriesContributedTo: 0 },
  );

  return {
    name,
    ownedRepositories,
    ownedStargazers,
    collaboratedRepositories,
    collaboratedStargazers,
    followers,
    total,
    lastYear: {
      commits: lastYearCommits,
      issues: lastYearIssues,
      pullRequests: lastYearPullRequests,
      repositoriesContributedTo: lastYearRepositoriesContributedTo,
    },
  };
}
