---
title: codex折腾记录
toc: true
abbrlink: 55249
date: 2025-12-07 09:41:01
tags:
img: /blog_images/AI/使用AI工具.webp
---
&emsp;我的开发环境是mac os。

## 注意版本号
&emsp;由于codex更新很频繁，发现很多功能是不行的。遇到解决不了的问题需要关注一下版本号与issue。
&emsp;本来想折腾一下[spec-kit](https://github.com/github/spec-kit)，发现 codex IDE 扩展还不支持自定义命令，转而折腾codex cli。
&emsp;用`npm i -g @openai/codex`装不动，看到允许用`brew install codex`，折腾了好久，还是不行，发现其版本太旧。（通过brew安装的版本显示是`0.1.2505191453`，这代表是25年5月的版本。）
&emsp;所以又折腾回去用npm安装，想起可以有国内代码，用`npm i -g @openai/codex --registry=https://registry.npmmirror.com`，确实安装得很快。
&emsp;但奇怪的是，折腾了半天第三方api，都连不上，又重新研究了[issue](https://github.com/openai/codex/issues/7051)，发现从0.59开始版本有bug，配置的第三方的base_url不生效。(25年12月：0.77版本没有该问题)
&emsp;于是退回旧版本,`npm install -g @openai/codex@0.58 --registry=https://registry.npmmirror.com`最终折腾成功，能连上第三方api了，并且能显示出speckit所生成的指令prompts。
&emsp;事实证明，新玩意还得关注版本号，日志没把baseUrl记录下来真的很浪费时间，准备折腾准备折腾nginx配置（或OpenResty），代理转发一下,便能看清所发的url是否正确。

## 异常命令进入死循环刷token。
找不到文件，就一直执行，导致token一直在刷。
```
• Ran cat '>' my-code/test-code/AGENTS.md
  └ cat: >: No such file or directory
    cat: my-code/test-code/AGENTS.md: No such file or directory
• Ran cat '>' my-code/test-code/AGENTS.md
  └ cat: >: No such file or directory
    cat: my-code/test-code/AGENTS.md: No such file or directory
• Ran cat '>' my-code/test-code/AGENTS.md
  └ cat: >: No such file or directory
    cat: my-code/test-code/AGENTS.md: No such file or directory

```

当时每次请求都需要75K token，10分钟就刷掉了8M的token。如果我没注意到的话，就会刷掉不少钱了。（虽然我还在用免费的模型。）

当我问：
```
为什么cat: >: No such file or directory
      cat: my-code/test-code/AGENTS.md: No such file or directory.文件是存在的
```
它就在那里尝试：
```
• Explored
  └ List bim-unity-code
    Read AGENTS.md

• Ran echo 'Repository Guidelines'
  └ Repository Guidelines

• Ran echo '"Repository Guidelines" > my-code/test-code/AGENTS.md'
  └ "Repository Guidelines" > my-code/test-code/AGENTS.md

• Explored
  └ Read AGENTS.md

• Ran touch my-code/test-code/AGENTS.md
  └ (no output)

• Explored
  └ Read AGENTS.md

• Ran echo '"Repository Guidelines" > my-code/test-code/AGENTS.md'
  └ "Repository Guidelines" > my-code/test-code/AGENTS.md
```

又在那里死循环了，我手动测试了一下，这个命令才是可以的：
```
echo "Repository Guidelines" > my-code/test-code/AGENTS.md
```

可见如果大模型生成了一个 异常命令，真是很危险，轻则死循环消耗token，重则删除重要文件（已经上过新闻了）。

然后想起来可以通过mcp来避免这个文件操作不顺的问题，就安装了[DesktopCommanderMCP](https://github.com/wonderwhy-er/DesktopCommanderMCP)，就能正常读写文件了。（后续：DesktopCommanderMCP这个太大了装起来很麻烦，且发现docker方式执行起来命令显示文件创建了但文件目录里总找不到，定位不出问题无法解决，后改用更轻量的[filesystem](https://www.npmjs.com/package/@modelcontextprotocol/server-filesystem)）

后来发现，感觉就是大模型不够智能，使用别的更好的模型就没有这个问题。
