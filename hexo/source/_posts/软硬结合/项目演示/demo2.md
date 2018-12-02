---
title: demo2
toc: true
tags:
  - IOT
abbrlink: 64594
date: 2018-11-03 10:05:02
---
&emsp;demo1尽量追求简单入门，所以界面不好看（帅是第一生产力），性能也不足。先说说demo1的问题：
- 每次刷新页面才会显示最新的tick值。（讨论HTTP轮询以及websocket协议）
- 界面丑（优化并会引入图表库Echart，实现数据可视化）
- 硬件与服务器之间改用MQTT协议进行通信
- 引入数据库
&emsp;这个demo2估计需要比较长的时间进行准备，在此之前会讨论并解决以上问题。