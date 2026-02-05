import { useCallback } from 'react';
import { useGameStore } from '@/store/useGameStore';

export function useServerTime() {
  const offset = useGameStore((state) => state.serverTimeOffset);

  const now = useCallback(() => Date.now() + offset, [offset]);

  return { now };
}
