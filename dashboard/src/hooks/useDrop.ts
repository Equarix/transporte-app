import { type DragEvent, useRef, useState } from "react";

interface DropOptions {
  onDrop: (file: File[]) => void;
  accept?: string;
}

export function useDrop(options: DropOptions) {
  const [isOver, setIsOver] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const { onDrop } = options;

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      onDrop(Array.from(files));
      setIsOver(false);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsOver(false);
  };

  const onClickInput = () => {
    ref.current?.click();
  };

  const inputProps = {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        onDrop(Array.from(e.target.files));
      }
    },
    type: "file" as const,
    ref,
    style: { display: "none" },
    accept: options.accept,
  };

  const divProps = {
    onDrop: handleDrop,
    onDragOver: handleDragOver,
    onDragLeave: handleDragLeave,
    onClick: onClickInput,
  };

  return {
    inputProps,
    divProps,
    isOver,
    onClickInput,
  };
}
