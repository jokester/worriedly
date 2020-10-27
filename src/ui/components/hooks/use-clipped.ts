import { useEffect, useState } from 'react';

export function useClipped(limits: { min: number; max: number }, init = limits.min) {
  const [value, origSetValue] = useState(init);

  const setValue = (v: unknown) => {
    if (typeof v === 'number' && limits.min <= v && v <= limits.max) {
      origSetValue(v);
    }
  };

  useEffect(() => {
    origSetValue((v) => (v < limits.min ? limits.min : v > limits.max ? limits.max : v));
  }, [limits.min, limits.max]);

  return [value, setValue] as const;
}

export function useClippedIndex(array: readonly unknown[], init = 0) {
  return useClipped({ min: 0, max: array.length - 1 }, init);
}
