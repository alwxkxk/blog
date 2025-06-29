---
title: Macos使用Electron无法打包windows平台软件
toc: true
date: 2025-06-29 09:48:11
tags:
---

&emsp;最近研究在Macos上使用Electron打包win平台的软件，折腾了大半天，总是报错，看了一下github上的讨论，说在Macos打包windows平台的软件，不太行，从23年起就讨论到25年中还是没解决。解决的办法是，推荐在window上开发。


## 附录
- [Unable to makes squirrel distributable for win32/arm64 on macos](https://github.com/electron/forge/issues/3142)