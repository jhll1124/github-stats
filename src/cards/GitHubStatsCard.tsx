import * as JSX from '../common/jsx-extra.ts';

import Card from './Card.tsx';
import { FlexLayout } from './Layout.tsx';
import { GitHubUserData } from '../fetchers/github-user-fetcher.ts';
import Style from '../common/Style.tsx';
import { calculateRank } from '../fetchers/github-user-rank.ts';
import { font } from '../themes/utils.tsx';
import { useTheme } from '../themes/Theme.tsx';

interface GitHubStatsCardProps {
  stats: GitHubUserData;
  title?: string;
  width: number;
  includeCollaboratedStargazers: boolean;
  onlyLastYear: boolean;
  hideStats: ('stars' | 'commits' | 'prs' | 'issues' | 'contributions')[];
}

const GitHubStatsCard: JSX.FC<GitHubStatsCardProps> = ({
  stats,
  title = `${stats.name}'s GitHub Stats`,
  width,
  includeCollaboratedStargazers,
  onlyLastYear,
  hideStats,
}) => {
  const theme = useTheme();

  const statItems: [string, number][] = [];
  if (!hideStats.includes('stars')) {
    statItems.push([
      'Total Stars Earned:',
      includeCollaboratedStargazers
        ? stats.ownedStargazers + stats.collaboratedStargazers
        : stats.ownedStargazers,
    ]);
  }
  if (!hideStats.includes('commits')) {
    statItems.push([
      onlyLastYear
        ? `Total Commits (${new Date().getFullYear() - 1}):`
        : 'Total Commits:',
      onlyLastYear ? stats.total.commits : stats.lastYear.commits,
    ]);
  }
  if (!hideStats.includes('prs')) {
    statItems.push([
      'Total PRs:',
      onlyLastYear ? stats.total.pullRequests : stats.lastYear.pullRequests,
    ]);
  }
  if (!hideStats.includes('issues')) {
    statItems.push([
      'Total Issues:',
      onlyLastYear ? stats.total.issues : stats.lastYear.issues,
    ]);
  }
  if (!hideStats.includes('contributions')) {
    statItems.push([
      'Contributed to:',
      onlyLastYear
        ? stats.total.repositoriesContributedTo
        : stats.lastYear.repositoriesContributedTo,
    ]);
  }

  const height =
    (theme.hideTitle ? 0 : theme.lineHeight) +
    theme.paddingY * 2 +
    Math.max(
      (statItems.length - 1) * theme.lineHeight,
      theme.hideRank ? 0 : theme.rankRadius * 2
    );

  return (
    <Card title={title} width={width} height={height}>
      {theme.hideRank ? null : (
        <RankCircle
          height={height}
          width={width - theme.paddingX * 2}
          stats={stats}
        />
      )}
      <svg x="0" y="0" width="100%">
        <FlexLayout gap={theme.lineHeight} direction="vertical">
          {statItems.map(([label, value], index) => (
            <Stagger
              label={label}
              value={value.toString()}
              animationDelay={450 + 150 * index}
            />
          ))}
        </FlexLayout>
      </svg>
    </Card>
  );
};

export default GitHubStatsCard;

const Stagger: JSX.FC<{
  label: string;
  value: string;
  animationDelay: number;
}> = ({ label, value, animationDelay }) => {
  const theme = useTheme();

  return (
    <g
      class="stagger"
      style={`animation-delay: ${animationDelay}ms`}
      transform={`translate(${theme.paddingX}, 0)`}
    >
      <Style>
        {`
          .stat {
            font: ${font(theme.statFont)};
            fill: ${theme.statColor};
          }
          .bold {
            font: ${font(theme.statBoldFont)};
          }
        `}
      </Style>

      {theme.enableAnimations ? (
        <Style>
          {`
            .stagger {
              opacity: 0;
              animation: fadeInAnimation 0.3s ease-in-out forwards;
            }
            @keyframes fadeInAnimation {
              0% { opacity: 0; }
              100% { opacity: 1; }
            }
            `}
        </Style>
      ) : (
        <Style>
          {`
            .stagger {
              opacity: 1;
            }
          `}
        </Style>
      )}

      <text class="stat bold" y={theme.lineHeight / 2}>
        {label}
      </text>
      <text class="stat" x="170" y={theme.lineHeight / 2}>
        {value}
      </text>
    </g>
  );
};

const RankCircle: JSX.FC<{
  height: number;
  width: number;
  stats: GitHubUserData;
}> = ({ height, width, stats }) => {
  const theme = useTheme();
  const rank = calculateRank({
    followers: stats.followers,
    repos: stats.ownedRepositories + stats.collaboratedRepositories,
    stargazers: stats.ownedStargazers + stats.collaboratedStargazers,
    commits: stats.total.commits,
    issues: stats.total.issues,
    prs: stats.total.pullRequests,
    contributions: stats.total.repositoriesContributedTo,
  });

  return (
    <g
      transform={`translate(=${
        width + theme.paddingX - theme.rankRadius * 2
      }, ${Math.max(
        height / 2 - theme.paddingY - theme.lineHeight,
        theme.rankRadius
      )})`}
    >
      <Style>
        {`
          .rank-circle-rim {
            stroke: ${theme.rankBackgroundColor};
            fill: none;
            stroke-width: 6;
          }
          .rank-circle {
            stroke: ${theme.rankForegroundColor};
            stroke-dasharray: 250;
            fill: none;
            stroke-width: 6;
            stroke-linecap: round;
            transform-origin: -10px 8px;
            transform: rotate(-90deg);
            stroke-dashoffset: ${calculateCircleProgress(
              100 - rank.score,
              theme.rankRadius
            )};

          }
          .rank-text {
            font: ${font(theme.rankTextFont)};
            fill: ${theme.rankTextColor};
            transform: translate(-5px, 5px);
          }
        `}
      </Style>
      {theme.enableAnimations ? (
        <Style>
          {`
          .rank-circle {
            animation: rankAnimation 1s forwards ease-in-out;
          }

          .rank-text {
            animation: scaleInAnimation 0.3s ease-in-out forwards;
          }

          @keyframes rankAnimation {
            0% {
              stroke-dashoffset: ${calculateCircleProgress(
                0,
                theme.rankRadius
              )};
            }
          }

          @keyframes scaleInAnimation {
            0% {
              transform: translate(-5px, 5px) scale(0);
            }
            100% {
              transform: translate(-5px, 5px) scale(1);
            }
          }
      `}
        </Style>
      ) : null}
      <circle class="rank-circle-rim" cx="-10" cy="8" r={theme.rankRadius} />
      <circle class="rank-circle" cx="-10" cy="8" r={theme.rankRadius} />
      <g class="rank-text">
        <text
          x="-5"
          y="3"
          alignment-baseline="central"
          dominant-baseline="central"
          text-anchor="middle"
        >
          {rank.level}
        </text>
      </g>
    </g>
  );
};

const calculateCircleProgress = (value: number, radius: number) => {
  const c = Math.PI * (radius * 2);

  if (value < 0) value = 0;
  if (value > 100) value = 100;

  return ((100 - value) / 100) * c;
};
