
import React, { useEffect, useRef } from 'react';

/**
 * 许愿流星特效：在背景中生成流动的发光线条和火花
 */
export const WishEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const stars: any[] = [];
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const createStar = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.5,
      length: Math.random() * 80 + 20,
      speed: Math.random() * 10 + 5,
      opacity: Math.random(),
    });

    for (let i = 0; i < 20; i++) stars.push(createStar());

    let animationFrame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 2;
      
      stars.forEach((s, i) => {
        s.x += s.speed;
        s.y += s.speed * 0.5;
        if (s.x > canvas.width || s.y > canvas.height) {
          stars[i] = createStar();
          stars[i].x = -50;
        }

        const gradient = ctx.createLinearGradient(s.x, s.y, s.x - s.length, s.y - s.length * 0.5);
        gradient.addColorStop(0, `rgba(34, 211, 238, ${s.opacity})`);
        gradient.addColorStop(1, 'rgba(34, 211, 238, 0)');
        
        ctx.strokeStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.length, s.y - s.length * 0.5);
        ctx.stroke();

        // 头部火花
        ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      });
      animationFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[1] opacity-60" />;
};

/**
 * 愤怒火山特效：底部升起的灰烬、火星和红色烟雾
 */
export const VolcanoEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: any[] = [];
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const createParticle = () => ({
      x: Math.random() * canvas.width,
      y: canvas.height + 20,
      size: Math.random() * 3 + 1,
      speedY: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 1,
      opacity: Math.random() * 0.5 + 0.2,
      life: 1,
    });

    for (let i = 0; i < 100; i++) particles.push(createParticle());

    let animationFrame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 底部红光
      const bgGradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - 300);
      bgGradient.addColorStop(0, 'rgba(244, 63, 94, 0.15)');
      bgGradient.addColorStop(1, 'rgba(244, 63, 94, 0)');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, canvas.height - 300, canvas.width, 300);

      particles.forEach((p, i) => {
        p.y -= p.speedY;
        p.x += p.speedX;
        p.life -= 0.002;
        
        if (p.life <= 0 || p.y < 0) {
          particles[i] = createParticle();
        }

        ctx.fillStyle = `rgba(244, 63, 94, ${p.opacity * p.life})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#f43f5e';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      animationFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[1]" />;
};
