import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * ScrollToTop Component
 * Automatically scrolls to the top of the page when the route changes
 * This ensures users start at the top of each new screen
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // If navigation was via browser Back/Forward (POP), do not auto-scroll.
    // This preserves the user's scroll position when they go back to a previous page.
    if (navigationType === 'POP') return;
    // Try to scroll the window/document and also the app's scrollable container.
    // Run on next animation frame and again after a short timeout in case layout updates after route change.
    const doScroll = () => {
      try {
        if (typeof window !== 'undefined' && window.scrollTo) {
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        }

        if (document && document.scrollingElement) {
          document.scrollingElement.scrollTop = 0;
        }

        const appScroll = document.querySelector('[data-app-scroll]');
        if (appScroll) appScroll.scrollTop = 0;
      } catch {
        // ignore errors in environments without DOM
      }
    };

    const rafId = typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame(doScroll) : null;
    const timeoutIds = [setTimeout(doScroll, 50), setTimeout(doScroll, 200)];
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      timeoutIds.forEach((id) => clearTimeout(id));
    };
  }, [pathname, navigationType]);

  return null;
};

export default ScrollToTop;
