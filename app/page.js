'use client';

import { useEffect, useRef, useState } from 'react';

const WORDS = ['EU', 'TE', 'AMO'];

export default function Home() {
  const [positions, setPositions] = useState([]);
  const [revealed, setRevealed] = useState({});
  const refs = useRef([]);

  useEffect(() => {
    const padding = 30;
    const placedBoxes = [];

    const newPositions = refs.current.map((el) => {
      const width = el?.offsetWidth || 120;
      const height = el?.offsetHeight || 60;
      const maxX = Math.max(padding, window.innerWidth - width - padding);
      const maxY = Math.max(padding, window.innerHeight - height - padding);

      let left = padding;
      let top = padding;
      let attempts = 0;
      let overlaps = true;

      while (overlaps && attempts < 150) {
        left = Math.floor(Math.random() * (maxX - padding + 1)) + padding;
        top = Math.floor(Math.random() * (maxY - padding + 1)) + padding;

        overlaps = placedBoxes.some(
          (b) =>
            !(
              left + width + padding < b.left ||
              left > b.left + b.width + padding ||
              top + height + padding < b.top ||
              top > b.top + b.height + padding
            )
        );
        attempts++;
      }

      placedBoxes.push({ left, top, width, height });
      return { left, top };
    });

    setPositions(newPositions);
  }, []);

  const reveal = (index) => {
    setRevealed((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <main>
      {WORDS.map((word, i) => (
        <span
          key={word}
          ref={(el) => (refs.current[i] = el)}
          className={`word ${revealed[i] ? 'visible' : ''}`}
          style={positions[i] ? { left: `${positions[i].left}px`, top: `${positions[i].top}px` } : undefined}
          onPointerEnter={() => reveal(i)}
          onTouchStart={() => reveal(i)}
        >
          {word}
        </span>
      ))}
    </main>
  );
}
