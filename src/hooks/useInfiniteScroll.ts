import { useEffect, useRef } from 'react';

/**
 * Attaches an IntersectionObserver to a sentinel <div> and calls
 * fetchNextPage whenever that sentinel enters the viewport.
 *
 * Usage:
 *   const sentinelRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);
 *   // Place <div ref={sentinelRef} className="load-more-sentinel"> after your table.
 */
export function useInfiniteScroll(
  fetchNextPage: () => void,
  hasNextPage: boolean | undefined,
  isFetchingNextPage: boolean,
): React.RefObject<HTMLDivElement | null> {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return sentinelRef;
}
