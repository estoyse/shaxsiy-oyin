import { useEffect, useState } from 'react';

export function useQuestionTimer(endsAt: number, now: () => number) {
  const [remainingMs, setRemainingMs] = useState(() => Math.max(0, endsAt - now()));

  useEffect(() => {
    const tick = () => {
      const remaining = Math.max(0, endsAt - now());
      setRemainingMs(remaining);
    };

    tick(); // immediate update
    const id = setInterval(tick, 250);

    return () => clearInterval(id);
  }, [endsAt, now]);

  return remainingMs;
}
