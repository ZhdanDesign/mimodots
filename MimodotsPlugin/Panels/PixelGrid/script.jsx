function generatePixelGrid(cols, rows, cellSize, pad, innerW, innerH, r, g, b, shapeType) {
  if (!app.documents.length) {
    alert('Нет открытого документа');
    return;
  }

  var doc = app.activeDocument;
  var layer = doc.activeLayer;
  var totalW = cols * cellSize;
  var totalH = rows * cellSize;

  var left = (doc.width / 2) - (totalW / 2);
  var top = (doc.height / 2) + (totalH / 2);

  var group = layer.groupItems.add();
  group.name = 'Pixel Grid ' + cols + 'x' + rows;

  var fillColor = new RGBColor();
  fillColor.red = r;
  fillColor.green = g;
  fillColor.blue = b;

  for (var y = 0; y < rows; y++) {
    for (var x = 0; x < cols; x++) {
      var px = left + x * cellSize + pad;
      var py = top - y * cellSize - pad;

      if (shapeType === 'square') {
        var rect = group.pathItems.add();
        rect.name = 'pixel_' + x + '_' + y;
        rect.setEntirePath([
          [px, py],
          [px + innerW, py],
          [px + innerW, py - innerH],
          [px, py - innerH]
        ]);
        rect.closed = true;
        rect.filled = true;
        rect.fillColor = fillColor;
        rect.stroked = false;
      } else if (shapeType === 'ellipse') {
        var ellipse = group.pathItems.ellipse(
          py - innerH,
          px,
          innerW,
          innerH
        );
        ellipse.name = 'pixel_' + x + '_' + y;
        ellipse.filled = true;
        ellipse.fillColor = fillColor;
        ellipse.stroked = false;
      } else if (shapeType === 'polygon') {
        var cx = px + innerW / 2;
        var cy = py - innerH / 2;
        var rx = innerW / 2;
        var ry = innerH / 2;
        var points = [];
        for (var i = 0; i < 6; i++) {
          var angle = (Math.PI / 3) * i - Math.PI / 6;
          points.push([
            cx + rx * Math.cos(angle),
            cy + ry * Math.sin(angle)
          ]);
        }
        var hex = group.pathItems.add();
        hex.name = 'pixel_' + x + '_' + y;
        hex.setEntirePath(points);
        hex.closed = true;
        hex.filled = true;
        hex.fillColor = fillColor;
        hex.stroked = false;
      }
    }
  }

  app.redraw();
  alert('Создано: ' + cols + '×' + rows + ' пикселей (' + shapeType + ')');
}

function importSVGString(svgString) {
  if (!app.documents.length) {
    alert('Нет открытого документа');
    return;
  }

  var doc = app.activeDocument;
  var tmpFile = new File(Folder.temp + '/mimodots_import.svg');
  tmpFile.open('w');
  tmpFile.write(svgString);
  tmpFile.close();

  doc.groupItems.createFromFile(tmpFile);
  tmpFile.remove();

  app.redraw();
  alert('SVG импортирован в документ');
}

function exportSelectionAsSVG() {
  if (!app.documents.length) {
    alert('Нет открытого документа');
    return;
  }

  var doc = app.activeDocument;
  var sel = doc.selection;

  if (!sel || sel.length === 0) {
    alert('Выделите объекты для экспорта');
    return;
  }

  var saveFile = File.saveDialog('Сохранить как SVG', 'SVG:*.svg');
  if (!saveFile) return;

  var exportOpts = new ExportOptionsSVG();
  exportOpts.embedRasterImages = true;
  exportOpts.fontSubsetting = SVGFontSubsetting.None;
  exportOpts.documentEncoding = SVGDocumentEncoding.UTF8;
  exportOpts.DTD = SVGDTDVersion.SVG1_1;
  exportOpts.coordinatePrecision = 2;

  doc.exportFile(saveFile, ExportType.SVG, exportOpts);
  alert('SVG экспортирован: ' + saveFile.fsName);
}
