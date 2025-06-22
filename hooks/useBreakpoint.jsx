import { useMemo } from 'react';
import useWindowSize from './useWindowSize';

/**
 * Usage:
 *   const { above, below, between, current } = useBreakpoint();
 *
 *   if (above('lg')) { … }
 *   if (between('sm', 'lg')) { … }
 *   console.log(current) // -> "md" | "lg" | "xl" etc.
 */
export default function useBreakpoint() {
  const { width } = useWindowSize();

  /* 1️⃣  Tailwind-style map (edit to taste) */
  const BP = useMemo(
    () => ({
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      '2xl': 1536,
    }),
    []
  );

  /* 2️⃣  Return helpers only after width exists (client side) */
  return useMemo(() => {
    if (typeof width === 'undefined') {
      /* first SSR render – everything false */
      return {
        current: 'xs',
        above: () => false,
        below: () => false,
        between: () => false,
      };
    }

    /* current label */
    const current =
      Object.keys(BP)
        .reverse()
        .find((key) => width >= BP[key]) || 'xs';

    /* helper lambdas */
    const above = (bp) => width >= BP[bp];
    const below = (bp) => width < BP[bp];
    const between = (from, to) => width >= BP[from] && width < BP[to];

    return { current, above, below, between };
  }, [width, BP]);
}
