
/* PAGE NAVIGATION */

function goTo(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });

  const target = document.getElementById(pageId);
  target.classList.add('active');

  if (pageId === 'celebration') {
    requestAnimationFrame(() => {
      resizeCanvas();
      startAnimation();
      launchCelebration();
    });
  }
}

/* GIFT BOXES */

function openGift(type) {
  if (type === 'chocolate') {
    const box = document.getElementById('giftChocolate');
    const reveal = document.getElementById('chocolateReveal');

    box.classList.add('open');
    reveal.classList.add('show');
  }

  if (type === 'laddoo') {
    const box = document.getElementById('giftLaddoo');
    const reveal = document.getElementById('laddooReveal');

    box.classList.add('open');
    reveal.classList.add('show');
  }
}

/* FIREWORKS */

const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');

let width = 0;
let height = 0;
let particles = [];
let rockets = [];
let animationRunning = false;

function resizeCanvas() {
  const page = document.getElementById('celebration');

  width = page.clientWidth;
  height = page.clientHeight;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = width * dpr;
  canvas.height = height * dpr;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener('resize', () => {
  if (document.getElementById('celebration').classList.contains('active')) {
    resizeCanvas();
  }
});

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function launchRocket(x, y) {
  rockets.push({
    x: x,
    y: height + 10,
    targetY: y,
    speed: random(5, 8),
    color: `hsl(${random(0, 360)}, 100%, 65%)`
  });
}

function burst(x, y, color) {
  const count = 95;

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;
    const speed = random(1.5, 6);

    particles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 1,
      decay: random(.008, .018),
      radius: random(1.5, 3.5),
      color: color || `hsl(${random(0, 360)}, 100%, 65%)`
    });
  }
}

function launchCelebration() {
  const positions = [
    [width * .18, height * .24],
    [width * .82, height * .22],
    [width * .5, height * .12],
    [width * .12, height * .55],
    [width * .88, height * .55]
  ];

  positions.forEach((pos, index) => {
    setTimeout(() => {
      launchRocket(pos[0], pos[1]);
    }, index * 180);
  });
}

function celebrate() {
  launchCelebration();

  setTimeout(() => {
    launchCelebration();
  }, 300);

  setTimeout(() => {
    launchCelebration();
  }, 650);
}

function startAnimation() {
  if (animationRunning) return;

  animationRunning = true;
  requestAnimationFrame(animate);
}

function animate() {
  ctx.clearRect(0, 0, width, height);

  /* ROCKETS */

  for (let i = rockets.length - 1; i >= 0; i--) {
    const rocket = rockets[i];

    rocket.y -= rocket.speed;

    ctx.beginPath();
    ctx.arc(rocket.x, rocket.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = rocket.color;
    ctx.shadowBlur = 15;
    ctx.shadowColor = rocket.color;
    ctx.fill();
    ctx.shadowBlur = 0;

    if (rocket.y <= rocket.targetY) {
      burst(rocket.x, rocket.y, rocket.color);
      rockets.splice(i, 1);
    }
  }

  /* FIREWORK PARTICLES */

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];

    p.x += p.vx;
    p.y += p.vy;

    p.vx *= .985;
    p.vy *= .985;
    p.vy += .025;
    p.alpha -= p.decay;

    if (p.alpha <= 0) {
      particles.splice(i, 1);
      continue;
    }

    ctx.globalAlpha = p.alpha;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.shadowBlur = 12;
    ctx.shadowColor = p.color;
    ctx.fill();
  }

  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;

  requestAnimationFrame(animate);
}
