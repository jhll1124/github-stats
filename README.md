# github-stats

Generate stats for your github readmes, using Github Actions.

## Examples

![GitHub Stats](https://raw.githubusercontent.com/Wybxc/metrics/main/github-stats.svg)

![Wakatime](https://raw.githubusercontent.com/Wybxc/metrics/main/wakatime-stats.svg)

## Usage

Setup a GitHub Action which runs periodically and pushes generated images to a repository.

### Step 1: Create a GitHub personal token

From the `Developer settings` of your account settings, select `Personal access tokens` to create a new token.

Afterwards, add the token to your repository secrets. Name it `GHTOKEN` or whatever you want.

### Step 2: Setup GitHub Action workflow

Create a new workflow and paste the following:

```yaml
name: Stats

on:
  # Schedule daily updates
  schedule: [{cron: "0 0 * * *"}]
  # (optional) Run workflow when pushing on master/main
  push: {branches: ["master", "main"]}
  # Add a workflow_dispatch to trigger it manually
  workflow_dispatch:

jobs:
  github-metrics:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - uses: Wybxc/github-stats@main
        id: stats
        with:
          token: ${{ secrets.GHTOKEN }}

          github-username: wybxc

          wakatime-username: wybxc
          wakatime-compact-layout: true
          wakatime-card-title: Most Used Languages
          wakatime-max-languages-count: 8
```

Wait for the workflow to finish and check the generated images in the repository.

## Configuration

| Option                                   | Description                                                                                                                                | Required | Default                       |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------- | ----------------------------- |
| `token`                                  | GitHub personal access token.                                                                                                              | Yes      |                               |
| `github-username`                        | Your github username. When this option exists, github user stats will be rendered.                                                         | No       |                               |
| `github-output-filename`                 | The filename of the output svg file.                                                                                                       | No       | `github-stats.svg`            |
| `github-image-width`                     | The width of the image.                                                                                                                    | No       | 495                           |
| `github-card-title`                      | The title of the github stats card.                                                                                                        | No       | `<username>'s GitHub Stats`   |
| `github-include-collaborated-stargazers` | Include stars from repositories of which you are collaborators.                                                                            | No       | true                          |
| `github-only-last-year`                  | Only show stats from the last year.                                                                                                        | No       | false                         |
| `github-hide-stat-items`                 | Hide specified stat items. Accepted values are "stars", "commits", "prs", "issues", and "contributions". Split by comma(,) or by newlines. | No       |                               |
| `wakatime-username`                      | Your wakatime username. When this option exists, wakatime stats will be rendered.                                                          | No       |                               |
| `wakatime-output-filename`               | The filename of the output svg file.                                                                                                       | No       | `wakatime-stats.svg`          |
| `wakatime-image-width`                   | The width of the image.                                                                                                                    | No       | 495                           |
| `wakatime-compact-layout`                | Use compact layout.                                                                                                                        | No       | false                         |
| `wakatime-card-title`                    | The title of the wakatime stats card.                                                                                                      | No       | `<username>'s Wakatime Stats` |
| `wakatime-max-languages-count`           | The maximum number of languages to show. When less than 1, all languages will be shown.                                                    | No       | 0                             |
| `wakatime-hide-languages`                | Hide specified languages. Split by comma(,) or by newlines.                                                                                | No       |                               |
| `output-action`                          | Output action, must be 'commit', which means the generated image will be pushed to the repository, or 'none', which means do nothing.      | No       | `commit`                      |
| `repo`                                   | GitHub repository to commit rendered images, e.g. `Wybxc/github-stats`. Default is the repository using the action.                        | No       |                               |
| `branch`                                 | Branch to commit rendered images, e.g. master. Default is the master or main branch.                                                       | No       |                               |
| `verbose`                                | Print verbose output. 0 for normal output, 1 for verbose output, and 2 for more verbose output.                                            | No       | 0                             |

## CLI Usage

This tool can be run from the command line.

Download source code and run:

```bash
deno task run help
```

to see the available commands.

## Handle Output Manually

When the `output-action` is set to `none`, the rendered images will not be pushed to the repository. You should handle them manually.

The action will store the rendered images in GitHub Actions' `output`, which can be accessed by the `steps.<id>.outputs` variable. The output filename is used as the key.

Here is an example:

```yaml
steps:
  - uses: actions/checkout@v3

  - uses: Wybxc/github-stats@main
    id: stats
    with:
      token: ${{ secrets.GHTOKEN }}
      github-username: wybxc
      output-action: none
  
  - name: save output
    run: |
      cat <<- EOF > github-stats.svg
      ${{ steps.stats.outputs['github-stats.svg'] }}
      EOF
      
  - name: show output
    run: cat wakatime-stats.svg
```

## Acknowledgements

Thanks for the following repositories that inspired this project:

- [anuraghazra/github-readme-stats](https://github.com/anuraghazra/github-readme-stats)
- [lowlighter/metrics](https://github.com/lowlighter/metrics)