---
title: 使用codex-app以及gtp-5.3-codex
toc: true
abbrlink: 4847
date: 2026-03-05 15:56:45
tags:
img: /blog_images/AI/GGBOOM公益站.webp
---

&emsp;一开始折腾codex cli不好用，后面使用claude code折腾测试一个小项目，总体感觉就是能用，Haiku模型一般般，高级模型就感觉有点贵。
&emsp;后续看到codex-app出来，以及到处传各种codex免费，L站大量codex公益(我使用的是GBOOM公益【已失效】)，我就尝试了一下,发现确实好用。

![GGBOOM公益站](/blog_images/AI/GGBOOM公益站.webp)


&emsp;这次是我首次使用大模型来处理旧项目（中大型）。
&emsp;针对中型项目，我制订了阅读计划：
```
请制作阅读该项目的计划表（尽量拆分成多步执行阅读，避免超出上下文,有是否完成标记），生成相关文件（文件放到/ai 下面），用于ai了解整个项目，为后续ai编写代码提供参考。
```
&emsp;不断地按计划来执行，输出了一堆阅读总结。

&emsp;针对大型项目，并没有全部阅读，而是用到哪里，就先阅读总结输出相关文档，再使用AI。比如说我要将echart 从4升级到6，先阅读总结相关使用echart的使用情况，制订升级计划。并且让AI帮我优化多图表性能，使用了一些之前我从来没见过的技巧（如果让我搜那肯定得折腾两三天，但AI凭强大的知识库半小时就搞出来了）。
&emsp;原本我以为AI处理旧项目时，会不如人意，但实际结果比我想象中要好得多，现在我已经离不开AI来写代码了。

## 总结
1. codex-app确实很适合并行多对话，并行处理多任务。
2. gtp-5.3-codex 确实好用，费用不高，好用且不贵，十分让人心动。（最新的gtp-5.4也同样出名）如果没有免费的资源公益站，我会更倾向于买codex而不是claude。

## 2026年4月更新
&emsp;26年4月开始已经不能用了，codex免费的资源比较动荡，经常需要换公益站。直到最后已经基本没有了，都靠旧法自已手搓号来CPA自己使用（自己也搓了三个给自己临时应急用，平时不用）。有一段时间使用了GLM5.1来供claude cli使用。
&emsp;后来刷贴发现any站不仅能提供claude，还能提供gtp-5.3-codex,我就配到CPA里，让codex app 使用上了。用了几天发现报错：

```json
{"error":{"message":"{\n \"error\": {\n \"message\": \"Missing required parameter: 'tools[15].tools'.\",\n \"type\": \"invalid_request_error\",\n \"param\": \"tools[15].tools\",\n \"code\": \"missing_required_parameter\"\n }\n}（traceid: ...） (request id:...)","type":"invalid_request_error","param":"","code":null}}
```
&emsp;刷贴别人讨论是因为MCP的原因，我找了半天发现codex app 自动更新了一个computer use的插件功能，我关闭后就恢复正常了。第二天codex app又自动更新了更多的插件，并且报错：


```json
{"error":{"message":"Invalid Value: 'tools.tool_search.description'. Server-executed tool_search does not accept a description. (request id: ...) (request id: ...)","type":"invalid_request_error","param":"tools","code":null}}
```
&emsp;我手动关了还是不行。最终我更新了codex cli并继续使用，暂时放弃使用codex app。

## 附录
- [佬们，any 站的 GPT 模型怎么调用啊？](https://linux.do/t/topic/2020243)
