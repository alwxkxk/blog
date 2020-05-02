---
title: a-模型拆解效果
toc: true
abbrlink: 2544
date: 2020-04-12 18:07:32
tags:
---


## 效果
&emsp;这是3D可视化教程系列的文章，如果第一次阅读请先阅读[《3D可视化教程导读》](/posts/30679)，这里展示简单的模型拆解效果，可访问[a-dismantling 展示网址](http://3d.scaugreen.cn/a-dismantling.html)：
<img alt="3D模型拆解" src="/blog_images/3d/3D模型拆解2.gif">

&emsp;华为的网站上也有这种拆解效果，比我做的例子好看多了（毕竟我的模型是网上找的，该模型的物体分组有点问题，而我又懒得自己做一个，这个问题并不影响大家学习。），原理基本上是一样的，可以看：[华为服务器拆解效果](https://support.huawei.com/onlinetoolweb/server-3D/res/server/1288hv5/index.html?lang=cn)

## 原理
&emsp;拆解模型的原理就在于，让各模型向不同方向移动。
&emsp;移动时当然是一个过程，不是“瞬间移动到另一个位置”一个瞬间事件，而是“慢慢地从这个位置移动到另一个位置上”由多个瞬间事件组成的渐变过程。使用tween库能很方便实现这种渐变过程，比如从0到1，它会自动拆成"0,0.12,0.22,0.33 .... 0.99,1"，多个瞬间事件，在回调里改变对应的位置即可：
```js
// 移动函数
function move(obj,position) {
  new TWEEN.Tween(obj.position)
      .to(position, 1000)
      .onUpdate(function (val) {
        obj.position.set(val.x || 0, val.y || 0, val.z || 0);
      })
      .start();
}

```
&emsp;在模型上，必须是一个包含若干个“最小单元”的模型，
<img alt="最小单元模型" src="/blog_images/3d/最小单元模型.png">
&emsp;可以看到，这个机箱的3D模型是包含了若干个“最小单元”的模型，使用`scene.getObjectByName("Object_7")`就能得到`Object_7`这个模型，再设置其位置属性就可以实现位置变化`obj.position.set(x,y,z)`。最后让各个模块向各个方向移动即可做到拆解效果：

```js

// 拆解按钮
document.getElementById("dismantling").onclick=()=>{
  move(scene.getObjectByName("Object_7"),{x:-5});
  move(scene.getObjectByName("Object_18"),{x:-5});

  move(scene.getObjectByName("Object_10"),{x:5});
  move(scene.getObjectByName("Object_11"),{x:5});
  move(scene.getObjectByName("Object_17"),{x:5});

  move(scene.getObjectByName("Object_27"),{z:5});
  move(scene.getObjectByName("Object_29"),{z:5});

  move(scene.getObjectByName("Object_14"),{z:-5});
  move(scene.getObjectByName("Object_16"),{z:-5});

  move(scene.getObjectByName("Object_28"),{y:2});
};

```
&emsp;拆解效果至此就完成了，十分简单。

## 其它
&emsp;整个项目还用到其它功能，在three example上都能找到例子，不再细说，点右下角可以看到源码:
- 用于实现移动视角的[orbitControl](https://threejs.org/examples/?q=orbi#misc_controls_orbit)
- 用于识别选中物体的[raycast](https://threejs.org/examples/?q=raycas#webgl_instancing_raycast)
- 用于描边物体的[outline](https://threejs.org/examples/?q=outline#webgl_postprocessing_outline)
- 显示物体名称的原理是：如果检测到选中物体，就修改HTML对就的样式与内容：
```html
		<style>
			#name-box{
				position:absolute;
				color: white;
				background-color: rgba(15, 15, 200, 0.774);
				font-size: 32px;
				font-weight: 600;
				pointer-events: none;
				padding: 15px;
				border-radius: 10px;
			}
		</style>

<div id="name-box">test</div>
```
```js
const nameBox = document.getElementById("name-box");
// 名称提示
nameBox.innerHTML = intersection[0].object.name.replace("Object_","零件");
nameBox.style.display = "block";
nameBox.style.top = mousePosition.y; // 跟随鼠标的位置
nameBox.style.left = mousePosition.x + 30;
```

## 源码及3D项目文件
&emsp; 源码及工程项目都放到github上。
&emsp; 源码：[threejs-example](https://github.com/alwxkxk/threejs-example)
&emsp; Blender工程项目：[threejs-example-blender-project](https://github.com/alwxkxk/threejs-example-blender-project)。




## 附录
- 这个模型下载于[Pc Gaming Ryzen Nvidia 1660 - Sketchfab](https://sketchfab.com/3d-models/pc-gaming-ryzen-nvidia-1660-a8477b1bcafa46ffb66af25e287fd098)，原文件并不太好（各物体是乱拆的，模型文件太大），我对它做了一些修改优化。
