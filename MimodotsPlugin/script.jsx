function generatePixelGrid(cols, rows, cellSize, pad, innerW, innerH, r, g, b, shapeType) {
  var doc = app.activeDocument;
  if (!doc) { alert('Нет открытого документа'); return; }
  var layer = doc.activeLayer;
  var g = layer.groupItems.add();
  g.name = 'Pixel Grid ' + cols + 'x' + rows;
  var fc = new RGBColor();
  fc.red = r; fc.green = g; fc.blue = b;
  for (var y = 0; y < rows; y++) {
    for (var x = 0; x < cols; x++) {
      var px = x * cellSize + pad;
      var py = y * cellSize + pad;
      if (shapeType === 'square') {
        var rect = g.pathItems.add();
        rect.setEntirePath([[px,py],[px+innerW,py],[px+innerW,py+innerH],[px,py+innerH]]);
        rect.closed = true; rect.filled = true; rect.fillColor = fc; rect.stroked = false;
      } else if (shapeType === 'circle') {
        var ell = g.pathItems.ellipse(py+innerH, px, innerW, innerH);
        ell.filled = true; ell.fillColor = fc; ell.stroked = false;
      }
    }
  }
  app.redraw();
}
