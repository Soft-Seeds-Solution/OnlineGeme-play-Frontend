import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    if (window.gtag) {
      window.gtag('config', 'G-Z3GCG92JW3', {
        page_path: location.pathname + location.search,
      });
      console.log("📄 Page view tracked:", location.pathname);
    }
  }, [location]);
}

export default usePageTracking;
