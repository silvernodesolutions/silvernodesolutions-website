// Silvernode Solutions — hero node network + small utilities

(function () {
  // Footer year
  var yearEl = document.getElementById('snYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Hero node-network canvas
  var canvas = document.getElementById('snNodeCanvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var nodes = [];
  var NODE_COUNT = 46;
  var LINK_DIST = 150;
  var width, height, dpr;

  function resize() {
    var rect = canvas.parentElement.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function makeNodes() {
    nodes = [];
    var count = width < 768 ? 22 : NODE_COUNT;
    for (var i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.4 + 1
      });
    }
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    // update positions
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;
    }

    // links
    for (var a = 0; a < nodes.length; a++) {
      for (var b = a + 1; b < nodes.length; b++) {
        var dx = nodes[a].x - nodes[b].x;
        var dy = nodes[a].y - nodes[b].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          var alpha = (1 - dist / LINK_DIST) * 0.22;
          ctx.strokeStyle = 'rgba(91, 157, 255,' + alpha + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nodes[a].x, nodes[a].y);
          ctx.lineTo(nodes[b].x, nodes[b].y);
          ctx.stroke();
        }
      }
    }

    // nodes
    for (var i2 = 0; i2 < nodes.length; i2++) {
      var nd = nodes[i2];
      ctx.beginPath();
      ctx.arc(nd.x, nd.y, nd.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(195, 201, 209, 0.55)';
      ctx.fill();
    }

    if (!reduceMotion) requestAnimationFrame(step);
  }

  resize();
  makeNodes();
  step();

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      resize();
      makeNodes();
      if (reduceMotion) step();
    }, 200);
  });
})();
