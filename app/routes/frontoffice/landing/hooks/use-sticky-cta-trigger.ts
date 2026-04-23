import { useEffect, useRef } from "react";
import { useLandingUIStore } from "../stores/use-landing-ui-store";

/**
 * useStickyCtaTrigger
 *
 * Attaches an IntersectionObserver to a sentinel element (e.g. the bottom
 * of the hero section). When the sentinel leaves the viewport, the sticky
 * CTA bar becomes visible.
 *
 * Usage:
 *   const sentinelRef = useStickyCtaTrigger();
 *   <div ref={sentinelRef} />   ← place at bottom of hero
 */
export function useStickyCtaTrigger() {
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const setStickyCTAVisible = useLandingUIStore((s) => s.setStickyCTAVisible);

    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setStickyCTAVisible(!entry.isIntersecting);
            },
            { threshold: 0 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [setStickyCTAVisible]);

    return sentinelRef;
}