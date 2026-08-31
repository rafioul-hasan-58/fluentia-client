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

export function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || 750);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
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

    // Generate Stars / Sparkles
    const starCount = Math.floor((width * height) / 4500);
    const stars: Star[] = Array.from({ length: Math.max(starCount, 120) }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.85,
      size: Math.random() * 1.8 + 0.5,
      opacity: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.05 + 0.01,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
    }));

    // Meteors / Shooting lights
    const meteors: Meteor[] = Array.from({ length: 3 }, () => ({
      x: Math.random() * width,
      y: Math.random() * (height * 0.5),
      length: Math.random() * 80 + 50,
      speed: Math.random() * 6 + 7,
      angle: Math.PI / 4,
      opacity: 0,
      active: false,
    }));

    const triggerMeteor = () => {
      const inactive = meteors.find((m) => !m.active);
      if (inactive) {
        inactive.x = Math.random() * (width * 0.8) + width * 0.1;
        inactive.y = Math.random() * (height * 0.3);
        inactive.opacity = 1;
        inactive.active = true;
      }
    };

    const meteorInterval = setInterval(triggerMeteor, 3500);

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Sky Background Gradient (Dark Space vs Daylight Sky)
      const spaceGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (isDark) {
        spaceGrad.addColorStop(0, "#030712");
        spaceGrad.addColorStop(0.5, "#0b132b");
        spaceGrad.addColorStop(0.85, "#101d42");
        spaceGrad.addColorStop(1, "#030712");
      } else {
        spaceGrad.addColorStop(0, "#F8FAFC");
        spaceGrad.addColorStop(0.4, "#EFF6FF");
        spaceGrad.addColorStop(0.85, "#DBEAFE");
        spaceGrad.addColorStop(1, "#F8FAFC");
      }
      ctx.fillStyle = spaceGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw Twinkling Stars (in Dark) or Soft Shimmer Sparkles (in Light)
      stars.forEach((star) => {
        star.opacity += Math.sin(tick * star.twinkleSpeed) * 0.015;
        const currentOpacity = Math.max(0.15, Math.min(1, star.opacity));

        if (isDark) {
          ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fill();

          if (star.size > 1.4) {
            ctx.fillStyle = `rgba(147, 197, 253, ${currentOpacity * 0.4})`;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size * 2.2, 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          // Daylight shimmer particles
          ctx.fillStyle = `rgba(37, 99, 235, ${currentOpacity * 0.25})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

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
      const horizonY = height * 0.58;
      const arcHeight = height * 0.22;

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
        glowGrad.addColorStop(0, "rgba(37, 99, 235, 0.45)");
        glowGrad.addColorStop(0.3, "rgba(59, 130, 246, 0.25)");
        glowGrad.addColorStop(0.65, "rgba(14, 165, 233, 0.12)");
        glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      } else {
        glowGrad.addColorStop(0, "rgba(37, 99, 235, 0.22)");
        glowGrad.addColorStop(0.3, "rgba(59, 130, 246, 0.12)");
        glowGrad.addColorStop(0.65, "rgba(14, 165, 233, 0.05)");
        glowGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
      }

      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      // Planet Horizon Curved Line
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, horizonY + arcHeight);
      ctx.quadraticCurveTo(width / 2, horizonY - 40, width, horizonY + arcHeight);

      if (isDark) {
        ctx.strokeStyle = "rgba(147, 197, 253, 0.85)";
        ctx.lineWidth = 2.5;
        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = 24;
        ctx.stroke();

        ctx.strokeStyle = "rgba(37, 99, 235, 0.6)";
        ctx.lineWidth = 6;
        ctx.shadowColor = "#2563eb";
        ctx.shadowBlur = 35;
        ctx.stroke();
      } else {
        ctx.strokeStyle = "rgba(37, 99, 235, 0.5)";
        ctx.lineWidth = 2.5;
        ctx.shadowColor = "#2563eb";
        ctx.shadowBlur = 18;
        ctx.stroke();

        ctx.strokeStyle = "rgba(59, 130, 246, 0.3)";
        ctx.lineWidth = 6;
        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = 25;
        ctx.stroke();
      }
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
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
