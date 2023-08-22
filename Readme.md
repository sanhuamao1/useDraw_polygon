# 效果
![image](https://github.com/sanhuamao1/useDraw_polygon/assets/54561827/e877b363-d323-4d06-b723-6e220559472c)


# 介绍
- index.html：打开可直接查看效果
- useDraw.js：封装的钩子

# useDraw使用
```js
import useDraw from './useDraw';

let draw=useDraw()
draw.init(domRef, {
   // 传入一些选项。
   // 绘制完成时的回调
   onComplete: (points) => {
      console.log('points', points);
   }
});

// 用完后记得销毁
draw.destroy()
```
