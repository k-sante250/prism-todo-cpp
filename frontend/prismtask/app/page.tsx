'use client';

import { useMemo, useState, useEffect } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 🧠 鼠标位置（归一化）
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  // 🧠 屏幕尺寸（解决 SSR window 问题）
  const [screen, setScreen] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      setMouse({ x, y });
    };

    const handleResize = () => {
      setScreen({
        w: window.innerWidth,
        h: window.innerHeight,
      });
    };

    // 初始化
    handleResize();

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 💎 生成碎片（稳定）
const shards = useMemo(() => {
  const colors = [
    ['rgba(0,200,255,0.5)', 'rgba(0,120,255,0.5)'], // 蓝
    ['rgba(180,0,255,0.5)', 'rgba(120,0,255,0.5)'], // 紫
    ['rgba(0,255,150,0.5)', 'rgba(0,200,100,0.5)'], // 绿
  ];

  return Array.from({ length: 35 }).map(() => {
    const c = colors[Math.floor(Math.random() * colors.length)];

    return {
      width: 120 + Math.random() * 200,
      height: 120 + Math.random() * 200,
      top: Math.random() * 100,
      left: Math.random() * 100,
      rotate: Math.random() * 360,
      opacity: 0.4 + Math.random() * 0.5,
      depth: Math.random() * 40,
      color1: c[0],
      color2: c[1],
    };
  });
}, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">

      {/* 🌈 碎片层 */}
      <div className="absolute inset-0 z-0">
        {screen.w !== 0 &&
          shards.map((s, i) => {
            // 👉 转换为屏幕坐标
            const x = (s.left / 100) * screen.w;
            const y = (s.top / 100) * screen.h;

            // 👉 鼠标位置（放大一点用于交互）
            const mx = mouse.x * 10;
            const my = mouse.y * 10;

            const dx = mx - x;
            const dy = my - y;

            const dist = Math.sqrt(dx * dx + dy * dy);

            const radius = 200;

            let repelX = 0;
            let repelY = 0;

            if (dist < radius) {
              const force = (radius - dist) / radius;
              repelX = -dx * force * 0.4;
              repelY = -dy * force * 0.4;
            }

            // 👉 视差
            const parallaxX = mouse.x * (s.depth / 40);
            const parallaxY = mouse.y * (s.depth / 40);

            return (
              <div
                key={i}
                className="prism-shard"
                style={{
                  width: `${s.width}px`,
                  height: `${s.height}px`,
                  top: `${s.top}%`,
                  left: `${s.left}%`,
                  opacity: s.opacity,

                  // 给 CSS 用
                  '--rotate': `${s.rotate}deg`,
                  '--c1': s.color1,
                  '--c2': s.color2,

                  // 合并：视差 + 躲避
                  translate: `${parallaxX + repelX}px ${parallaxY + repelY}px`,
                } as React.CSSProperties}
              />
            );
          })}
      </div>

      {/* 🧊 登录卡片 */}
      <div className="relative z-10 bg-white/10 backdrop-blur-xl p-10 rounded-2xl shadow-2xl w-80 border border-white/20">

        <h1 className="text-3xl font-extrabold text-white text-center mb-2">
          PrismTask
        </h1>

        <div className="h-[2px] w-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 mb-6" />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-purple-400"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 text-white font-semibold hover:opacity-90 transition">
          Login
        </button>

      </div>
    </div>
  );
}