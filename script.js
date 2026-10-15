"use strict";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const year = document.querySelector("#year");
if (year) year.textContent = String(new Date().getFullYear());

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !reducedMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const canvas = document.querySelector("#hero-canvas");
const art = document.querySelector(".hero-art");
const context = canvas && canvas.getContext ? canvas.getContext("2d") : null;

if (canvas && context && art) {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let width = 0;
  let height = 0;
  let frame = 0;
  let elapsed = 0;
  let previousTime = 0;
  let isVisible = true;

  const particles = Array.from({ length: 42 }, (_, index) => {
    const seed = index * 127.1;
    return {
      angle: seed * 0.017,
      radius: 0.27 + ((seed * 0.013) % 0.27),
      size: 0.5 + ((seed * 0.031) % 1.5),
      alpha: 0.16 + ((seed * 0.019) % 0.46)
    };
  });

  function resizeCanvas() {
    const bounds = art.getBoundingClientRect();
    width = bounds.width;
    height = bounds.height;
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    draw();
  }

  function draw() {
    context.clearRect(0, 0, width, height);
    const size = Math.min(width, height);
    const radius = size * 0.305;
    const centerX = width * (0.5 + pointer.x * 0.035);
    const centerY = height * (0.48 + pointer.y * 0.035);

    const glow = context.createRadialGradient(
      centerX - radius * 0.28, centerY - radius * 0.38, radius * 0.04,
      centerX, centerY, radius * 1.16
    );
    glow.addColorStop(0, "#f2f5d5");
    glow.addColorStop(0.13, "#c9f37a");
    glow.addColorStop(0.35, "#74d3c1");
    glow.addColorStop(0.66, "#4385a8");
    glow.addColorStop(0.88, "#1d354b");
    glow.addColorStop(1, "rgba(9,16,24,0)");
    context.fillStyle = glow;
    context.beginPath();
    context.arc(centerX, centerY, radius * 1.17, 0, Math.PI * 2);
    context.fill();

    context.save();
    context.beginPath();
    context.arc(centerX, centerY, radius * 0.98, 0, Math.PI * 2);
    context.clip();
    const shadow = context.createLinearGradient(centerX - radius, centerY, centerX + radius, centerY);
    shadow.addColorStop(0, "rgba(5,10,18,.76)");
    shadow.addColorStop(0.33, "rgba(14,30,40,.08)");
    shadow.addColorStop(0.74, "rgba(10,20,33,.08)");
    shadow.addColorStop(1, "rgba(2,6,13,.82)");
    context.fillStyle = shadow;
    context.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);

    const sheen = context.createRadialGradient(
      centerX - radius * 0.42, centerY - radius * 0.56, 0,
      centerX - radius * 0.3, centerY - radius * 0.35, radius * 1.2
    );
    sheen.addColorStop(0, "rgba(255,255,230,.82)");
    sheen.addColorStop(0.08, "rgba(201,243,122,.35)");
    sheen.addColorStop(0.35, "rgba(146,217,255,.12)");
    sheen.addColorStop(1, "rgba(5,10,18,0)");
    context.fillStyle = sheen;
    context.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);

    context.globalCompositeOperation = "screen";
    for (let ring = 0; ring < 7; ring += 1) {
      const offset = (ring - 3) * radius * 0.19 + Math.sin(elapsed * 0.55 + ring) * radius * 0.025;
      const widthAtRing = Math.sqrt(Math.max(0, radius * radius - offset * offset));
      context.beginPath();
      context.ellipse(centerX + pointer.x * 7, centerY + offset + pointer.y * 5, widthAtRing, radius * 0.14, -0.2, 0, Math.PI * 2);
      context.strokeStyle = `rgba(186,235,215,${0.045 + (ring % 3) * 0.014})`;
      context.lineWidth = 1;
      context.stroke();
    }
    context.restore();

    context.globalCompositeOperation = "source-over";
    particles.forEach((particle, index) => {
      const angle = particle.angle + elapsed * (index % 2 ? 0.035 : -0.025);
      const distance = size * particle.radius;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance * 0.78;
      context.beginPath();
      context.arc(x, y, particle.size, 0, Math.PI * 2);
      context.fillStyle = `rgba(226,245,220,${particle.alpha})`;
      context.fill();
    });
  }

  function animate(time) {
    if (!isVisible || document.hidden) {
      frame = 0;
      previousTime = 0;
      return;
    }
    if (previousTime) elapsed += Math.min(time - previousTime, 48) / 1000;
    previousTime = time;
    pointer.x += (pointer.targetX - pointer.x) * 0.045;
    pointer.y += (pointer.targetY - pointer.y) * 0.045;
    draw();
    frame = window.requestAnimationFrame(animate);
  }

  function startAnimation() {
    if (!reducedMotion && !frame && isVisible && !document.hidden) {
      frame = window.requestAnimationFrame(animate);
    }
  }

  art.addEventListener("pointermove", (event) => {
    if (reducedMotion || event.pointerType === "touch") return;
    const bounds = art.getBoundingClientRect();
    pointer.targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    pointer.targetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    startAnimation();
  });
  art.addEventListener("pointerleave", () => {
    pointer.targetX = 0;
    pointer.targetY = 0;
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && frame) {
      window.cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
    } else {
      startAnimation();
    }
  });

  if ("IntersectionObserver" in window) {
    const artObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (!isVisible && frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
        previousTime = 0;
      } else {
        startAnimation();
      }
    });
    artObserver.observe(art);
  }

  const resizeObserver = new ResizeObserver(resizeCanvas);
  resizeObserver.observe(art);
  resizeCanvas();
  startAnimation();
}
