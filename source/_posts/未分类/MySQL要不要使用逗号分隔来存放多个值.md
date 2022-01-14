---
title: MySQL要不要使用逗号分隔来存放多个值
toc: true
abbrlink: 19936
date: 2021-03-07 19:18:30
tags:
---


&emsp;MySQL是不支持数组数据的，所以时常把数组数据转换成逗号分隔数值的字符串再保存。以用户ID姓名、每个用户拥有多个兴趣，如下图表所示：

contactid|firstname|lastname|hobbies
---|---|---|---
1639|George|Barnes|reading
5629|Susan|Noble|hiking, movies
3388|Erwin|Star|hockey, skiing
5772|Alice|Buck|
1911|Frank|Borders|photography, travel, art
4848|Hanna|Diedrich|gourmet cooking

&emsp;每个用户拥有ID（contactid），姓名（firstname，lastname）与若干个兴趣（hobbies），这多个兴趣之间使用了逗号来分隔，这样子做不符合关系数据库（SQL）的第一范式（1NF：关系模式R的每一个分量是不可再分的数据项）。第一范式告诉我们，一个字段里本不要存放多个值，__因为一旦存放多个值，就无法优化搜索__。比如说，我想找到兴趣爱好里包含art的所有人，这就需要数据库搜索所有人的数据去匹配找到art，所有数据都要遍历对比一次，搜索效率就低了。但假设字段里只存一个值，比如像firstname里的，我要搜索George，如果建立了索引，那么数据已经利用类似于B树或者其它数据结构来存放数据（有学过《数据结构》的很容易明白，没学过的我也好像没办法解释清楚），一搜并不需要遍历所有数据，会很快地定位并找出相关数据，搜索效率会大大提升。  当数据只有10条时看不出所花费时间的区别，但当数据量达到了10万条、10亿条时，其时间差别就大了。

&emsp;那如何解决？如何设计才是正确的，合理的设计应当将其拆分出另一张表来，直接将兴趣与用户一一对应起来，搜索效率就能提高，如下所示：

contactid|hobby
---|---|
1639|reading
5629|hiking
5629|movies
3388|hockey
3388|skiing
1911|photography
1911|travel
1911|art
4848|gourmet cooking

&emsp;或许你会问，如果我的业务需求里，这个兴趣爱好就只是简单地显示，并不需要通过兴趣爱好来搜索人呢？ 那么的确并不需要另外拆出来，就直接以逗号分隔存放着就行了，毕竟真不需要。 即使后面业务变化，需要通过兴趣爱好来搜索人，到时再拆表出来并不会有特别大的麻烦。

## 备注说明
- PostgreSQL 支持任何数据类型的数组形式。
- 逗号分隔（Comma-separated）
- 多值属性（multivalued attributes）

## 附录

 - [Database Design - Multivalued attributes](https://web.csulb.edu/colleges/coe/cecs/dbdesign/dbdesign.php?page=hobbies.php)
 - [stackoverflow - is-storing-a-delimited-list-in-a-database-column-really-that-bad](https://stackoverflow.com/questions/3653462/is-storing-a-delimited-list-in-a-database-column-really-that-bad)




