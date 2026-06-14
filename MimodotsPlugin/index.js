const { app } = require("illustrator");
const core = require("illustrator").core;

const state = {
  width: 32,
  height: 32,
  ratio: "free",
  shape: "square",
  gap: 10,
  color: "#4caf50"
};

const previewEl = document.getElementById("preview");
const widthSlider = document.getElementById("widthSlider");
const heightSlider = document.getElementById("heightSlider");
const widthVal = document.getElementById("widthVal");
const heightVal = document.getElementById("heightVal");
const gapSlider = document.getElementById("gapSlider");
const gapVal = document.getElementById("gapVal");
const colorPicker = document.getElementById("colorPicker");
const colorVal = document.getElementById("colorVal");
const dimLabel = document.getElementById("dimLabel");
const importBtn = document.getElementById("importBtn");
const fileInput = document.getElementById("fileInput");
const generateBtn = document.getElementById("generateBtn");
const exportBtn = document.getElementById("exportBtn");

document.querySelectorAll("[data-ratio]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-ratio]").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    state.ratio = btn.dataset.ratio;
    if (state.ratio === "square") {
      state.height = state.width;
      heightSlider.value = state.height;
      heightVal.textContent = state.height;
    }
    updateDim();
    render();
  });
});

document.querySelectorAll("[data-shape]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-shape]").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    state.shape = btn.dataset.shape;
    render();
  });
});

widthSlider.addEventListener("input", function() {
  state.width = parseInt(this.value);
  widthVal.textContent = state.width;
  if (state.ratio === "square") {
    state.height = state.width;
    heightSlider.value = state.height;
    heightVal.textContent = state.height;
  }
  updateDim();
  render();
});

heightSlider.addEventListener("input", function() {
  state.height = parseInt(this.value);
  heightVal.textContent = state.height;
  if (state.ratio === "square") {
    state.width = state.height;
    widthSlider.value = state.width;
    widthVal.textContent = state.width;
  }
  updateDim();
  render();
});

gapSlider.addEventListener("input", function() {
  state.gap = parseInt(this.value);
  gapVal.textContent = state.gap + "%";
  render();
});

colorPicker.addEventListener("input", function() {
  state.color = this.value;
  colorVal.textContent = state.color;
  render();
});

function updateDim() {
  dimLabel.textContent = state.width + " \u00d7 " + state.height;
}

function render() {
  var cols = state.width;
  var rows = state.height;
  var gapFrac = state.gap / 100;
  var svgNS = "http://www.w3.org/2000/svg";
  var cellSize = 10;
  var pad = cellSize * gapFrac / 2;
  var inner = cellSize - pad * 2;
  var svgW = cols * cellSize;
  var svgH = rows * cellSize;

  var svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 0 " + svgW + " " + svgH);

  var bg = document.createElementNS(svgNS, "rect");
  bg.setAttribute("width", svgW);
  bg.setAttribute("height", svgH);
  bg.setAttribute("fill", "#1a1a1a");
  svg.appendChild(bg);

  for (var x = 0; x <= cols; x++) {
    var line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", x * cellSize);
    line.setAttribute("y1", 0);
    line.setAttribute("x2", x * cellSize);
    line.setAttribute("y2", svgH);
    line.setAttribute("stroke", "rgba(255,255,255,0.08)");
    line.setAttribute("stroke-width", "0.3");
    svg.appendChild(line);
  }
  for (var y = 0; y <= rows; y++) {
    var line2 = document.createElementNS(svgNS, "line");
    line2.setAttribute("x1", 0);
    line2.setAttribute("y1", y * cellSize);
    line2.setAttribute("x2", svgW);
    line2.setAttribute("y2", y * cellSize);
    line2.setAttribute("stroke", "rgba(255,255,255,0.08)");
    line2.setAttribute("stroke-width", "0.3");
    svg.appendChild(line2);
  }

  for (var py = 0; py < rows; py++) {
    for (var px = 0; px < cols; px++) {
      var cx = px * cellSize + pad + inner / 2;
      var cy = py * cellSize + pad + inner / 2;
      var el;

      if (state.shape === "square") {
        el = document.createElementNS(svgNS, "rect");
        el.setAttribute("x", px * cellSize + pad);
        el.setAttribute("y", py * cellSize + pad);
        el.setAttribute("width", inner);
        el.setAttribute("height", inner);
      } else if (state.shape === "circle") {
        el = document.createElementNS(svgNS, "circle");
        el.setAttribute("cx", cx);
        el.setAttribute("cy", cy);
        el.setAttribute("r", inner / 2);
      } else if (state.shape === "hex") {
        el = document.createElementNS(svgNS, "polygon");
        var pts = [];
        for (var i = 0; i < 6; i++) {
          var angle = (Math.PI / 3) * i - Math.PI / 6;
          pts.push(
            (cx + (inner / 2) * Math.cos(angle)).toFixed(2) + "," +
            (cy + (inner / 2) * Math.sin(angle)).toFixed(2)
          );
        }
        el.setAttribute("points", pts.join(" "));
      }

      if (el) {
        el.setAttribute("fill", state.color);
        svg.appendChild(el);
      }
    }
  }

  previewEl.innerHTML = "";
  previewEl.appendChild(svg);
}

function hexToRGB(hex) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16)
  };
}

generateBtn.addEventListener("click", async function() {
  var cols = state.width;
  var rows = state.height;
  var cellSize = 10;
  var gapFrac = state.gap / 100;
  var pad = cellSize * gapFrac / 2;
  var innerW = cellSize - pad * 2;
  var innerH = cellSize - pad * 2;
  var rgb = hexToRGB(state.color);

  await core.executeAsModal(async function() {
    var batchCommands = [];

    batchCommands.push({
      _obj: "make",
      _target: [{ _ref: "layer" }],
      name: "Pixel Grid " + cols + "x" + rows
    });

    for (var y = 0; y < rows; y++) {
      for (var x = 0; x < cols; x++) {
        var left = x * cellSize + pad;
        var top = y * cellSize + pad;

        if (state.shape === "square") {
          batchCommands.push({
            _obj: "make",
            _target: [{ _ref: "pathItem" }],
            name: "px_" + x + "_" + y,
            entireSubpath: [
              [
                { horizontal: left, vertical: top },
                { horizontal: left + innerW, vertical: top },
                { horizontal: left + innerW, vertical: top + innerH },
                { horizontal: left, vertical: top + innerH }
              ]
            ],
            closed: true,
            fillColor: { _obj: "RGBColor", red: rgb.r, grain: rgb.g, blue: rgb.b }
          });
        } else if (state.shape === "circle") {
          batchCommands.push({
            _obj: "make",
            _target: [{ _ref: "pathItem" }],
            name: "px_" + x + "_" + y,
            ellipse: true,
            top: top,
            left: left,
            width: innerW,
            height: innerH,
            fillColor: { _obj: "RGBColor", red: rgb.r, grain: rgb.g, blue: rgb.b }
          });
        } else if (state.shape === "hex") {
          var cx = left + innerW / 2;
          var cy = top + innerH / 2;
          var rx = innerW / 2;
          var ry = innerH / 2;
          var pts = [];
          for (var i = 0; i < 6; i++) {
            var angle = (Math.PI / 3) * i - Math.PI / 6;
            pts.push({
              horizontal: cx + rx * Math.cos(angle),
              vertical: cy + ry * Math.sin(angle)
            });
          }
          batchCommands.push({
            _obj: "make",
            _target: [{ _ref: "pathItem" }],
            name: "px_" + x + "_" + y,
            entireSubpath: [pts],
            closed: true,
            fillColor: { _obj: "RGBColor", red: rgb.r, grain: rgb.g, blue: rgb.b }
          });
        }
      }
    }

    await require("illustrator").action.batchPlay(batchCommands, {});
  }, { commandName: "Generate Pixel Grid" });
});

importBtn.addEventListener("click", function() {
  fileInput.click();
});

fileInput.addEventListener("change", async function(e) {
  var file = e.target.files[0];
  if (!file) return;

  await core.executeAsModal(async function() {
    await require("illustrator").action.batchPlay([{
      _obj: "placeItem",
      _target: [{ _ref: "document" }],
      using: { _path: file.nativePath }
    }], {});
  }, { commandName: "Import SVG" });

  e.target.value = "";
});

exportBtn.addEventListener("click", async function() {
  await core.executeAsModal(async function() {
    var result = await require("illustrator").action.batchPlay([{
      _obj: "get",
      _target: [{ _property: "selection" }]
    }], {});

    if (!result || !result[0] || !result[0].selection || result[0].selection.length === 0) {
      alert("Выделите объекты для экспорта");
      return;
    }

    var file = await new Promise(function(resolve) {
      var saver = require("illustrator").core;
      resolve(null);
    });

    alert("Выделение получено. Используйте Файл → Экспорт для сохранения SVG.");
  }, { commandName: "Export Selection" });
});

render();
