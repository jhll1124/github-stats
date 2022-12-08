import type { Commiter } from "../commiters/types.ts";
import { Octokit } from "../common/octokit.ts";
import actionCommiter from "../commiters/action.ts";
import ensureOctokit from "./ensure-octokit.ts";
import fileCommiter from "../commiters/file.ts";
import getRepositoryCommiter from "../commiters/repository.ts";
import logging from "../common/logging.ts";

function setUpFileCommitter<
  T extends {
    shouldWrite: boolean;
    commiters?: Commiter[];
  },
>({ shouldWrite, commiters = [], ...env }: T) {
  if (shouldWrite) {
    commiters.push(fileCommiter);
  }
  return {
    commiters,
    ...env,
  };
}

async function setUpRepositoryCommitter<
  T extends {
    shouldCommit: boolean;
    commiters?: Commiter[];
    actionOctokit?: Octokit;
    repoCommitTo?: string;
    branchCommitTo?: string;
    ghToken?: string;
  },
>({
  shouldCommit,
  ...env
}: T) {
  if (shouldCommit) {
    return await Promise.resolve(env)
      .then(ensureOctokit)
      .then(
        async (
          { commiters = [], actionOctokit, repoCommitTo, branchCommitTo, ...env },
        ) => {
          if (!repoCommitTo) {
            logging.exit("Missing GitHub repository."), Deno.exit(1);
          }

          const [user, repository] = repoCommitTo.split("/");
          commiters.push(
            await getRepositoryCommiter(actionOctokit, {
              owner: user,
              repo: repository,
              branch: branchCommitTo,
            }),
          );

          return {
            commiters,
            actionOctokit,
            ...env,
          };
        },
      );
  }

  return env;
}

async function setUpCommiters<
  T extends {
    shouldWrite: boolean;
    shouldCommit: boolean;
  },
>(env: T) {
  return await Promise.resolve(env)
    .then(setUpFileCommitter)
    .then(setUpRepositoryCommitter);
}

export async function setUpCommitersForCli<
  T extends {
    shouldWrite: boolean;
    shouldCommit: boolean;
  },
>(env: T) {
  return await Promise.resolve(env)
    .then(setUpCommiters)
    .then(({ commiters = [], ...env }) => {
      if (commiters.length === 0) {
        commiters.push(fileCommiter);
      }
      return { commiters, ...env };
    });
}

export async function setUpCommitersForActions<
  T extends {
    shouldWrite: boolean;
    shouldCommit: boolean;
  },
>(env: T) {
  return await Promise.resolve(env)
    .then(setUpCommiters)
    .then(({ commiters = [], ...env }) => {
      commiters.push(actionCommiter);
      return { commiters, ...env };
    });
}
