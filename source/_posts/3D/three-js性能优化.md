---
title: three.js性能优化
toc: true
abbrlink: 5200
date: 2020-06-01 19:21:12
tags:
- three.js
- 3D
---

&emsp;当发现画面掉到30帧以下，说明3D界面已经开始卡了，需要找到性能瓶颈进行优化。首先调用调试工具，进入`Performance`，抓一下各函数运行时间，看哪些函数占用大量时间，然后针对性地去优化。


## 技巧

### 少用光源与阴影 
&emsp;光源与阴影是很吃性能的，因为这些都需要大量计算渲染出来。

### 减少渲染点
&emsp;对于相同的物体，在blender使用复制连接(`Alt+d`)，threejs中使用`InstancedBufferGeometry`。

### 排查材质
&emsp;可以使用这办法，将所有材质替换掉，MeshBasicMaterial是性能最好的材质，如果发现掉帧得利害，使用这办法能正常，说明是GPU瓶颈
```js
scene.overrideMaterial = new THREE.MeshBasicMaterial( { color: 'green' } );
```

### LOD 
&emsp;根据距离来渲染不同的材质，只有靠近的时候才渲染高清的。LOD (Level Of Detail) object stores different objects for different distance (for example, near, medium, and far)

### 及时释放资源
&emsp;不使用的资源要及时释放，防止内存泄露。
- [How to dispose of objects](https://threejs.org/docs/index.html#manual/en/introduction/How-to-dispose-of-objects)

### WebGL2
&emsp;WebGL2拥有更好的性能，但更少的浏览器支持。


### OffscreenCanvas
&emsp;利用worker来运算，更少的浏览器支持。
[Three.js OffscreenCanvas](https://threejsfundamentals.org/threejs/lessons/threejs-offscreencanvas.html)

## 附录
- [THE BIG LIST OF three.js TIPS AND TRICKS!](https://discoverthreejs.com/tips-and-tricks/)
- [unity 性能优化建议](https://docs.unity3d.com/Manual/OptimizingGraphicsPerformance.html)
