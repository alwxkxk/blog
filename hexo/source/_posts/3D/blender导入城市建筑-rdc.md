---
title: blender导入城市建筑(.rdc)
toc: true
abbrlink: 4195
date: 2020-05-30 15:30:19
tags:
- blender
- 3D
---

&emsp;可以通过从Google地图里抓图获取城市建筑数据，相对于osm这种傻傻地显示方块显示建筑，rdc生成的数据更真实（当然也更复杂）。不能访问Google的小伙伴们是无法尝试的。别问我怎么访问Google，这技术不能教，只能靠缘分获取。导入rdc最终效果：
![导入rdc效果](/blog_images/3d/导入rdc效果.png)

## 操作
&emsp;具体操作看视频：特别注意使用renderDoc注入前，要先退出所有浏览器否则注入失败。

- 使用Chrome浏览器，并能访问Google。
- 安装[renderdoc](https://renderdoc.org/builds)，用于生成rdc文件。
- blender安装插件[MapsModelsImporter](https://github.com/eliemichel/MapsModelsImporter)，用于导入rdc文件。

### 生成rdc文件
&emsp;无法访问google就无法生成rdc文件，只能用跳过此步骤，使用我提供的[rdc示例文件(百度网盘-提取码：q76h)](https://pan.baidu.com/s/1XYv93CE6ktg1QXFRFUjSRQ)来导入。
&emsp;启动cmd，并执行以下命令。路径注意是你Chrome应用的路径。
```bash
set RENDERDOC_HOOK_EGL=0
"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --disable-gpu-sandbox --gpu-startup-dialog

# 或者使用该命令，该命令能创建图标。
C:\Windows\System32\cmd.exe /c "SET RENDERDOC_HOOK_EGL=0 && START "" ^"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe^" --disable-gpu-sandbox --gpu-startup-dialog"
```
&emsp;根据提示，使用renderdoc注入到对应进程。注入成功后，在Google Map里找一个有建筑高度的地方抓图（部分地区因政策原因是不能显示高度的），注意要多靠近看看，才能加载出更细致的图片。特别注意，建议使用下面的那个延时捕捉按钮，立刻捕捉所生成的文件可能无法加载出来。
<video class="lazy" controls data-src="https://test-1251805228.file.myqcloud.com/3D/%E5%AF%BC%E5%87%BArdc.mp4" controls="controls" style="max-width: 100%; display: block; margin-left: auto; margin-right: auto;">
your browser does not support the video tag
</video>

### 导入rdc文件
&emsp;安装插件后导入即可：
<video class="lazy" controls data-src="https://test-1251805228.file.myqcloud.com/3D/%E5%AF%BC%E5%85%A5rdc.mp4" controls="controls" style="max-width: 100%; display: block; margin-left: auto; margin-right: auto;">
your browser does not support the video tag
</video>


## 附录
- [Google Maps 3D: Data into Blender-YouTube](https://www.youtube.com/watch?v=F_XsmoZJmG8)
- [Using Meshroom and Blender for photogrammetry](https://www.youtube.com/playlist?list=PLeuPK3OugzJps-m-FZqKekLlE-A2m6Cb8)，Meshroom 结合照片生成3D物体。

## FAQ
1.导入rdc不成功？
```
bpy.context.space_data.system_bookmarks_active = 1
Invalid RDC capture file. Please make sure that:
1. You are importing from Google Maps (NOT Google Earth)
2. You were MOVING in the 3D view while taking the capture (you can use the Capture after delay button in RenderDoc).
Please report to MapsModelsImporter developers providing the .rdc file as well as the full console log.
Console log is accessible in Windows > Toggle System Console (right click to copy).
Invalid RDC capture file. Please make sure that:
1. You are importing from Google Maps (NOT Google Earth)
2. You were MOVING in the 3D view while taking the capture (you can use the Capture after delay button in RenderDoc).
Please report to MapsModelsImporter developers providing the .rdc file as well as the full console log.
Console log is accessible in Windows > Toggle System Console (right click to copy).
Invalid RDC capture file. Please make sure that:
1. You are importing from Google Maps (NOT Google Earth)
2. You were MOVING in the 3D view while taking the capture (you can use the Capture after delay button in RenderDoc).
Please report to MapsModelsImporter developers providing the .rdc file as well as the full console log.
Console log is accessible in Windows > Toggle System Console (right click to copy).
```
答：请捕捉时使用下面的延时捕捉按钮`Capture after `，设置延时，多转动地图。
