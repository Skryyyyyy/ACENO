import React, { useEffect, useRef } from 'react';

export default function SpectrogramVisualizer({ active = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = canvas.parentElement ? canvas.parentElement.clientWidth : 300;
      canvas.height = canvas.parentElement ? canvas.parentElement.clientHeight : 120;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const bars = Array.from({ length: 54 }, () => ({
      val: Math.random() * 0.7 + 0.1,
      speed: Math.random() * 0.04 + 0.015,
      phase: Math.random() * Math.PI * 2,
    }));

    let animId;
    const render = () => {
      ctx.fillStyle = '#060708';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / bars.length;
      for (let i = 0; i < bars.length; i++) {
        bars[i].phase += bars[i].speed;
        const h = (Math.sin(bars[i].phase) * 0.4 + 0.5) * bars[i].val * canvas.height;

        const grad = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - h);
        grad.addColorStop(0, '#14171d');
        grad.addColorStop(0.5, '#64748b');
        grad.addColorStop(1, '#FFFFFF');

        ctx.fillStyle = grad;
        ctx.fillRect(i * barWidth, canvas.height - h, barWidth - 3, h);
      }
      animId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [active]);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
}
