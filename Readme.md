# 效果

![gbig9-7l3lv](https://github.com/sanhuamao1/useDraw_polygon/assets/54561827/ba0a67dc-97ab-409b-a3da-2233d02b58ed)

# 操作
1. 鼠标左键：加入路径点
2. 鼠标右键：撤销
3. 鼠标移动：动态绘制区域
4. 双击鼠标左键：清除画布
5. 回车：完成绘图

# 文件介绍
- index.html：打开可直接查看效果
- useDraw.js：封装的钩子

# useDraw使用
```js
import useDraw from './useDraw';

let draw=useDraw()
draw.init(domRef, {
   // 传入一些选项。
   // 绘制完成时的回调（可选）
   onComplete: (points) => {
      console.log('points', points);
   },
   // 初始区域（可选）
   initPoints: [{x:200,y:200},{x:300,y:300},{x:200,y:300}],
});

// 用完后记得销毁
draw.destroy()
```
