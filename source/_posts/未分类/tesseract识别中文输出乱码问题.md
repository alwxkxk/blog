---
title: tesseract识别中文输出乱码问题
toc: true
tags:
  - tesseract
abbrlink: 29101
date: 2023-01-07 16:37:35
---

## 问题现象
&emsp;最近搞的玩意需要用到文字识别，下载测试tesseract效果是不错的，安装完后直接用cmd命令行测试，没啥问题能正常识别中文：
```cmd
tesseract test.jpg stdout -l chi_sim
```
&emsp;由于在c++项目里要想引用打包，所以就又用vcpkg安装一下，在程序调试时把识别库tessdata放好（可以设置环境变量TESSDATA_PREFIX，或者`api->Init`函数初始化时声明路径），初始化设置中文库，跑简单官方demo，发现输出结果是乱码:
```C++
    char* outText;

    tesseract::TessBaseAPI* api = new tesseract::TessBaseAPI();
    
    // Initialize tesseract-ocr with English, without specifying tessdata path
    if (api->Init(NULL, "chi_sim")) {
        fprintf(stderr, "Could not initialize tesseract.\n");
        exit(1);
    }

    // Open input image with leptonica library
    Pix* image = pixRead(argv[1]);
    api->SetImage(image);

    // Get OCR result
    outText = api->GetUTF8Text();
   
    printf("OCR output:\n%s", outText);
```
&emsp;尝试验证几次，搜索后发现原来是cmd的字体编码问题，需要把cmd设置成支持utf8中文字体，添加这个函数使用就输出正常了：
```C++
// windows 系统下 设置成支持utf8中文显示
void windows_cmd_support_utf8(void) {
    system("chcp 65001 & cls");
}
```

## 附录
- [C语言-解决Windows cmd utf8中文乱码](https://blog.csdn.net/jackailson/article/details/115417081)
- [UTF--->Unicode--->Ansi 这个最终返回的中文字符才是正确的，否则中文是乱码](https://blog.csdn.net/liulina603/article/details/45668307)
