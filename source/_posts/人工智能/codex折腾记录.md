---
title: codex折腾记录
toc: true
abbrlink: 55249
date: 2025-12-07 09:41:01
tags:
---
&emsp;我的开发环境是mac os。

## 注意版本号
&emsp;由于codex更新很频繁，发现很多功能是不行的。遇到解决不了的问题需要关注一下版本号与issue。
&emsp;本来想折腾一下[spec-kit](https://github.com/github/spec-kit)，发现 codex IDE 扩展还不支持自定义命令，转而折腾codex cli。
&emsp;用`npm i -g @openai/codex`装不动，看到允许用`brew install codex`，折腾了好久，还是不行，发现其版本太旧。（通过brew安装的版本显示是`0.1.2505191453`，这代表是25年5月的版本。）
&emsp;所以又折腾回去用npm安装，想起可以有国内代码，用`npm i -g @openai/codex --registry=https://registry.npmmirror.com`，确实安装得很快。
&emsp;但奇怪的是，折腾了半天第三方api，都连不上，又重新研究了[issue](https://github.com/openai/codex/issues/7051)，发现从0.59开始版本有bug，配置的第三方的base_url不生效。
&emsp;于是退回旧版本,`npm install -g @openai/codex@0.58 --registry=https://registry.npmmirror.com`最终折腾成功，能连上第三方api了，并且能显示出speckit所生成的指令prompts。
&emsp;事实证明，新玩意还得关注版本号，日志没把baseUrl记录下来真的很浪费时间，准备折腾[litellm](https://github.com/BerriAI/litellm)。