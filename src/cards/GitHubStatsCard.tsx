import * as JSX from '../common/jsx-extra.ts';

import Card from './Card.tsx';
import { FlexLayout } from './Layout.tsx';
import { GitHubUserData } from '../fetchers/github-user-fetcher.ts';
import Style from '../common/Style.tsx';
import { calculateRank } from '../fetchers/github-user-rank.ts';
import { useTheme } from '../themes/Theme.tsx';

interface GitHubStatsCardProps {
  stats: GitHubUserData;
  title?: string;
  width: number;
}

const GitHubStatsCard: JSX.FC<GitHubStatsCardProps> = ({
  stats,
  title = `${stats.name}'s GitHub Stats`,
  width,
}) => {
  const theme = useTheme();
  const statItems: [string, number][] = [
    [
      'Total Stars Earned:',
      stats.ownedStargazers + stats.collaboratedStargazers,
    ],
    ['Total Commits:', stats.total.commits],
    ['Total PRs:', stats.total.pullRequests],
    ['Total Issues:', stats.total.issues],
    ['Contributed to:', stats.total.repositoriesContributedTo],
  ];
  const height = Math.max(
    45 + (statItems.length + 1) * theme.lineHeight,
    theme.hideRank ? 0 : 150
  );
  
  return (
    <Card title={title} width={width} height={height}>
      {theme.hideRank ? null : <RankCircle height={height} stats={stats} />}
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
  return (
    <g
      class="stagger"
      style={`animation-delay: ${animationDelay}ms`}
      transform="translate(25, 0)"
    >
      <Style>{`
        .stagger {
          opacity: 0;
          animation: fadeInAnimation 0.3s ease-in-out forwards;
        }
        .stat {
          font: 600 14px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif; fill: #434d58;
        }
        .bold { font-weight: 700 }
        
        @keyframes fadeInAnimation {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}</Style>
      <text class="stat bold" y="12.5">
        {label}
      </text>
      <text class="stat" x="170" y="12.5" data-testid="stars">
        {value}
      </text>
    </g>
  );
};

const RankCircle: JSX.FC<{ height: number; stats: GitHubUserData }> = ({
  height,
  stats,
}) => {
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
      data-testid="rank-circle"
      transform={`translate(400, ${height / 2 - 50})`}
    >
      <Style>{`
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
          stroke-dashoffset: ${calculateCircleProgress(100 - rank.score)};
          animation: rankAnimation 1s forwards ease-in-out;
        }
        .rank-text {
          font: 800 24px 'Segoe UI', Ubuntu, Sans-Serif; fill: #434d58; 
          animation: scaleInAnimation 0.3s ease-in-out forwards;
        }
        
        @keyframes rankAnimation {
          0% {
            stroke-dashoffset: ${calculateCircleProgress(0)};
          }          
        }
      `}</Style>
      <circle class="rank-circle-rim" cx="-10" cy="8" r="40" />
      <circle class="rank-circle" cx="-10" cy="8" r="40" />
      <g class="rank-text">
        <text
          x="-9"
          y="5"
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

const calculateCircleProgress = (value: number) => {
  const radius = 40;
  const c = Math.PI * (radius * 2);

  if (value < 0) value = 0;
  if (value > 100) value = 100;

  return ((100 - value) / 100) * c;
};
