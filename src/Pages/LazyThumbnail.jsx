// src/components/LazyThumbnail.jsx
import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

function LazyThumbnail({
  src,
  fallback,
  className,
  bgColor = "#222",
  height = "80px",
  eager = false, // 🔥 NEW: if true → no lazy loading
}) {
  const ref = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(eager); // load immediately if eager
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // 🚀 If eager mode, skip intersection observer
    if (eager) return;

    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "100px", // start loading slightly before visible
        threshold: 0.1,
      }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [eager]);

  return (
    <div
      ref={ref}
      className={`${className || ""} GameThumbnail position-relative`}
      style={{
        backgroundColor: bgColor,
        minHeight: height,
        width: "100%",
        overflow: "hidden",
        borderRadius: "8px",
      }}
    >
      {shouldLoad && (
        <img
          src={src || fallback}
          alt="game thumbnail"
          loading={eager ? "eager" : "lazy"}
          onLoad={() => setLoaded(true)}
          onError={(e) => {
            if (fallback) e.target.src = fallback;
          }}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "8px",
            opacity: loaded ? 1 : 0,
            transition: "opacity 300ms ease-in-out",
          }}
        />
      )}
    </div>
  );
}

LazyThumbnail.propTypes = {
  src: PropTypes.string,
  fallback: PropTypes.string,
  className: PropTypes.string,
  bgColor: PropTypes.string,
  height: PropTypes.string,
  eager: PropTypes.bool, // ✅ added
};

export default LazyThumbnail;