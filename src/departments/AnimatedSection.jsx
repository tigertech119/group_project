import React, { useEffect, useRef, useState } from "react";

/** Adds .visible when section enters viewport (CSS handles fade/slide) */
export default function AnimatedSection({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setTimeout(() => setShow(true), delay);
            obs.unobserve(node);
          }
        });
      },
      { threshold: 0.12 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`reveal ${show ? "visible" : ""} ${className}`}>
      {children}
    </div>
  );
}
