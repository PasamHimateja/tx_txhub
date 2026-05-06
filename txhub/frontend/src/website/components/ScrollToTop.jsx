import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (hash && hash.startsWith("#")) {
        const id = hash.substring(1);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        // 🔥 FORCE scroll multiple times to override layout shift
        window.scrollTo(0, 0);

        setTimeout(() => window.scrollTo(0, 0), 50);
        setTimeout(() => window.scrollTo(0, 0), 150);
        setTimeout(() => window.scrollTo(0, 0), 300);
      }
    };

    handleScroll();
  }, [pathname, hash, key]);

  return null;
};

export default ScrollToTop;