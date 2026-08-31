const svg = document.querySelector("#connections");

const connections = [];

function connect(from, to) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

  svg.appendChild(line);

  const connection = {
    from,
    to,
    line,
  };

  connections.push(connection);
  updateConnection(connection);

  return connection;
}

function updateConnection({ from, to, line }) {
  const a = from.getBoundingClientRect();
  const b = to.getBoundingClientRect();
  const container = svg.getBoundingClientRect();

  const ax = a.left + a.width / 2 - container.left;
  const ay = a.top + a.height / 2 - container.top;

  const bx = b.left + b.width / 2 - container.left;
  const by = b.top + b.height / 2 - container.top;

  const dx = bx - ax;
  const dy = by - ay;

  function getEdgePoint(cx, cy, width, height, dx, dy) {
    const halfW = width / 2;
    const halfH = height / 2;

    const scaleX = Math.abs(dx) > 0 ? halfW / Math.abs(dx) : Infinity;
    const scaleY = Math.abs(dy) > 0 ? halfH / Math.abs(dy) : Infinity;

    const scale = Math.min(scaleX, scaleY);

    return {
      x: cx + dx * scale,
      y: cy + dy * scale,
    };
  }

  const start = getEdgePoint(ax, ay, a.width, a.height, dx, dy);

  const end = getEdgePoint(bx, by, b.width, b.height, -dx, -dy);

  const shorten = Math.min(60, Math.max(5, window.innerWidth * 0.1));;

  const length = Math.hypot(dx, dy);
  const ux = dx / length;
  const uy = dy / length;

  end.x -= ux * shorten;
  end.y -= uy * shorten;

  line.setAttribute("x1", start.x);
  line.setAttribute("y1", start.y);
  line.setAttribute("x2", end.x);
  line.setAttribute("y2", end.y);
}

function updateConnections() {
  connections.forEach(updateConnection);
}

window.addEventListener("resize", updateConnections);