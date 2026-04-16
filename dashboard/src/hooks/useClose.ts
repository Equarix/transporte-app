import { useEffect, useRef } from "react";

interface UseCloseDivProps {
  closeFunction?: (open: boolean) => void;
}

export const useClose = ({ closeFunction }: UseCloseDivProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        event.target !== document.activeElement
      ) {
        closeFunction?.(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeFunction]);

  return ref;
};
