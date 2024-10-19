---
title: threejs的GLSL源文件阅读
toc: true
abbrlink: 23602
date: 2023-06-23 17:11:56
tags:
img: /blog_images/3d/交互式计算机图形学.webp
---

## webgl基本知识
&emsp;参考[webgl教程](https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-shaders-and-glsl.html)，我们知道WebGL每次绘制需要两个着色器， 一个顶点着色器(vertexShader)和一个片段着色器(fragmentShader)，前者主要负责计算顶点坐标(gl_Position)，后者主要计算要渲染的颜色（gl_FragColor）。


webgl使用GL Shader Language（GLSL）语法来编写着色器的代码，语法上类似于C++，运行在GPU中（所以很难调试），里面有三种变量类型:
- attribute变量是只能在vertex shader中使用的变量。
- uniform变量是外部程序传递给（vertex和fragment）shader的变量。
- varying变量是vertex和fragment shader之间做数据传递用的。

threejs本质上就是webgl的封装，使其用起来更方便。

## threejs 使用自定义shader的办法
&emsp;threejs（R109）使用shader一般是使用ShaderMaterial,传入vertexShader与fragmentShader来渲染，根据需要传入uniforms。

```js
// 所有顶点经过转 摄像头的正交投影转换，达到近大远小的三维效果。
// 透视投影（近大远小） * 模型视图（摄像机视角+变换矩阵） * 原始顶点坐标
const vertexShader = `
  void main() 
  {
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`;

// 所有顶点渲染成红色
const fragmentShader=`
void main() {
    gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}
`;

const customMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
  });
```

## threejs shader源代码阅读
&emsp;three.js的GLSL代码一般在：`three.js-dev\src\renderers\shaders\ShaderChunk\default_vertex.glsl.js`。
&emsp;他们的写法是根据需要将多个GLSL拼接起来使用，结合`#ifdef`来控制部分代码是否生效：

```js
//ShaderLib/cube.glsl.js
export const vertex = /* glsl */`
varying vec3 vWorldDirection;
#include <common>

void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w; // set z to camera.far
}
`;

export const fragment = /* glsl */`
#include <envmap_common_pars_fragment>
uniform float opacity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>

void main() {
	vec3 vReflect = vWorldDirection;
	#include <envmap_fragment>
	gl_FragColor = envColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <encodings_fragment>
}
`;
```

其中的begin_vertex代码与project_vertex分别对应：
```js
//begin_vertex.glsl.js
export default /* glsl */`
vec3 transformed = vec3( position );
`;
```
```js
// project_vertex.glsl.js
export default /* glsl */`
vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;
`;
```

`ShaderLib/meshphysical.glsl.js`与`examples\jsm\nodes\materials\nodes\PhongNode.js`所涉及的主要代码段个人总结如下：
- `common.glsl.js` 包含常见的通用变量与函数
- `begin_vertex.glsl.js` 一般的顶点着色器的开始代码
- `project_vertex.glsl.js` 常见的正交投影转换代码
- `lights_physical_fragment.glsl.js` 物理光的计算
- `encodings_fragment.glsl.js` 输出颜色的线性转换


涉及主要变量：
- `vViewPosition` 摄像头的视野坐标
- `vNormal` 法向量



three.js里通过 `p_uniforms.setValue`来给shader传uniform值。常见的uniform默认值在`src\renderers\shaders\UniformsLib.js`可以看到：
```js
const UniformsLib = {
	common: {
		diffuse: { value: new Color( 0xffffff ) },
		opacity: { value: 1.0 },
		map: { value: null },
		uvTransform: { value: new Matrix3() },
		uv2Transform: { value: new Matrix3() },
		alphaMap: { value: null },
		alphaTest: { value: 0 }
	},
    envmap: {
		envMap: { value: null },
		flipEnvMap: { value: - 1 },
		reflectivity: { value: 1.0 }, // basic, lambert, phong
		ior: { value: 1.5 }, // standard, physical
		refractionRatio: { value: 0.98 },
		maxMipLevel: { value: 0 }
	}
    // 省略................................
}
```




## 附录
- [MDN WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)
- [webglfundamentals](https://webglfundamentals.org/webgl/lessons/zh_cn/)
- [GLSL 三种变量类型（uniform，attribute和varying）理解](https://www.jianshu.com/p/eed3ebdad4fb)
- [计算机图形学二：视图变换(坐标系转化，正交投影，透视投影，视口变换)](https://zhuanlan.zhihu.com/p/144329075)
- [WebGL model view projection](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/WebGL_model_view_projection)
- [WebGL学习06-投影,视图和模型矩阵](https://juejin.cn/post/6886698316189401096)