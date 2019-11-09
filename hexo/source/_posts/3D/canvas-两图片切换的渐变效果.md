---
title: 'canvas:两图片切换的渐变效果'
toc: true
tags:
  - canvas
abbrlink: 20665
date: 2019-09-07 16:13:21
---

## 效果及代码
&emsp;canvas两图片切换的渐变效果如下：
<img alt="canvas两图片切换的渐变" src="/blog_images/canvas两图片切换渐变效果.gif" style="width:50%;">


&emsp;canvas在绘制图片时，可以先设置透明度`ctx.globalAlpha = 0.1`，即可绘画出透明度为0.1的图片。新图片取代旧图片时，旧图片的透明度值不断减少，新图片的不断增加（配合tween实现），便 可以实现 两图片切换的渐变效果。代码如下：

```html
<div>
  <canvas id="my-canvas" width="600px" height="300px"/>
</div>

<div>
  <button id="alter"> alternateImage </button>
</div>
```

```js
const myCanvas = document.getElementById('my-canvas');
const myContext = myCanvas.getContext('2d');

function animate(time) {
    requestAnimationFrame(animate);
    TWEEN.update(time);
}
requestAnimationFrame(animate);

const img = new Image();
  img.src = 'http://img1.imgtn.bdimg.com/it/u=611438909,3517680494&fm=26&gp=0.jpg';
  img.onload = () => {
    myContext.drawImage(img, 0, 0);
};

const img2 = new Image();
img2.src = 'http://img1.imgtn.bdimg.com/it/u=4156177571,4203191604&fm=26&gp=0.jpg';

function alternateImage(){
  
  const gradient = {
  imgAlpha:1,
  img2Alpha:0
  }
  
  const tween = new TWEEN.Tween(gradient)
    .to({
      imgAlpha:0,
      img2Alpha:1
    },5000)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(()=>{
      myContext.clearRect(0,0,600,300)
      myContext.globalAlpha = gradient.imgAlpha;
      myContext.drawImage(img, 0, 0);
      myContext.globalAlpha = gradient.img2Alpha;
      myContext.drawImage(img2, 0, 0);
    })
  .start()
}


document.getElementById("alter").addEventListener("click",()=>{
  alternateImage()
})
```

## 附录

- 能翻墙访问codepen的，可以看一下在线效果：[https://codepen.io/alwxkxk/pen/MWgQWxx](https://codepen.io/alwxkxk/pen/MWgQWxx)


