---
title: rust报错信息
toc: true
abbrlink: 49540
date: 2022-09-20 20:04:00
tags:
img: /blog_images/学习技巧.webp
---

## 函数外使用let
在rust代码中直接复制示例代码时发现，以下代码编译会报错:
```rust
    let values = vec![1, 2, 3, 4, 5];
    for x in values {
        println!("{x}");
    }
    // 会报错:
    // error: expected item, found keyword `let`
    // 这个报错信息让人 很难找到原因
```

搜了一下发现github上也有讨论：[unhelpful "expected item" error when putting let binding outside of function](https://github.com/rust-lang/rust/issues/61764)，里面讨论到的是，在函数外面声明let变量，会报错。

改成在函数里即可：
```rust
fn main(){
    let values = vec![1, 2, 3, 4, 5];
    for x in values {
        println!("{x}");
    }
}
```
