---
title: 记录一次三维模型stp转glb
toc: true
abbrlink: 10771
date: 2024-05-24 09:54:14
tags:
---

&emsp;帮公司工作期间，别人公司提供一个stp三维文件，需要我调整加载到网络里。
&emsp;我本来打算先用freeCAD打开文件，转成fbx格式，再导入到blender转出glb格式。发现freeCAD打开直接报错，`<class 'RuntimeError'>: Illegal storage access! Please save your work under`，怀疑是文件是不是不完整或者什么的，寻思先找个软件能打开查看再说。使用STP Viewer打开发现直接内存溢出了。用CAD Assistant打开也是报错。各种搜索解决方案，用vscode打开这个stp文件，发现里面的信息是autodesk的，所以寻思这个文件应该是用autodesk编辑导出的，可能里面含有特别的东西导致别的软件打开会异常，用它家的软件大概率正常。于是我下载了个人免费版的Autodesk Fusion来打开，终于能打开了。
&emsp;完成第一步，能打开文件说明至少完整。后续就是转格式的问题了，Autodesk Fusion里能导出fbx，于是我导出一下。导出发现那文件根本用不了，其它格式倒是能用，但是不含颜色我就无能为力了，不是我想要的东西。后来我灵光一现，我用Autodesk Fusion把这个stp文件再导出一次stp文件（因为我怀疑有没有可能是旧软件的问题，新软件重新导出符合正常格式了），然后再使用CAD Assistant打开新的stp文件，确实能打开。并顺利使用CAD Assistant另存为glb格式，历时大半天最终解决问题。


## 附录
[CAD Assistant](https://www.opencascade.com/products/cad-assistant/)