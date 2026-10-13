"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function ScrollMotion() {
  const pathname = usePathname();
  const progress = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    let observer: IntersectionObserver | undefined;
    let frame = 0;
    const showEverything = () => elements.forEach(element => element.classList.remove("reveal-pending"));

    function configureMotion() {
      observer?.disconnect();
      showEverything();
      if (preference.matches || !("IntersectionObserver" in window)) return;
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.remove("reveal-pending");
          observer?.unobserve(entry.target);
        });
      }, { threshold: 0.06, rootMargin: "0px 0px -24px 0px" });
      elements.forEach(element => {
        // Above-the-fold content and all content without JS stay visible.
        if (element.getBoundingClientRect().top > window.innerHeight) {
          element.classList.add("reveal-pending");
          observer?.observe(element);
        }
      });
    }

    function updateProgress() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const height = document.documentElement.scrollHeight - window.innerHeight;
        const amount = height > 0 ? Math.min(1, Math.max(0, window.scrollY / height)) : 0;
        if (progress.current) progress.current.style.transform = `scaleX(${amount})`;
      });
    }

    configureMotion();
    updateProgress();
    preference.addEventListener("change", configureMotion);
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      observer?.disconnect();
      showEverything();
      cancelAnimationFrame(frame);
      preference.removeEventListener("change", configureMotion);
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [pathname]);

  return <div className="reading-progress" ref={progress} aria-hidden="true" />;
}
