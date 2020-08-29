---
title: b-智慧城市
toc: true
donate: true
abbrlink: 46791
date: 2020-07-04 09:21:28
tags:
---

## 示例效果
&emsp;这是3D可视化教程系列的文章，如果第一次阅读请先阅读[《3D可视化教程导读》](/posts/30679)，这里展示的项目效果可访问[b-city 展示网址](http://3d.scaugreen.cn/b-city.html)：
<img alt="3D模型拆解" src="/blog_images/3d/b-city.gif">


## 源码及3D项目文件
&emsp; 源码及工程项目都放到github上。
&emsp; 源码：[threejs-example](https://github.com/alwxkxk/threejs-example)。
&emsp; Blender工程项目：[threejs-example-blender-project](https://github.com/alwxkxk/threejs-example-blender-project)。


## 导入城市模型
&emsp;最好的城市模型效果应该是由设计师根据需求来亲自建模，然而我比较懒（程序员通病），找有没有办法能快速导入城市模型，效果差一些也没所谓。这个项目例子的城市模型是如何导入的，请参考[blender导入城市建筑(.rdc)](/posts/20949/)。
&emsp;导入模型后，自行编辑后，再次导出时特别注意，不要带材质，因为rdc文件自带的照片贴图会很大，可能就多占用几十M的空间（因为我们也不需要这些图片，所以也没必要带上白白占用大量空间）。
&emsp;为了让城市模型变得更科技感一些，我们改变了它的材质，偏暗蓝且带透明：

```js
const basicMat = new THREE.MeshBasicMaterial({
  opacity: 0.25 ,
  color:0x1f56b9,
  side: THREE.BackSide,
  transparent: true,
});

function change2BasicMat(object3d){
  object3d.traverse(item=>{
    if(item.material){
      item.material = basicMat;
    }
  });
}
```


## 光轨效果
&emsp;光轨效果是构建科技感的最重要最常见的效果，另开了一篇文章单独讲这个：[3-光线痕迹](/posts/5988)
&emsp;与该文章不同的是，这个项目光轨的模型不是通过JS生成的，而是在3D建模软件里建模的管道，JS给这些管道添加光流动的效果。在blender构建管道的例子：

<video class="lazy" controls data-src="https://test-1251805228.file.myqcloud.com//3D/blender%E5%88%B6%E4%BD%9C%E6%9B%B2%E7%BA%BF%E5%8F%98Mesh.mp4" controls="controls" style="max-width: 100%; display: block; margin-left: auto; margin-right: auto;">
your browser does not support the video tag
</video>

&emsp;制作曲线时你会发现，这曲线到底要怎么调？大家可以通过[The Bezier Game](https://bezier.method.ac/)这个在线学习网站学习练习一下，PS的钢笔工具。

## 动画(animate)
&emsp;在第一个演示项目里（[a-模型拆解效果](/posts/2544)），演示的是电器烟爆炸拆开的效果，里面的物体移动是通过JS来实现的。而在这里是通过在3D建模软件里制作动画，然后导出时带有动画数据，加载到three.js里运行即可。在这个项目里，电梯的上下移动就是通过动画导出实现的。动画的教程对应:[4-动画](/posts/60366)。
&emsp;为了让电梯的模型更突出，更有科技感，我给电梯模型添加了透明与浅蓝的边框：
```js
function change2LightBox(object3d) {
  const group = new THREE.Group();
  const lineMaterial = new THREE.LineBasicMaterial({color: 0x00FFFF});
  const boxMaterial = new THREE.MeshBasicMaterial({
    opacity: 0.1 ,
    color:0x00cccc,
    side: THREE.BackSide,
    transparent: true,
  });
  const geo = new THREE.EdgesGeometry(object3d.geometry);
  const line = new THREE.LineSegments( geo , lineMaterial);
  const box = new THREE.Mesh(object3d.geometry, boxMaterial);

  group
  .add(line)
  .add(box);

  group.position.set(object3d.position.x,object3d.position.y,object3d.position.z);
  group.rotation.set(object3d.rotation.x,object3d.rotation.y,object3d.rotation.z);
  group.scale.set(object3d.scale.x,object3d.scale.y,object3d.scale.z);

  object3d.parent.add(group);
  object3d.visible = false;
  return group;

}
```


## 告警图标
&emsp;在界面中，要想显示图标有两种方案，一种是在3D场景里画一个平板，贴上图片，这种的特点就是遵守“近大远小”的规则。另一种是使用HTML元素，让HTML元素跟踪指定的3D物体，特点是不会受限于“近大远小”，通过HTML、CSS实现起来、修改起来、绑定事件也比较方便。两种都有各自的使用场景，像告警图标的显示，一般都使用第二种方案。
&emsp;要想计算3D物体对应2D平面的坐标，一般就是投射的计算即可，然后计算出来的坐标改变HTML元素的坐标即可，这个计算在[6-屏幕坐标转换](/posts/56155)里讨论。

```html
		<style>
			.icon{
				width:36px;
				height:36px;
				position: absolute;
				cursor: pointer;
			}

			.twinkle {
				animation-name: twinkle-key;
				animation-duration: 1s;
				animation-iteration-count: infinite;
			}

			@keyframes twinkle-key{
				50%  {
					opacity: 0.5;
				}
			}

		</style>
<img id="warnIcon" alt="warn" class="icon twinkle" src="/static/img/warn.svg" >
```


```js

const animate = function () {
  //...
  // 更新图标坐标
  const road = scene.getObjectByName("road003");
  const position = getPosition(road);
  const iconElement = document.getElementById("warnIcon");
  iconElement.style.top = position.y;
  iconElement.style.left = position.x;
 // ...
};

const box3 = new THREE.Box3();
function getPosition(object3d) {
    const result= {};
    const widthHalf = window.innerWidth / 2;
    const heightHalf = window. innerHeight / 2;
    // 获取在3D空间里的坐标
    const vector = new THREE.Vector3();
    box3.setFromObject(object3d);
    box3.getCenter(vector);
    vector.project(camera);
    // 转换成平面坐标
    result.x = vector.x * widthHalf + widthHalf;
    result.y = -(vector.y * heightHalf) + heightHalf;
    return result;
}
```