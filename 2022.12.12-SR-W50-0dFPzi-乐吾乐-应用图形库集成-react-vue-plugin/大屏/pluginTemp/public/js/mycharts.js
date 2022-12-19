// 1. 编写图形绘画函数
// 其中，calculative.worldRect为canvas的世界坐标。更多信息，参考 “架构” - “概要” 和 Pen 相关文档
// 形参 ctx 仅仅在 downloadSvg 时有值
function mytriangle(pen, ctx) {
  const path = !ctx ? new Path2D() : ctx;
  const { x, y, width, height } = pen.calculative.worldRect;
  path.moveTo(x + width / 2, y);
  path.lineTo(x + width, y + height);
  path.lineTo(x, y + height);
  path.lineTo(x + width / 2, y);

  path.closePath();
  if (path instanceof Path2D) return path;
}
// 2. 如果需要，编写锚点函数。通常，可以使用默认锚点，然后通过快捷键动态添加锚点
// 注意，锚点左边为相对宽高的百分比小数（0-1之间的小数）
function mytriangleAnchors(pen) {
  const anchors = [];
  anchors.push({
    id: '0',
    penId: pen.id,
    x: 0.5,
    y: 0,
  });

  anchors.push({
    id: '1',
    penId: pen.id,
    x: 1,
    y: 1,
  });

  anchors.push({
    id: '2',
    penId: pen.id,
    x: 0,
    y: 1,
  });
  pen.anchors = anchors;
}

// 需要时打开
if (false) {
  window.myCharts = [
    {
      name: '我的图形库文件夹名称',
      list: [
        {
          image: '/img/logo.png',
          name: '自定义图形',
          penFn: mytriangle,
          anchorsFn: mytriangleAnchors, // 可以不需要，使用缺省锚点
          data: {
            width: 100,
            height: 100,
          },
        },
      ],
      show: true,
    },
  ];
}

function beforeSave(data) {
  // 自己的保存业务逻辑
  const query = window.location.search.substring(1).split("&");
  const obj = {};
  for (let i = 0; i < query.length; i++) {
    const el = query[i];
    const kvPairs = el.split("=");
    obj[kvPairs[0]] = kvPairs[1];
  }
  if(obj.eqpickey){
    if(!data.data){
      data.data = {};
    }
    data.data.eqpickey = obj.eqpickey;
  }
  return true;
}

function afterSave(res){
  // 保存图纸之后的钩子函数
  // console.log('afterSave',res)
}

window.beforeSaveTopology = beforeSave;
window.afterSaveTopology = afterSave;
