---
title: 谨慎使用github的LFS
toc: true
abbrlink: 10564
date: 2022-01-14 20:30:22
tags:
---

&emsp;最近收到github的邮件告知我的LFS额度已经使用超过80%，看了一下文档发现这个LFS的额度还蛮坑的，额度只有1G不说，别人下载还会占用我的额度（这太坑了），而且超额后就比较麻烦，以后只能尽量不使用LFS了：
![github-lfs额度问题](/blog_images/未分类/github-lfs额度问题.webp)

&emsp;由于以上原因，我把存放blender工程的项目删除，改放到百度网盘。并且将站点里的图片全部替换成webp（能大量降低图片体积，这倒是顺便优化了我站点的网页性能），不再使用LFS存放，直接git提交，为此还清空了我站点里的提交记录。

## 清空git提交历史 
```bash
rm -rf .git 
git init 
git add -A 
git commit -m "clear history" 
git remote add origin ${GITHUB_REPO_URL} 
git push -f -u origin master
```