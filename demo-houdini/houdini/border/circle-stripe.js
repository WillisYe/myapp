registerPaint('circle-stripe', class {
  static get inputProperties() {
    return [
      '--stripe-count',
      '--stripe-color',
      '--stripe-radius',
    ];
  }

  paint(ctx, size, styleMap) {
    let counts = styleMap.getAll('--stripe-count');  // 条纹的数量
    let count = 2 * counts[0]
    let colors = styleMap.getAll('--stripe-color');
    let stripeRadius = styleMap.getAll('--stripe-radius');

    let radius = Math.min(size.width, size.height, stripeRadius[0]) / 2;

    let angle = 2 * Math.PI / count

    ctx.translate(size.width / 2, size.height / 2);  // 将原点移动到画布的中心

    for (let j = radius; j > 0; j--) {
      var differ = (j / 30)
      var n = Math.log2(j) * 4
      var roundedNum = Math.round(n)
      var bool = Math.abs(n - roundedNum) < 0.2
      if (bool) {
        // differ = (j + 30 * roundedNum) / 30
      }
      for (let i = 0; i < count; i++) {
        ctx.beginPath();
        ctx.arc(0, 0, j, (i - differ) * angle, (i + 1 - differ) * angle);
        ctx.lineTo(0, 0);
        ctx.closePath();

        // 根据 i 的奇偶性选择颜色
        ctx.fillStyle = i % 2 == 0 ? colors[0] || 'black' : colors[1] || 'white';
        ctx.fill();
      }
    }
  }
});
