// shared-particles.js
// (function() {
//   const particleCanvas = document.getElementById('particle-canvas');
//   if (!particleCanvas) return; // Safety check

//   const ctx = particleCanvas.getContext('2d');
//   let particles = [];

//   function resizeCanvas() {
//     particleCanvas.width = window.innerWidth;
//     particleCanvas.height = window.innerHeight;
//   }

//   window.addEventListener('resize', resizeCanvas);
//   resizeCanvas();

//   // Initialize particles
//   for (let i = 0; i < 70; i++) {
//     particles.push({
//       x: Math.random() * particleCanvas.width,
//       y: Math.random() * particleCanvas.height,
//       r: Math.random() * 2 + 1,
//       d: Math.random() * 0.5 + 0.2,
//       opacity: Math.random() * 0.5 + 0.3
//     });
//   }

//   function drawParticles() {
//     ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

//     particles.forEach(p => {
//       ctx.beginPath();
//       const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
//       grad.addColorStop(0, `rgba(255, 220, 50, ${p.opacity})`);
//       grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
//       ctx.fillStyle = grad;
//       ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
//       ctx.fill();
//     });

//     moveParticles();
//     requestAnimationFrame(drawParticles);
//   }

//   function moveParticles() {
//     particles.forEach(p => {
//       p.y += p.d;
//       p.x += Math.sin(p.y * 0.01) * 0.2;
//       if (p.y > particleCanvas.height) {
//         p.y = -10;
//         p.x = Math.random() * particleCanvas.width;
//       }
//     });
//   }

//   // Start animation
//   drawParticles();
// })();