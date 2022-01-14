---
title: d-线框转换效果
toc: true
abbrlink: 3280
date: 2021-06-14 10:36:01
tags:
---


## 示例效果
&emsp;这是3D可视化教程系列的文章，如果第一次阅读请先阅读[《3D可视化教程导读》](/posts/30679)，这里展示简单的模型拆解效果，可访问[d-wireframe-transfer-effect 展示网址](http://3d.scaugreen.cn/d-wireframe-transfer-effect.html)：

## 源码及3D项目文件
&emsp; 源码及工程项目都放到github上。
&emsp; 源码：[threejs-example](https://github.com/alwxkxk/threejs-example)。
&emsp; 3D文件是直接使用three.js官方例子里的模型（跑动的马）。


## 原理
&emsp;根据[Youtube - Daily Blender Secrets - Wireframe Effect](https://www.youtube.com/watch?v=AnAJmChwxlM&list=PLNRLkZ_feZ5GOwl2EVFPsjc62EOU5UtMD&index=6)效果，跟着使用Blender实现了一下，本质就是多制作一个线框模型，再配合使用boolean modify来实现控制，特定时候原模型会被遮挡，线框模型会被显示。
&emsp;搜索了一下，three.js并没有相类似的boolean效果，本来想通过shader来实现，尝&&emsp;试一下发现并不太行（本身对shader开发也不会），但发现可以使用深度函数来实现。three.js相关教程会很少提及到这玩意，而在WebGL基础知识学习时，这是必然会提到的内容。在二维平面里绘制三维物体，必然会出现有些在前面的东西遮挡了后面的东西，那么渲染器会根据深度信息来判断，只有在前面的东西才会进行渲染，而被遮挡的物体（体现在要渲染的东西更深）则无需再渲染了，否则就出问题了(即本来被遮挡的东西被渲染到前面去了)。具体可参考WebGL教程：[WebGL 三维正射投影](https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-3d-orthographic.html)
&emsp;在深度判断上，默认是深度越小的代表越在前面，只会渲染前面的物体。但有时会有特殊的需求（为了追求各种视觉效果就会有各种特别的需求），比如说可以关闭深度检测，物体不管是否被遮挡都会被渲染。也可以反过来，选择深度大的渲染，即被遮挡的反而渲染出来。three.js里的depthFunc有几个值：`NeverDepth、AlwaysDepth、LessDepth、LessEqualDepth、EqualDepth、GreaterEqualDepth、GreaterDepth、NotEqualDepth`分别对应WebGL里的`gl.NEVER、gl.ALWAYS、...`

```js
switch ( depthFunc ) {
    case NeverDepth:
        gl.depthFunc( gl.NEVER );
        break;
    case AlwaysDepth:
        gl.depthFunc( gl.ALWAYS );
        break;
    case LessDepth:
        gl.depthFunc( gl.LESS );
        break;
    case LessEqualDepth:
        gl.depthFunc( gl.LEQUAL );
        break;
    case EqualDepth:
        gl.depthFunc( gl.EQUAL );
        break;
    case GreaterEqualDepth:
        gl.depthFunc( gl.GEQUAL );
        break;
    case GreaterDepth:
        gl.depthFunc( gl.GREATER );
        break;
    case NotEqualDepth:
        gl.depthFunc( gl.NOTEQUAL );
        break;
    default:
        gl.depthFunc( gl.LEQUAL );
}
```

&emsp;最终核心代码，本质就是做两个模型，一个是原模型，另一个是线框模型，特别地还放一个透明的遮挡模型，当遮挡模型移动时，原模型被档住不渲染（默认的），而线框模型被遮挡后反而需要渲染，所以修改其depthFunc为`GreaterDepth`。另外还要提一下，深度是取决于物体与摄像头之间的距离，所以移动摄像头到特定角度时会出现其它效果，本质就是深度值变化了：
```js
const loader = new GLTFLoader();
loader.load( "./static/3d/Horse.glb", function ( gltf ) {
  const horse = gltf.scene.children[0]
  horse.scale.set(0.01,0.01,0.01)
  
  const horse2 = horse.clone()
  horse2.material = horse.material.clone()

  horse.material.depthWrite = false
  horse.material.transparent = true


  // horse2.position.set(1,0,0)
  horse2.scale.set(0.0099,0.0099,0.0099)
  horse2.material.depthFunc = THREE.GreaterDepth;
  horse2.material.wireframe = true
  horse2.material.transparent = true

  scene.add( horse );
  scene.add( horse2 );
  // 利用不同的深度计算方法来实现类型于blender里的boolean效果，但并非所有角度都可行。
  const cubeGeometry = new THREE.BoxGeometry( 3, 6, 2 );
  const maskMaterial = new THREE.MeshBasicMaterial({color:0x000000})
  maskMaterial.opacity = 0
  // maskMaterial.opacity = 0.2
  const maskCube = new THREE.Mesh( cubeGeometry,maskMaterial );
  maskCube.position.set(0,0,5);
  scene.add( maskCube );

  setInterval(() => {
    maskCube.position.z -= 0.1
    if(maskCube.position.z<-3){
      maskCube.position.z = 5
    }
  }, 50);
} );

```

## 附录 
- [Youtube - Daily Blender Secrets - Wireframe Effect](https://www.youtube.com/watch?v=AnAJmChwxlM&list=PLNRLkZ_feZ5GOwl2EVFPsjc62EOU5UtMD&index=6)
- [WebGLRenderingContext.depthFunc() - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/depthFunc)
- [WebGL 三维正射投影](https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-3d-orthographic.html)