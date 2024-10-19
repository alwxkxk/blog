---
title: unity3D安装GLTF加载器
toc: true
abbrlink: 34437
date: 2024-02-03 20:47:05
tags:
img: /blog_images/3d/交互式计算机图形学.webp
---

&emsp;unity3D 软件默认不能加载gltf/glb文件格式的，需要额外安装插件：[UnityGLTF](https://github.com/KhronosGroup/UnityGLTF.git)。按它的操作来发现，总是装不上，看报错信息提示github 443超时了，所以我又转去研究让unity3D使用代理软件来访问网络。
&emsp;折腾了几下各种设置环境变量，按[官方文档-解决网络问题](https://docs.unity3d.com/cn/2021.3/Manual/upm-config-network.html#Hub)配置了一个启动脚本`start-unity.cmd`：
```cmd
@echo off
set HTTP_PROXY=http://127.0.0.1:1081
set HTTPS_PROXY=http://127.0.0.1:1081
start "" "D:\Program Files\Unity Hub\Unity Hub.exe"
```

&emsp;发现unity hub页面又卡在启动页面里，查看日志(C:\Users\suxiqiang\AppData\Roaming\UnityHub\logs)里提示：
`{"timestamp":"2024-02-03T11:53:14.935Z","level":"error","moduleName":"LicensingSdkService","message":"[ 'LicensingSDK is accessed but has not been initialized yet!' ]"}` 感觉还是有问题，看文档说明，好像还需要配置证书，于是我又在对应的路径上创建了`upmconfig.toml`，把我代理软件用到的证书perm内容给进去。重启电脑又就正常进入了(之前我折腾的时候就发现，全局设置环境变量也得要重启电脑才生效)。
&emsp;后续安装UnityGLTF就正常了。