"use client";

import React, { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  twinkleSpeed: number;
}

interface Meteor {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  active: boolean;
}

interface ParticleNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseColor: string;
}

export function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || 800);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
      initParticles();
    };

    window.addEventListener("resize", handleResize);

    // Track dark mode via class on html element
    let isDark = document.documentElement.classList.contains("dark");

    const observer = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains("dark");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Mouse coordinates tracking relative to canvas
    const mouse: { x: number | null; y: number | null; radius: number } = {
      x: null,
      y: null,
      radius: 140,
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      } else {
        mouse.x = null;
        mouse.y = null;
      }
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Color choices for constellation nodes
    const darkColors = [
      "rgba(124, 58, 237,", // Violet
      "rgba(168, 85, 247,", // Purple
      "rgba(217, 70, 239,", // Fuchsia
      "rgba(192, 132, 252,", // Lavender
      "rgba(99, 102, 241,", // Indigo
    ];

    const lightColors = [
      "rgba(124, 58, 237,", // Violet
      "rgba(147, 51, 234,", // Purple
      "rgba(168, 85, 247,", // Orchid
      "rgba(217, 70, 239,", // Fuchsia
    ];

    let particles: ParticleNode[] = [];

    const initParticles = () => {
      const count = Math.min(Math.max(Math.floor((width * height) / 13000), 38), 75);
      particles = Array.from({ length: count }, () => {
        const colors = isDark ? darkColors : lightColors;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.7,
          vy: (Math.random() - 0.5) * 0.7,
          radius: Math.random() * 2 + 1.2,
          baseColor: colors[Math.floor(Math.random() * colors.length)],
        };
      });
    };

    initParticles();

    // Generate Ambient Stars / Sparkles
    const starCount = Math.floor((width * height) / 6000);
    const stars: Star[] = Array.from({ length: Math.max(starCount, 70) }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.85,
      size: Math.random() * 1.5 + 0.4,
      opacity: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.05 + 0.01,
      twinkleSpeed: Math.random() * 0.03 + 0.01,
    }));

    // Generate Shooting Stars / Meteors
    const meteors: Meteor[] = Array.from({ length: 2 }, () => ({
      x: 0,
      y: 0,
      length: Math.random() * 60 + 80,
      speed: Math.random() * 6 + 6,
      angle: Math.PI / 4,
      opacity: 0,
      active: false,
    }));

    const triggerMeteor = () => {
      const inactive = meteors.find((m) => !m.active);
      if (inactive) {
        inactive.x = Math.random() * (width * 0.8) + width * 0.1;
        inactive.y = Math.random() * (height * 0.25);
        inactive.opacity = 1;
        inactive.active = true;
      }
    };

    const meteorInterval = setInterval(triggerMeteor, 4000);

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Sky Background Gradient (Dark Space vs Daylight Sky)
      const spaceGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (isDark) {
        spaceGrad.addColorStop(0, "#070510");
        spaceGrad.addColorStop(0.4, "#0f0c20");
        spaceGrad.addColorStop(0.85, "#181236");
        spaceGrad.addColorStop(1, "#070510");
      } else {
        spaceGrad.addColorStop(0, "#FAF5FF");
        spaceGrad.addColorStop(0.4, "#F5F3FF");
        spaceGrad.addColorStop(0.85, "#EDE9FE");
        spaceGrad.addColorStop(1, "#FAF5FF");
      }
      ctx.fillStyle = spaceGrad;
      ctx.fillRect(0, 0, width, height);

      // Ambient Twinkling Stars
      stars.forEach((star) => {
        star.opacity += Math.sin(tick * star.twinkleSpeed) * 0.015;
        const currentOpacity = Math.max(0.12, Math.min(0.9, star.opacity));

        if (isDark) {
          ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity * 0.7})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = `rgba(124, 58, 237, ${currentOpacity * 0.2})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 1.1, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Update & Draw Interactive Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Physics movement
        p.x += p.vx;
        p.y += p.vy;

        // Bounce from boundaries
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse repulsion physics
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius && dist > 0) {
            const force = (mouse.radius - dist) / mouse.radius;
            p.x -= (dx / dist) * force * 3.2;
            p.y -= (dy / dist) * force * 3.2;
          }
        }

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `${p.baseColor} 0.75)`
          : `${p.baseColor} 0.55)`;
        ctx.fill();

        // Node subtle halo
        if (p.radius > 1.8) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
          ctx.fillStyle = isDark
            ? `${p.baseColor} 0.15)`
            : `${p.baseColor} 0.1)`
          ctx.fill();
        }

        // Connective Lines between nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const maxDist = 115;
          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * (isDark ? 0.3 : 0.18);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = isDark
              ? `rgba(192, 132, 252, ${opacity})`
              : `rgba(124, 58, 237, ${opacity})`;
            ctx.lineWidth = isDark ? 0.8 : 0.7;
            ctx.stroke();
          }
        }

        // Mouse Cursor dynamic tether connection
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const opacity = (1 - dist / mouse.radius) * (isDark ? 0.45 : 0.28);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = isDark
              ? `rgba(217, 70, 239, ${opacity})`
              : `rgba(147, 51, 234, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw Meteors (Shooting Stars)
      meteors.forEach((m) => {
        if (!m.active) return;

        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;
        m.opacity -= 0.012;

        if (m.opacity <= 0 || m.x > width || m.y > height) {
          m.active = false;
          return;
        }

        const tailX = m.x - Math.cos(m.angle) * m.length;
        const tailY = m.y - Math.sin(m.angle) * m.length;

        const meteorGrad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
        if (isDark) {
          meteorGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
          meteorGrad.addColorStop(0.7, `rgba(96, 165, 250, ${m.opacity * 0.6})`);
          meteorGrad.addColorStop(1, `rgba(255, 255, 255, ${m.opacity})`);
        } else {
          meteorGrad.addColorStop(0, "rgba(37, 99, 235, 0)");
          meteorGrad.addColorStop(0.7, `rgba(37, 99, 235, ${m.opacity * 0.35})`);
          meteorGrad.addColorStop(1, `rgba(59, 130, 246, ${m.opacity * 0.7})`);
        }

        ctx.strokeStyle = meteorGrad;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(m.x, m.y);
        ctx.stroke();
      });

      // Luminous Planetary Horizon Arc
      const horizonY = height * 0.62;
      const arcHeight = height * 0.2;

      // Atmospheric Glow
      const glowGrad = ctx.createRadialGradient(
        width / 2,
        horizonY + 80,
        10,
        width / 2,
        horizonY + 80,
        width * 0.65
      );

      if (isDark) {
        glowGrad.addColorStop(0, "rgba(37, 99, 235, 0.4)");
        glowGrad.addColorStop(0.3, "rgba(59, 130, 246, 0.2)");
        glowGrad.addColorStop(0.65, "rgba(14, 165, 233, 0.08)");
        glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      } else {
        glowGrad.addColorStop(0, "rgba(37, 99, 235, 0.18)");
        glowGrad.addColorStop(0.3, "rgba(59, 130, 246, 0.09)");
        glowGrad.addColorStop(0.65, "rgba(14, 165, 233, 0.04)");
        glowGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
      }

      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      // Planet Horizon Curved Line
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, horizonY + arcHeight);
      ctx.quadraticCurveTo(width / 2, horizonY - 30, width, horizonY + arcHeight);

      if (isDark) {
        ctx.strokeStyle = "rgba(147, 197, 253, 0.75)";
        ctx.lineWidth = 2;
        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = 20;
        ctx.stroke();

        ctx.strokeStyle = "rgba(37, 99, 235, 0.5)";
        ctx.lineWidth = 5;
        ctx.shadowColor = "#2563eb";
        ctx.shadowBlur = 30;
        ctx.stroke();
      } else {
        ctx.strokeStyle = "rgba(37, 99, 235, 0.4)";
        ctx.lineWidth = 2;
        ctx.shadowColor = "#2563eb";
        ctx.shadowBlur = 15;
        ctx.stroke();

        ctx.strokeStyle = "rgba(59, 130, 246, 0.25)";
        ctx.lineWidth = 5;
        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = 20;
        ctx.stroke();
      }
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      clearInterval(meteorInterval);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none -z-10"
    />
  );
}

