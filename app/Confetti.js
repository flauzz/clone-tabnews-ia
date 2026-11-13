'use client';

import { useEffect, useState } from 'react';

const confettiStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
  zIndex: 9999,
};

export default function ConfettiAnimation() {
  const [Confetti, setConfetti] = useState(null);
  const [dimensions, setDimensions] = useState(null);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Respeita quem prefere menos movimento: não baixa nem roda a animação.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let cancelled = false;

    // Carrega a biblioteca só no cliente e depois da hidratação,
    // tirando-a do bundle JavaScript inicial da página.
    import('react-confetti').then((module) => {
      if (!cancelled) {
        setConfetti(() => module.default);
      }
    });

    const updateDimensions = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions, { passive: true });

    return () => {
      cancelled = true;
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  if (!Confetti || !dimensions || isDone) {
    return null;
  }

  return (
    <Confetti
      width={dimensions.width}
      height={dimensions.height}
      recycle={false}
      numberOfPieces={400}
      gravity={0.15}
      // Desmonta o canvas quando todas as peças caem, encerrando o loop de animação.
      onConfettiComplete={() => setIsDone(true)}
      style={confettiStyle}
    />
  );
}
