function generateGrid(cols, rows, cellSize, pad, innerW, innerH, r, g, b, shapeType) {
  var doc = app.activeDocument;
  if (!doc) return 'No document';

  var ab = doc.artboards[doc.artboards.getActiveArtboardIndex()];
  var abRect = ab.artboardRect;
  var abCx = (abRect[0] + abRect[2]) / 2;
  var abCy = (abRect[1] + abRect[3]) / 2;

  var gridW = cols * cellSize;
  var gridH = rows * cellSize;
  var startX = abCx - gridW / 2;
  var startY = abCy + gridH / 2;

  var layer = doc.activeLayer;
  var grp = layer.groupItems.add();
  grp.name = 'PixelGrid ' + cols + 'x' + rows;

  var fc = new RGBColor();
  fc.red = r;
  fc.green = g;
  fc.blue = b;

  for (var y = 0; y < rows; y++) {
    for (var x = 0; x < cols; x++) {
      var px = startX + x * cellSize + pad;
      var py = startY - y * cellSize - pad;

      if (shapeType === 'square') {
        var rt = grp.pathItems.add();
        rt.name = 'px_' + x + '_' + y;
        rt.setEntirePath([
          [px, py],
          [px + innerW, py],
          [px + innerW, py - innerH],
          [px, py - innerH]
        ]);
        rt.closed = true;
        rt.filled = true;
        rt.fillColor = fc;
        rt.stroked = false;

      } else if (shapeType === 'ellipse') {
        var el = grp.pathItems.ellipse(py - innerH, px, innerW, innerH);
        el.name = 'px_' + x + '_' + y;
        el.filled = true;
        el.fillColor = fc;
        el.stroked = false;

      } else if (shapeType === 'hex') {
        var cx = px + innerW / 2;
        var cy = py - innerH / 2;
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
  return 'OK:' + cols + 'x' + rows;
}

function getSelectedAsSVG() {
  var doc = app.activeDocument;
  if (!doc) return '';
  var sel = doc.selection;
  if (!sel || sel.length === 0) return '';
  var tmpFile = new File(Folder.temp + '/mimodots_sel.svg');
  var svgOpts = new ExportOptionsSVG();
  svgOpts.embedRasterImages = true;
  svgOpts.documentEncoding = SVGDocumentEncoding.UTF8;
  svgOpts.DTD = SVGDTDVersion.SVG1_1;
  svgOpts.coordinatePrecision = 2;
  doc.exportFile(tmpFile, ExportType.SVG, svgOpts);
  tmpFile.open('r');
  var content = tmpFile.read();
  tmpFile.close();
  return content;
}

function exportSVG() {
  var doc = app.activeDocument;
  if (!doc) return;
  var f = File.saveDialog('Save SVG', 'SVG:*.svg');
  if (!f) return;
  var o = new ExportOptionsSVG();
  o.embedRasterImages = true;
  o.documentEncoding = SVGDocumentEncoding.UTF8;
  o.DTD = SVGDTDVersion.SVG1_1;
  o.coordinatePrecision = 2;
  doc.exportFile(f, ExportType.SVG, o);
  return 'Saved';
}
