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

    console.log(ctx)
    console.log(size.width, size.height)

    /* 
    CSS Paint API（也称为 "paint worklet"）允许你在 CSS 中使用 JavaScript 来生成图像。然而，由于性能和安全性的考虑，CSS Paint API 的上下文（PaintRenderingContext2D）并不支持所有的 Canvas API 方法和属性。

    以下是一些在 CSS Paint API 中不支持的 Canvas 方法和属性：

    - 不支持像素操作，例如 createImageData，getImageData 和 putImageData。
    - 不支持路径操作，例如 clip，isPointInPath 和 isPointInStroke。
    - 不支持文本操作，例如 fillText 和 strokeText。
    - 不支持图像操作，例如 drawImage 和 createPattern。
    - 不支持状态栈操作，例如 save 和 restore。
    - 不支持变换操作，例如 rotate，scale，transform 和 setTransform。
    - 不支持全局复合操作，例如 globalCompositeOperation 和 globalAlpha。
    - 不支持画布大小操作，例如 width 和 height。

    这些限制可能会在未来的版本中改变，所以你应该查看最新的规范和浏览器文档来获取最准确的信息。如果你需要使用这些不支持的功能，你可能需要考虑使用其他的技术，如 SVG 或直接使用 Canvas API。
    */
    const imageData = ctx.getImageData(0, 0, size.width, size.height);

    const data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
      data[i] = 255; // red
      data[i + 1] = 0; // green
      data[i + 2] = 0; // blue
    }
    ctx.putImageData(imageData, 0, 0);
  }
});
