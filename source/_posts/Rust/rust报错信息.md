---
title: rust报错信息
toc: true
abbrlink: 49540
date: 2022-09-20 20:04:00
tags:
---

## 没使用main函数
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

搜了一下不太好找到原因，后来我想起没有main函数，所以改成这样就正常了：
```rust
fn main(){
    let values = vec![1, 2, 3, 4, 5];
    for x in values {
        println!("{x}");
    }
}
```
