
import React, { useEffect, useRef } from 'react';

interface DisplayItem { id: string; text: string; color: string; }
interface TagSphereProps { items: DisplayItem[]; isDrawing: boolean; isStopping?: boolean; highlightedId?: string; }

const TagSphere: React.FC<TagSphereProps> = ({ items, isDrawing, isStopping, highlightedId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sphereItems = useRef<{ x: number, y: number, z: number, text: string, color: string, id: string }[]>([]);
  const frameRef = useRef<number | undefined>(undefined);
  
  const angleX = useRef(0.002);
  const angleY = useRef(0.002);
  const targetAngle = useRef(0.002);

  useEffect(() => {
    targetAngle.current = isDrawing ? 0.12 : isStopping ? 0.04 : 0.002;
  }, [isDrawing, isStopping]);

  useEffect(() => {
    const cvs = canvasRef.current!;
    const ctx = cvs.getContext('2d')!;
    const resize = () => { cvs.width = window.innerWidth; cvs.height = window.innerHeight; };
    window.addEventListener('resize', resize); resize();

    // 如果没有数据，显示一些随机的光点作为背景
    const displayData = items.length > 0 ? items : Array.from({length: 40}, (_, i) => ({ id: `bg-${i}`, text: '·', color: 'rgba(34,211,238,0.2)' }));
    const radius = Math.min(cvs.width, cvs.height) * 0.35;
    const count = displayData.length;

    sphereItems.current = displayData.map((item, i) => {
      const phi = Math.acos(-1 + (2 * i) / (count - 1 || 1));
      const theta = Math.sqrt(count * Math.PI) * phi;
      return {
        id: item.id,
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.sin(phi) * Math.sin(theta),
        z: radius * Math.cos(phi),
        text: item.text,
        color: item.color
      };
    });

    const animate = () => {
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      const cx = cvs.width / 2, cy = cvs.height / 2;
      
      angleX.current += (targetAngle.current - angleX.current) * 0.05;
      angleY.current += (targetAngle.current - angleY.current) * 0.05;

      const cX = Math.cos(angleX.current), sX = Math.sin(angleX.current);
      const cY = Math.cos(angleY.current), sY = Math.sin(angleY.current);

      [...sphereItems.current].sort((a,b) => b.z - a.z).forEach(item => {
        const x1 = item.x * cY - item.z * sY;
        const z1 = item.z * cY + item.x * sY;
        const y1 = item.y * cX - z1 * sX;
        const z2 = z1 * cX + item.y * sX;

        item.x = x1; item.y = y1; item.z = z2;

        const p = 600 / (600 + z2);
        const sX_scr = cx + x1 * p, sY_scr = cy + y1 * p;
        const active = item.id === highlightedId;
        
        ctx.save();
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        if (active) {
          ctx.font = `bold ${40 * p}px 'Orbitron'`;
          ctx.shadowBlur = 15; ctx.shadowColor = '#fff';
          ctx.fillStyle = '#fff'; ctx.globalAlpha = 1;
        } else {
          ctx.font = `${14 * p}px 'Noto Sans SC'`;
          ctx.fillStyle = item.color;
          ctx.globalAlpha = Math.max(0.1, (radius - z2) / (radius * 2)) * 0.6;
        }
        ctx.fillText(item.text, sX_scr, sY_scr);
        ctx.restore();
      });
      frameRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => { cancelAnimationFrame(frameRef.current!); window.removeEventListener('resize', resize); };
  }, [items, highlightedId]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

export default TagSphere;
