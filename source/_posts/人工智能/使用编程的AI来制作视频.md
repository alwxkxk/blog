---
title: 使用编程的AI来制作视频与三维模型
toc: true
abbrlink: 15215
date: 2026-10-04 18:03:54
tags:
img: /blog_images/AI/AI建模-广州塔.webp
---

&emsp;视频制作的大模型一般是扩散模型（Diffusion Models），而编程的大模型一般是LLM（Large Language Models）,前者通常比较贵，而后者经常有免费的公益站。
&emsp;最近claude opus 5.5出来后，论坛上惊叹其制作视频的功能，我也简单测试了一下，发现LLM还确认可以通过编程来制作视频，使用了Remotion方案，只需要几美元（公益站的LLM，实质上没花钱）就可以制作出一个小视频来，我的测试视频效果如下：

<iframe src="//player.bilibili.com/player.html?bvid=BV1YyaH6eEnv&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" class="bilibili-video"> </iframe>

&emsp;这完全打开了新思路，这LLM完全可以通过编程来制作视频，而且成本很低。
&emsp;继而使用AI测试制作模型，使用[cli-anything-blender](https://github.com/HKUDS/CLI-Anything/tree/main/blender/agent-harness/cli_anything/blender)作为skill，让AI制作一个广州塔模型，效果很不错，比制作视频还要惊艳，这放以前，要这些好的模型不得付费购买。(几美元的token费用，继续白嫖公益站，没花钱。)
![AI建模-广州塔](/blog_images/AI/AI建模-广州塔.webp)
&emsp;现在给我的感觉就像 __“一切皆文本”__，后续LLM所利用的文本能做一切的东西。
