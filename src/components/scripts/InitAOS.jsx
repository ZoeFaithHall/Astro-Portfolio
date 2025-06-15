import { useEffect } from "react";
import AOS from "aos";

export default function InitAOS() {
  useEffect(() => {
    AOS.init({
      once: true,
      duration: 600,
    });
  }, []);

  return null;
}
