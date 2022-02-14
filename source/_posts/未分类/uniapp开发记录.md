---
title: uniapp开发记录
toc: true
abbrlink: 45153
date: 2022-02-10 10:06:09
tags:
---


## 问题记录
&emsp; HBuilder X 3.3.10 开发时发现，网页发出请求正常，但手机发出的请求不正常且报错：
```
Error: [JS Framework] Failed to receiveTasks, instance (9) is not available.
```
&emsp;在[dcloud论坛](https://ask.dcloud.net.cn/question/72988)里找到，是网络问题，因为我网页连的是本地的WIFI，请求的是局域网的IP地址，而调试手机时没有连WIFI，所以找到不到这个地址所导致的报错。（这报错信息太迷了，没人能想到是这网络问题。）


