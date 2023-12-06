import { useEffect } from "react";

export default function useOutsideClick(ref, cb) {
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) cb();
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.addEventListener("mousedown", handleOutsideClick);
  }, [ref, cb]);
}
