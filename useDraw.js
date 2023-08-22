const useDraw = () => {
   let Container = null;
   let canvas = null; // canvas标签
   let ctx = null; // canvas画布
   let w, h; // 画布宽度
   let isPaint = true; // 是否处于绘图模式
   let points = []; // 已加入的点
   let InitStyle = {
      lineWidth: 4, // 画笔大小
      strokeStyle: '#0073e6', // 画笔颜色
      fillStyle: 'rgba(0, 115, 230,0.2)', // 填充颜色
      backgroudColor: 'transparent', // 画布颜色
   };
   let onComplete; // 绘图完成后的回调

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
      for (let i = 0; i < points.length; i++) {
         if (i === 0) {
            ctx.moveTo(points[i].x, points[i].y);
         } else {
            ctx.lineTo(points[i].x, points[i].y);
         }
      }

      if (mouse) {
         ctx.lineTo(mouse.x, mouse.y);
      }
      ctx.lineTo(points[0].x, points[0].y);
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

   const onMouseMove = (e) => {
      draw({ x: e.offsetX, y: e.offsetY });
   };

   const onClick = (e) => {
      // 最多画10个点
      if (points.length >= 10) return;
      points.push({ x: e.offsetX, y: e.offsetY });
   };

   const onRightClick = (e) => {
      e.stopPropagation();
      e.preventDefault();

      const pointLength = points.length;
      if (pointLength === 0) return;
      points.pop();
      draw({ x: e.offsetX, y: e.offsetY });
      return false;
   };

   const onEnter = (e) => {
      let keyCode = e.keyCode || e.which || e.charCode;
      if (keyCode == 13) {
         const pointLength = points.length;
         if (pointLength >= 3) {
            isPaint = false;
            drawArea();
            onComplete && onComplete(getPoints());
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
   };

   const listen = () => {
      canvas.addEventListener('mousemove', onMouseMove);
      canvas.addEventListener('click', onClick);
      canvas.addEventListener('keydown', onEnter);
      canvas.addEventListener('contextmenu', onRightClick);
      canvas.addEventListener('dblclick', onClear);
   };

   const destroy = () => {
      Container = null;
      canvas = null;
      ctx = null;
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('click', onClick);
      canvas.removeEventListener('keydown', onEnter);
      canvas.removeEventListener('contextmenu', onRightClick);
      canvas.removeEventListener('dblclick', onClear);
   };

   /**
    * Container：dom
    * opts：选项
    * {
    *    canvasStyle: Object   画布属性
    *    onComplete： (points: Array<{ x: number, y: number }>) => void     完成绘制时的回调
    *    initPoints: Array<{x: number,y: number}> 初始点位
    * }
    */
   const init = (Container, opts = {}) => {
      // 初始化容器
      Container = Container;
      w = Container.getBoundingClientRect().width;
      h = Container.getBoundingClientRect().height;

      if (Container.style.position === undefined) {
         Container.style.position = 'relaive';
      }
      if (opts.onComplete) {
         onComplete = opts.onComplete;
      }

      InitStyle = {
         ...InitStyle,
         ...(opts.canvasStyle ? opts.canvasStyle : {}),
      };
      // 创建canvas标签
      canvas = document.createElement('canvas');
      const { backgroudColor } = InitStyle;
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
      const { lineWidth, strokeStyle, fillStyle } = InitStyle;
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = strokeStyle;
      ctx.fillStyle = fillStyle;

      // 判断有没有初始值，有的话取消绘制状态
      if (opts.initPoints && opts.initPoints.length >=3) {
         points = opts.initPoints;
         drawArea();
         isPaint = false;
      }
      // 注册监听事件
      listen();
   };

   const getPoints = () => points;

   return {
      init,
      destroy,
      getPoints,
   };
};

export default useDraw;
