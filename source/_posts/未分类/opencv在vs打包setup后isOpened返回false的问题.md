---
title: opencv在vs打包setup后isOpened返回false的问题
toc: true
abbrlink: 63764
date: 2023-01-01 16:26:10
tags:
- opencv
- c++
img: /blog_images/未分类/opencv打包需要额外带的dll.webp
---


## 现象与解决
开发环境：opencv4.6 , vs 2022。本地开发调试时打开视频是正常的：

```cpp
VideoCapture cap;
cap.open(path);
if (!cap.isOpened()) { // check if we succeeded
    std::cerr << "Couldn't open capture." << std::endl;
    return -1;
}
```

但是经过Microsoft Visual Studio Installer Projects打包出来的程序，安装到别的电脑的时候，发现isOpened会返回false。在自己的开发电脑上安装是正常能用的。经搜索，排查尝试，初步估计是别的电脑上没有`opencv_videoio_ffmpeg460_64.dll`的问题。于是在我自己的开发电脑上，把Path里的opencv路径删除（D:\opencv\build\x64\vc15\bin），再次运行程序，确认重现bug，并把`opencv_videoio_ffmpeg460_64.dll`放到安装目录下，又恢复正常。到这里，就明白了，是需要把`opencv_videoio_ffmpeg460_64.dll`这个文件也打包到程序安装包中。

![opencv打包需要额外带的dll](/blog_images/未分类/opencv打包需要额外带的dll.webp)

 
至于为什么opencv这么坑爹，不在程序中提示缺失`opencv_videoio_ffmpeg460_64.dll`而是单纯地让isOpened返回false，确实很迷。我c++的经验还不足以继续研究这个问题，等我经验够了这个问题应该自然就懂了，后续再补充原因说明吧。

## 附录
- [Python27+Opencv3 VideoCapture FALSE问题记录](https://blog.51cto.com/guoeric/1852615)
- [stack overflow - OpenCV 2.4 VideoCapture not working on Windows](https://stackoverflow.com/questions/11699298/opencv-2-4-videocapture-not-working-on-windows)
- [Microsoft Visual Studio Installer Projects 2022的安装与使用](https://www.cnblogs.com/jiayezi/p/15740161.html)