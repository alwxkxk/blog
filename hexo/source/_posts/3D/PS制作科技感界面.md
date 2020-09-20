---
title: PS制作科技感界面
toc: true
abbrlink: 47064
date: 2020-09-13 15:47:44
tags:
---

&emsp;科技感界面主要的特点是：偏深暗色的背景，机甲风格几何图形，光感效果，全息投影的虚幻感。其中机甲风格几何图形，光感效果，利用PS能简单地制作出来。
&emsp;前期可以去设计类网站找几个喜欢的设计稿来模仿学习如[优设网](https://www.uisdc.com/)，[Behance](https://www.behance.net/)，Behance可能需要翻墙。

## 颜色选定
&emsp;首先要挑几个主色与辅助色定下来，在主色的基础上调整其透明度、亮度来衍生出一系列颜色形成整体风格。比如说挑深暗蓝与亮浅蓝作为主色，辅助色包含一些字体颜色（偏白、灰）、正常用的绿色、预警用的橙黄、亮红等等。

## 制作六角形图标
&emsp;六角形图标很符合机甲风格，首先去[iconfont 阿里巴巴图标库](https://www.iconfont.cn/collections)下个图标，然后再利用PS套一个六角形外壳，如视频操作所示：

<video class="lazy" controls data-src="https://test-1251805228.file.myqcloud.com//3D/PS%E5%88%B6%E4%BD%9C%E5%85%AD%E8%BE%B9%E5%BD%A2%E5%9B%BE%E6%A0%87.mp4" controls="controls" style="max-width: 100%; display: block; margin-left: auto; margin-right: auto;">
your browser does not support the video tag
</video>


&emsp;注意导出png格式的文件，这样图片才有透明度，CSS上可以这样配置：
```css
.icon{
  background-image: url('./list-icon.png');
  background-size: contain;
  height: 5em;
  width: 5em;
}
```

## 光感效果
&emsp;光感效果（内发光，外发光，点高光，渐变色）也是重要效果，也是在混合选项里就可以调出来。这些效果除了点高光在CSS里做比较烦恼些，其它都很容易做出来。PS里点高光可以使用画笔画一点，调整尺寸压平，放到边框上，就能做出点高光效果。一般PS里只放一个比较透明的底色，而内发光，外发光，渐变色则自行利用CSS来控制。
&emsp;CSS中内发光：`box-shadow: 0px 0px 16px #00ffff96 inset;`

## 利用CSS实现响应式
&emsp;要想将背景图片变成响应式，算出图片的高宽比，比如说我绘制了一张480*360的图片，高宽比为3:4，那么使用时CSS保证其是3:4就能保证利用CSS实现图片响应式缩放，代码如下：

```css
  .board{
    width: 20vw;
    height: 15vw;
    background-image: url('/static/img//board.png');
    background-repeat: no-repeat;
    background-size: cover;
  }
```


## 附录

- [B站-数据可视化界面设计-李晰岩](https://m.bilibili.com/video/BV1VZ4y1K7YM?p=3&share_medium=android&share_plat=android&share_source=WEIXIN_MONMENT&share_tag=s_i&timestamp=1599985219&unique_k=9xAO7J)

