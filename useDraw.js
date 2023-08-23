const useDraw = () => {
   let Container = null;
   let canvas = null; // canvas标签
   let ctx = null; // canvas画布
   let w, h; // 画布宽度
   let isPaint = true; // 是否处于绘图模式
   let points = []; // 已加入的点

   // 默认样式
   let defaultStyle = {
      lineWidth: 4, // 画笔大小
      strokeStyle: '#0073e6', // 画笔颜色
      fillStyle: 'rgba(0, 115, 230,0.2)', // 填充颜色
      backgroudColor: 'transparent' // 画布颜色
   };

   // 默认选项
   let options = {
      onComplete: undefined, // 绘图完成后的回调
      beforeComplete: (points)=>points.length>=3, // 完成绘图前的验证 
      onClear: undefined, // 清空绘图后的回调
      max: 4, // 限制最多点位数量
      canvasStyle: { ...defaultStyle }
   }; // 选项

   // 画横线
   const drawLine = (mouse) => {
      ctx.clearRect(0, 0, w, h);
      const firstPoint = points[0];
      ctx.beginPath();
      ctx.moveTo(firstPoint.x, firstPoint.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
   };

   // 画区域
   const drawArea = (mouse) => {
      ctx.clearRect(0, 0, w, h);
      ctx.beginPath();
      // 画已经加上的点
      for (let i = 0; i < points.length; i++) {
         if (i === 0) {
            ctx.moveTo(points[i].x, points[i].y);
         } else {
            ctx.lineTo(points[i].x, points[i].y);
         }
      }
      // 如果传入了鼠标点，将它作为最后一点，动态绘制区域。否则根据points直接封闭区域
      if (mouse) {
         ctx.lineTo(mouse.x, mouse.y);
      }

      // 回到第一个点，封闭区域
      ctx.lineTo(points[0].x, points[0].y);

      // 划线与填充
      ctx.stroke();
      ctx.fill();
   };

   // 根据情况绘制图形
   const draw = (mouse) => {
      const pointLength = points.length;
      if (isPaint === false) return;
      switch (pointLength) {
         case 0:
            return;
         case 1:
            drawLine(mouse); // 画直线
            break;
         default:
            drawArea(mouse); // 画区域
            break;
      }
   };

   // 移动鼠标的事件：动态绘制图形
   const onMouseMove = (e) => {
      draw({ x: e.offsetX, y: e.offsetY });
   };

   // 点击事件：添加点
   const onClick = (e) => {
      if (getOpts().max && points.length > getOpts().max) {
         return;
      }
      points.push({ x: e.offsetX, y: e.offsetY });
   };

   // 鼠标右键：撤销
   const onRightClick = (e) => {
      // 防止默认打开菜单s
      e.stopPropagation();
      e.preventDefault();

      const pointLength = points.length;
      if (pointLength === 0) return;
      points.pop();
      draw({ x: e.offsetX, y: e.offsetY });
      return false;
   };

   // 回车事件：完成绘图
   const onEnter = (e) => {
      let keyCode = e.keyCode || e.which || e.charCode;
      if (keyCode == 13) {
         // const pointLength = points.length;
         // 至少需要三个点才允许画区域
         if(options.beforeComplete(points)){
            isPaint = false;
            drawArea(); // 画封闭区域
            options.onComplete && options.onComplete(getPoints());
         }
      }
   };

   // 清理画布
   const onClear = () => {
      if (isPaint === false) {
         isPaint = true;
      }
      points = [];
      ctx.clearRect(0, 0, w, h);
      options.onClear && options.onClear()
   };

   const listen = () => {
      canvas.addEventListener('mousemove', onMouseMove);
      canvas.addEventListener('click', onClick);
      canvas.addEventListener('keydown', onEnter);
      canvas.addEventListener('contextmenu', onRightClick);
      canvas.addEventListener('dblclick', onClear);
   };

   const destroy = () => {
      if(canvas){
         canvas.removeEventListener('mousemove', onMouseMove);
         canvas.removeEventListener('click', onClick);
         canvas.removeEventListener('keydown', onEnter);
         canvas.removeEventListener('contextmenu', onRightClick);
         canvas.removeEventListener('dblclick', onClear);
      }
      canvas = null;
      Container = null;
      ctx = null;
      options = null;
   };

   // 根据点画区域
   const drawAreaByPoints = (newPoints) => {
      if (newPoints.length < 3) {
         return;
      }
      points = newPoints;
      drawArea();
      isPaint = false;
   };

   const init = (dom, newOpts = {}) => {
      // 初始化容器
      Container = dom;
      options = {
         ...options,
         ...newOpts,
         canvasStyle: {
            ...defaultStyle,
            ...(newOpts.canvasStyle ? { ...newOpts.canvasStyle } : {})
         }
      };

      w = Container.getBoundingClientRect().width;
      h = Container.getBoundingClientRect().height;

      if (Container.style.position === undefined) {
         Container.style.position = 'relaive';
      }

      // 创建canvas标签
      canvas = document.createElement('canvas');
      const { backgroudColor } = options.canvasStyle;
      canvas.style.backgroundColor = backgroudColor;
      canvas.tabIndex = '0'; // 否则用不了回车
      canvas.width = w;
      canvas.height = h;
      canvas.style.position = 'absolute';
      canvas.style.left = 0;
      canvas.style.top = 0;
      canvas.focus();
      // 将canvas加入到dom中
      Container.appendChild(canvas);

      // 初始化画布
      ctx = canvas.getContext('2d');
      const { lineWidth, strokeStyle, fillStyle } = options.canvasStyle;
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = strokeStyle;
      ctx.fillStyle = fillStyle;

      // 判断有没有初始值，有的话关闭绘制状态
      if (options.initPoints && options.initPoints.length !== 0) {
         drawAreaByPoints(options.initPoints);
      }
      // 注册监听事件
      listen();
   };

   const getPoints = () => points;
   const getOpts = () => options;

   return {
      init,
      destroy,
      getPoints,
      drawAreaByPoints
   };
};

export default useDraw;
