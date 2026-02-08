import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

export default function InitLenis() {
  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.4, // Animation duration (higher = more drag)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.5, // Adjust scroll speed (lower = slower, more control)
      smoothTouch: false, // Disable on touch devices for native feel
      touchMultiplier: 2,
      infinite: false,
    });

    // Animation loop
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenis.destroy();
    };
  }, []);

  return null;
}
