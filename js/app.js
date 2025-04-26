const canvas = document.getElementById("graphCanvas");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
const scale = 40;
const centerX = width / 2;
const centerY = height / 2;

function drawAxes() {
  ctx.strokeStyle = "#aaa";
  ctx.lineWidth = 1;
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

  document.cookie = "lastFunc=" + input + ";path=/";

  ctx.clearRect(0, 0, width, height);
  drawAxes();

  ctx.beginPath();
  ctx.strokeStyle = "blue";
  ctx.lineWidth = 2;

  let first = true;
  for (let x = -width / 2; x < width / 2; x++) {
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

window.onload = () => {
  drawAxes();
  loadLastFunc();
};
