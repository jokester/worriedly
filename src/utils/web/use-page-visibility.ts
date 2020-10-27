import { useCallback, useEffect, useRef } from 'react';
import { useMounted } from '@jokester/ts-commonutil/lib/react/hook/use-mounted';

export function usePageHidden(): { readonly current: boolean } {
  const docHidden = useRef(false);

  useEffect(() => {
    if (document.addEventListener && 'hidden' in document) {
      const handleChange = () => (docHidden.current = document.hidden);

      document.addEventListener('visibilitychange', handleChange);
      return () => document.removeEventListener('visibilitychange', handleChange);
    }
    return undefined;
  }, []);

  return docHidden;
}

/**
 * like {@code useUnmountPromise()} in react-use
 * because it doesnt work, for unknown reason
 */
export function useWhenMounted(): <T extends Promise<any>>(p: T) => T {
  const mounted = useMounted();

  return useCallback(<T extends Promise<any>>(p: T): T => {
    return new Promise<unknown>((fulfill, reject) =>
      p.then(
        (value) => mounted.current && fulfill(value),
        (reason) => mounted.current && reject(reason),
      ),
    ) as any;
  }, []);
}
