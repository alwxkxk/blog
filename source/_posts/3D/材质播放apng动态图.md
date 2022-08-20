---
title: 【3D】材质播放apng动态图
toc: true
abbrlink: 13044
date: 2022-08-03 15:20:07
tags:
---

&emsp;在3D场景中，经常出来动态图作为地板，来提升整体动态效果。

## 源码及3D项目文件
&emsp; 源码及工程项目都放到github上。
&emsp; 源码：[threejs-example](https://github.com/alwxkxk/threejs-example)

## 效果
&emsp; 可在线访问看效果[9-容量模式](http://3d.scaugreen.cn/apng-texture.html)。根据所设置百分比，用颜色填充物体的效果。


## 使用AE制作动态图
&emsp;AE制作的动画能导出视频或图片，无法直接导出gif。使用PS把导出的PNG图片转换成gif，则会颜色失真有显示的锯齿状,因为gif只有256颜色。考虑转换成apng[Apng在线转换工具](https://ezgif.com/apng-maker),[离线工具apngasm](http://apngasm.sourceforge.net/)，在线使用时注意参数的设置。导出后拉到浏览器验证这张apng图是否符合你的预期。
&emsp;经测试，21张图片转换成apng图片，空间从6M多变成5M多。

## 材质播放apng动态图
&emsp;three.js材质播放gif图片的demo比较少([THREE.ComposedTexture - play GIF, APNG etc as texture](https://discourse.threejs.org/t/three-composedtexture-play-gif-apng-etc-as-texture/12876))。原理就是，将动态图记录下来一张张图片，再给材质不断更新即可。我使用了[UPNG](https://github.com/photopea/UPNG.js)来解析apng。
&emsp;具体过程是通过xhr获取apng文件数据，再通过UPNG解析到的图片通过ImageData写到canvas里，进一步转换成texture：

```js
const apngUrl = "./static/img/apng.png";
var xhr = new XMLHttpRequest();
xhr.open("GET", apngUrl);
xhr.responseType = "arraybuffer";
xhr.onload = function () {
    console.log("xhr",xhr);
    const imgObj = UPNG.decode(xhr.response);
    console.log(imgObj) ;
    const rgbaList = UPNG.toRGBA8(imgObj); 

    const maxIndex = rgbaList.length;
    // const imageDataList = [];
    const textureList = [];
    for (let i = 0; i < maxIndex; i++) {
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");

			// 将每一像素点画上去，每一像素四位数。
			// https://jameshfisher.com/2020/03/01/how-to-write-an-arraybuffer-to-a-canvas/
			// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas

			ctx.canvas.height = imgObj.height;
			ctx.canvas.width = imgObj.width;

			const imageData = new ImageData(new Uint8ClampedArray(rgbaList[i]), imgObj.width, imgObj.height);
			// imageDataList.push(imageData);
			ctx.putImageData(imageData, 0,0);
			const texture = new THREE.CanvasTexture(ctx.canvas);
			textureList.push(texture);
    }
    console.log("textureList",textureList);
		const pGeometry = new THREE.PlaneGeometry( 5, 5);
		const pMaterial = new THREE.MeshBasicMaterial( {
			map:textureList[0],
			transparent: true,
			side: THREE.DoubleSide,
		} );
		const plane = new THREE.Mesh( pGeometry, pMaterial );
		plane.rotation.set(Math.PI*0.5,0,0);
		scene.add( plane );

		let index = 0;
		setInterval(() => {
				// 每0.1S 移动一帧
				pMaterial.map = textureList[index];
				pMaterial.needsUpdate = true;
				index +=1;
				if(index>=rgbaList.length){
						index = 0;
				}
		}, 100);

};
xhr.send();


```

## 其它讨论

### 将gif转换成雪碧图
&emsp;在之前的[5-显示动态图](/posts/52736)讨论，其实是利用雪碧图来实现动态效果。gif图可经通过工具转换成雪碧图：[convert-gif-to-sprite](https://onlinegiftools.com/convert-gif-to-sprite-sheet)。但雪碧图的体积会比gif图片会大一些。

### 播放视频的材质
&emsp;与播放gif类似，可以播放视频。但mp4格式不支持透明，以及视频自动播放受浏览器限制。优点是视频格式的文件是比图片的少很多，这是视频格式存放时是转码后的数据（记录每一帧的变化，而不是记录每一张图片，所以文件少很多），播放时需要解码。
&emsp;视频播放可参考：[threevideodemo](https://gist.github.com/ErikPeterson/b1db23f83b9ca7904bbf)。由于chrome浏览器的限制，用户必须先点一下页面才能播放视频，所以代码有两个处理，一是尝试自动播放，二是用户点击后先检测视频有没有播放，若没有则再次触发播放。
```js
    const video = document.createElement('video')
    let playFlag = false
    video.src = 'static/floor.mp4'
    video.loop = true
    video.load()

    video.play().catch(() => {
        // 尝试自动播放失败
      console.log('等待用户点击再播放视频')
    })

    container.addEventListener('mousedown', () => {
      if (!playFlag) {
        playFlag = true
        // 点击后播放
        video.play()
      }
    })

    video.addEventListener('play', (event) => {
      playFlag = true
      console.log('视频成功播放')
    })

```


## 附录
- [AE教程 | 几种科技感特效的制作方法](https://www.bilibili.com/video/BV1FW411n7DV?spm_id_from=333.337.search-card.all.click&vd_source=b5ac546db9e617edaa22905cc06c353c)
- [Does VideoTexture support the MOV file format?](https://discourse.threejs.org/t/does-videotexture-support-the-mov-file-format/29292)
- [Apng/Webp导出方法](https://www.cnyisai.com/48045.html)
- [MDN-canvas像素操作](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas)

