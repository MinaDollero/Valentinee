import React, { useEffect, useState } from 'react';

const HeartCanvas: React.FC = () => {
  const [hearts, setHearts] = useState<{ id: number; left: string; size: number; delay: string; duration: string }[]>([]);

  useEffect(() => {
    const items = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 20 + 10,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 10 + 10}s`
    }));
    setHearts(items);
  }, []);

  return (
    <div className="hearts" aria-hidden>
      {hearts.map(h => (
        <div
          key={h.id}
          className="heart"
          style={{
            left: h.left,
            fontSize: `${h.size}px`,
            animationDelay: h.delay,
            animationDuration: h.duration,
            opacity: 0.4
          }}
        >
          ❤️
        </div>
      ))}
    </div>
  );
};

export default HeartCanvas;