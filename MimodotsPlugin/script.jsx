function generateGrid(cols, rows, cellSize, pad, innerW, innerH, r, g, b, shapeType) {
  var doc = app.activeDocument;
  if (!doc) { alert('Нет открытого документа'); return; }
  var layer = doc.activeLayer;
  var grp = layer.groupItems.add();
  grp.name = 'PixelGrid ' + cols + 'x' + rows;

  var fc = new RGBColor();
  fc.red = r;
  fc.green = g;
  fc.blue = b;

  for (var y = 0; y < rows; y++) {
    for (var x = 0; x < cols; x++) {
      var px = x * cellSize + pad;
      var py = y * cellSize + pad;

      if (shapeType === 'square') {
        var rt = grp.pathItems.add();
        rt.name = 'px_' + x + '_' + y;
        rt.setEntirePath([
          [px, py],
          [px + innerW, py],
          [px + innerW, py + innerH],
          [px, py + innerH]
        ]);
        rt.closed = true;
        rt.filled = true;
        rt.fillColor = fc;
        rt.stroked = false;

      } else if (shapeType === 'ellipse') {
        var el = grp.pathItems.ellipse(py + innerH, px, innerW, innerH);
        el.name = 'px_' + x + '_' + y;
        el.filled = true;
        el.fillColor = fc;
        el.stroked = false;

      } else if (shapeType === 'hex') {
        var cx = px + innerW / 2;
        var cy = py + innerH / 2;
        var rx = innerW / 2;
        var ry = innerH / 2;
        var pts = [];
        for (var i = 0; i < 6; i++) {
          var angle = (Math.PI / 3) * i - Math.PI / 6;
          pts.push([cx + rx * Math.cos(angle), cy + ry * Math.sin(angle)]);
        }
        var hx = grp.pathItems.add();
        hx.name = 'px_' + x + '_' + y;
        hx.setEntirePath(pts);
        hx.closed = true;
        hx.filled = true;
        hx.fillColor = fc;
        hx.stroked = false;
      }
    }
  }
  app.redraw();
  alert('Создано: ' + cols + 'x' + rows + ' (' + shapeType + ')');
}

function importSVGString(svgText) {
  var doc = app.activeDocument;
  if (!doc) { alert('Нет открытого документа'); return; }
  var fl = new File(Folder.temp + '/mimodots_import.svg');
  fl.open('w');
  fl.write(svgText);
  fl.close();
  doc.groupItems.createFromFile(fl);
  fl.remove();
  app.redraw();
}

function exportSVG() {
  var doc = app.activeDocument;
  if (!doc) { alert('Нет открытого документа'); return; }
  var f = File.saveDialog('Сохранить как SVG', 'SVG:*.svg');
  if (!f) return;
  var o = new ExportOptionsSVG();
  o.embedRasterImages = true;
  o.documentEncoding = SVGDocumentEncoding.UTF8;
  o.DTD = SVGDTDVersion.SVG1_1;
  o.coordinatePrecision = 2;
  doc.exportFile(f, ExportType.SVG, o);
  alert('Экспортировано: ' + f.fsName);
}
