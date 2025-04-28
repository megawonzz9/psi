const canvas = document.getElementById("graphCanvas");
const ctx = canvas.getContext("2d");
let width = canvas.width;
let height = canvas.height;
let scale = 40;
let centerX = width / 2;
let centerY = height / 2;

function drawGrid() {
  ctx.strokeStyle = "#eee";
  ctx.lineWidth = 1;
  ctx.beginPath();

  const pixelsPerUnit = scale;
  const niceSteps = [1, 2, 5];
  let logicalStep = Math.pow(10, Math.floor(Math.log10(100 / pixelsPerUnit)));
  if (logicalStep < 0.01) {
    logicalStep = 0.01;
  }

  let bestStep = logicalStep;
  for (let i = 0; i < niceSteps.length; i++) {
    if (pixelsPerUnit * logicalStep * niceSteps[i] >= 40) { // min. 40px między liniami
      bestStep = logicalStep * niceSteps[i];
      break;
    }
  }

  const stepPx = bestStep * pixelsPerUnit;

  for (let x = centerX % stepPx; x <= width; x += stepPx) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }

  for (let y = centerY % stepPx; y <= height; y += stepPx) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }

  ctx.stroke();

  // Numerki
  ctx.fillStyle = "#000";
  ctx.font = "10px Arial";

  for (let x = centerX % stepPx; x <= width; x += stepPx) {
    let value = ((x - centerX) / pixelsPerUnit).toFixed(2);
    ctx.fillText(value, x + 2, centerY + 12);
  }

  for (let y = centerY % stepPx; y <= height; y += stepPx) {
    let value = ((centerY - y) / pixelsPerUnit).toFixed(2);
    ctx.fillText(value, centerX + 2, y - 2);
  }
}

function drawAxes() {
  ctx.strokeStyle = "#aaa";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, centerY);
  ctx.lineTo(width, centerY);
  ctx.moveTo(centerX, 0);
  ctx.lineTo(centerX, height);
  ctx.stroke();
}

function drawGraph() {
  const input = document.getElementById("functionInput").value;
  let expr;
  try {
    expr = math.compile(input);
  } catch (e) {
    alert("Błąd: " + e.message);
    return;
  }

  document.cookie = "lastFunc=" + encodeURIComponent(input) + ";path=/";

  ctx.clearRect(0, 0, width, height);
  drawGrid();
  drawAxes();

  ctx.beginPath();
  ctx.strokeStyle = "blue";
  ctx.lineWidth = 2;

  let first = true;
  for (let x = -centerX; x < width - centerX; x++) {
    const graphX = x / scale;
    let graphY;
    try {
      graphY = expr.evaluate({ x: graphX });
    } catch {
      continue;
    }
    const px = centerX + x;
    const py = centerY - graphY * scale;

    if (first) {
      ctx.moveTo(px, py);
      first = false;
    } else {
      ctx.lineTo(px, py);
    }
  }

  ctx.stroke();
}

function loadLastFunc() {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'lastFunc') {
      document.getElementById("functionInput").value = decodeURIComponent(value);
    }
  }
}

// Zoomowanie scroll kółkiem
canvas.addEventListener('wheel', function(event) {
  event.preventDefault();
  if (event.deltaY < 0) {
    scale *= 1.1;
  } else {
    scale /= 1.1;
  }
  drawGraph();
});

// Obsługa zmiany rozmiaru okna
window.addEventListener('resize', function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  width = canvas.width;
  height = canvas.height;
  centerX = width / 2;
  centerY = height / 2;
  drawGraph();
});

window.onload = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  width = canvas.width;
  height = canvas.height;
  centerX = width / 2;
  centerY = height / 2;
  drawGrid();
  drawAxes();
  loadLastFunc();
};
