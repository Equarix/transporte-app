import { Spinner } from "@heroui/react";
import { createPortal } from "react-dom";

interface LoadProps {
  loading?: boolean;
}

export default function Load({ loading }: LoadProps) {
  if (!loading) return null;
  return createPortal(
    <div className="fixed top-0 right-0 h-screen w-full bg-black/50 z-1000 flex items-center justify-center">
      <Spinner size="lg" />
    </div>,
    document.body,
  );
}
