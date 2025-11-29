---
title: codex调用第三方api
toc: true
abbrlink: 45588
date: 2025-11-29 15:21:17
tags:
img: /blog_images/AI/头像建模.webp
---
&emsp;部分网址需要有科学上网。
&emsp;25年11月，谷歌发布Antigravity编辑器，我意识到使用AI来控制浏览器编程前端将在不久的将来会广泛使用。Mac电脑卡在登陆跳转回编辑器没响应，没解决成功。windows电脑倒是成功登进去了，但我现在主力电脑是Mac，所以就去研究别的，发现codex好像也不错。
&emsp;[codex](https://openai.com/codex/)就是OpenAi搞的（ChatGPT就是他家大模型），注册后（不使用他们的模型接口，其实也不需要注册。可以直接配置第三方接口）并在vscode安装codex插件，开始配置使用第三方api。

## 先使用cherry studio测试
&emsp;在调试codex之前，我先使用AI客户端 [cherry studio](https://www.cherry-ai.com/)调用了下面的那些第三方api接口，先确保接口是有效的。测试期间我生成了之前很火的建模图：
![头像建模](/blog_images/AI/头像建模.webp)


## openRouter
&emsp;openRouter是我第一个测试成功的api接口商。
&emsp;使用[openrouter](https://openrouter.ai/)的接口配置如下，先注册一个号[注册教程](https://zhuanlan.zhihu.com/p/1898753591528908109)，并生成key，测试时好像是可以不用充钱，直接找个free结尾的模型来测试。（我是通过支付宝充了11美元，用来提升免费接口的使用额度。）
&emsp;使用[cc-switch](https://github.com/farion1231/cc-switch)来切换codex的api与模型，[使用教程](https://zhuanlan.zhihu.com/p/1973322984304427082)。切换成功后，能看到codex的配置是被它修改了的：
![codex配置第三方api](/blog_images/AI/codex配置第三方api.webp)
&emsp;这是当前(25年11月)我日常使用的模型，测试没问题：
```config.toml
model_provider = "openrouter"
model = "x-ai/grok-4.1-fast:free"
model_reasoning_effort = "medium"
disable_response_storage = true

[model_providers.openrouter]
name = "openrouter"
base_url = "https://openrouter.ai/api/v1"
wire_api = "responses"
requires_openai_auth = true
```
&emsp;每次修改base_url需要退出vscode重启codex才生效，其它修改模型与等级的可以直接编辑修改生效。

## new api
&emsp;有很多大佬提供免费的公益api供大家免费使用，不保证稳定性与长久性。当前在[L站](https://linux.do/)有很多公益站，都是基于new-api来搭建的。其中有一个据说持续时间最久的[薄荷公益站](https://linux.do/t/topic/1170760)([L站主贴](https://linux.do/t/topic/1170760),注意分组规则，新用户低等级的用户被限制使用一些模型)，我就尝试对接了一下codex调用，折腾了好久才对接成功（主要是因为我从openRouter的配置拷下来修改）。总结下来就是，主要的注意事项是看`wire_api = "chat"`还是`wire_api = "responses"`。
&emsp;如果提示：
`unexpected status 404 Not Found: {"error":{"message":"Invalid URL (POST /v1/chat/completions/responses)","type":"invalid_request_error","param":"","code":""}}`
，可以注意到是因为这个请求url是有问题的，正常是要么`/v1/chat/completions`，不会拼上`/responses`的，所以修改成了`base_url = "https://x666.me/v1"`
&emsp;如果提示：
`unexpected status 401 Unauthorized: {"error":{"code":"","message":"未提供令牌 (request id: ...)","type":"new_api_error"}}`
说明权限不行，我查了一下接口文档，应该是header要带令牌，修改`http_headers`后测试成功，我的配置：
```config.toml
model_provider = "x666"
model = "gemini-2.5-flash"
model_reasoning_effort = "medium"
disable_response_storage = true

[model_providers.x666]
name = "x666"
base_url = "https://x666.me/v1"
wire_api = "chat"
http_headers = { "Authorization" = "Bearer xxx你的令牌xxx" }
requires_openai_auth = true
```

## Zenmux
&emsp;[Zenmux](https://zenmux.ai/invite/JN1XWW)是另一家类似于openRouter的api商家，__据说是国内的__。我也是折腾了好久，发现其文档[zenmux 关于codex配置](https://docs.zenmux.ai/zh/best-practices/codex.html)有介绍，配置是这样的：`base_url = "https://zenmux.ai/api/v1"`。最终才测试成功。url填错，会提示404或者什么没有权限。

&emsp;在cherry studio里如果使用`google/gemini-3-pro-image-preview-free`的话，配置api url应该要配置成`https://zenmux.ai/api/vertex-ai`，我用它来测试了不少图片。

## 最后总结
1. 可以发现，三家api，在codex里配置，其后缀全是不一样的。
2. ai接口，还得要小心使用，不要在敏感的项目上使用，避免信息泄漏。
3. 暂时没找到codex，cherry studio调用第三方接口时所发出的请求日志。我准备用ai找找源代码里有没有写。
4. 我准备用ai来写一下完整项目来验证一下各项功能。

## 附录
- [Chat 与 Responses对比](https://help.apiyi.com/openai-responses-vs-chat-completions-api-guide.html)

