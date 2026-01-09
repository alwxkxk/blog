---
title: chrome-devtools-mcp折腾记录
toc: true
abbrlink: 14403
date: 2026-01-02 15:26:27
tags:
img: /blog_images/AI/使用AI工具.webp
---

&emsp;要想ai来辅助开发前端，能控制chrome就必不可少的，于是我研究了一下[chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp)。
&emsp;一开始我就复制了里面提供的一个参数来录到mcp router里，还额外添加了一个国内镜像源`--registry=https://registry.npmmirror.com`：
```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "chrome-devtools-mcp@latest",
        "--channel=canary",
        "--headless=true",
        "--isolated=true",
        "--registry=https://registry.npmmirror.com"
      ]
    }
  }
}
```

&emsp;安装顺利，于是我按文档里使用`Check the performance of https://developers.chrome.com`来测试功能，AI执行命令时卡住了：
```bash
• Called mcp_router.new_page({"url":"https://developers.chrome.com","timeout":30000})
  └ Could not find Google Chrome executable for channel 'canary' at:
     - /Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary.
```
&emsp;折腾了好久，才发现他调用的是`Google Chrome Canary`，而我电脑使用的是`Google Chrome`，于是我额外安装了`Google Chrome Canary`。（备注：丝雀版（Canary），Chrome Canary每天自动更新一次，率先集成谷歌正在研发的实验性功能。苹果电脑安装：`brew install --cask google-chrome@canary` ）但用起来还是有点问题，这时我才注意mcp router里录的参数，一个`"--channel=canary"`，这个是标记使用`Google Chrome Canary`，如果不传或者传`"--channel=stable"`，那么就会正常调用`Google Chrome`。另一个参数`"--headless=true"`，这个意味着是命令模式，不会显示窗口，如果不传或者`"--headless=false"`就能正常看到AI是如何操控浏览器了，我就奇怪为什么总不弹窗操控。
&emsp;折腾了这么久，原来是传参的问题。