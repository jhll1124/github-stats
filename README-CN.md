# github-stats

使用Github Actions为你的github readmes生成统计信息。

## 示例

![GitHub Stats](https://raw.githubusercontent.com/Wybxc/metrics/main/github-stats.svg)

![Wakatime](https://raw.githubusercontent.com/Wybxc/metrics/main/wakatime-stats.svg)

## 用法

设置一个GitHub Actions，定期运行并将生成的图像推送到存储库中。

### 第1步：创建一个 GitHub 个人令牌

在账户设置的 `Developer settings`中，选择 `Personal access tokens`来创建一个新的令牌。

之后，将该令牌添加到你的仓库 secrets 中。命名为`GHTOKEN`或别的名字。

### 第二步：设置 GitHub Actions 工作流

创建一个新的工作流并粘贴以下内容。

```yaml
name: Stats

on:
  # 每天更新
  schedule: [{cron: "0 0 * * *"}]
  # (可选) 当推送到 master/main 分支时运行
  push: {branches: ["master", "main"]}
  # 添加 workflow_dispatch 来手动触发
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

等待工作流程完成，并在存储库中检查生成的图像。

## 配置

| 选项                                     | 描述                                                         | 是否必需 | 默认                          |
| ---------------------------------------- | ------------------------------------------------------------ | -------- | ----------------------------- |
| `token`                                  | GitHub个人访问令牌。                                         | 是       |                               |
| `github-username`                        | 你的github用户名。当此选项存在时，github用户的统计信息将被呈现。 | 否       |                               |
| `github-output-filename`                 | 输出svg文件的文件名。                                        | 否       | `github-stats.svg`            |
| `github-image-width`                     | 图像的宽度。                                                 | 否       | 495                           |
| `github-card-title`                      | github统计卡的标题。                                         | 否       | `<username>'s GitHub Stats`   |
| `github-include-collaborated-stargazers` | 包括来自你是合作者的仓库的星星。                             | 否       | true                          |
| `github-only-last-year`                  | 只显示去年的统计信息。                                       | 否       | false                         |
| `github-hide-stat-items`                 | 隐藏指定的统计项。接受的值是 "stars"、"commits"、"prs"、"issues"和 "contributions"。用逗号(,)或换行符分割。 | 否       |                               |
| `wakatime-username`                      | 你的wakatime用户名。当此选项存在时，将呈现wakatime的统计信息。 | 否       |                               |
| `wakatime-output-filename`               | 输出的svg文件的文件名。                                      | 否       | `wakatime-stats.svg`          |
| `wakatime-image-width`                   | 图像的宽度。                                                 | 否       | 495                           |
| `wakatime-compact-layout`                | 使用紧凑布局。                                               | 否       | false                         |
| `wakatime-card-title`                    | wakatime统计卡的标题。                                       | 否       | `<username>'s Wakatime Stats` |
| `wakatime-max-languages-count`           | 要显示的最大语言数。当小于1时，将显示所有语言。              | 否       | 0                             |
| `wakatime-hide-languages`                | 隐藏指定的语言。用逗号(,)或换行符分割。                      | 否       |                               |
| `output-action`                          | 输出动作，可选值为'commit'（生成的图片将被推送到版本库）或'none'（不做任何事情）。 | 否       | `commit`                      |
| `repo`                                   | GitHub 仓库，用于提交渲染的图片，例如：`Wybxc/github-stats`。默认是使用该动作的仓库。 | 否       |                               |
| `branch`                                 | 用于提交渲染图片的分支，例如主分支。默认是主分支或主分支。   | 否       |                               |
| `verbose`                                | 打印粗略的输出。0表示正常输出，1表示粗略输出，2表示更粗略的输出。 | 否       | 0                             |

## CLI用法

这个工具可以从命令行运行。

下载源代码并运行

```bash
deno task run help
```
来查看可用的命令。

## 手动处理输出

当 "output-action "设置为 "none "时，渲染的图像不会被推送到版本库中。你应该手动处理它们。

该动作将把渲染后的图片存储在GitHub Actions的`output`中，可以通过`steps.<id>.output`变量访问。输出的文件名被用作键。

下面是一个例子。

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

## 鸣谢

感谢以下项目，它们给了这个项目启发和参考：

- [anuraghazra/github-readme-stats](https://github.com/anuraghazra/github-readme-stats)
- [lowlighter/metrics](https://github.com/lowlighter/metrics)
