import Title from "@/components/ui/title/Title";
import { cn } from "@/utils/cn";
import { Button } from "@heroui/react";
import type { ReactElement } from "react";

interface HeaderProps {
  className?: {
    header?: string;
    h1?: string;
    button?: string;
  };
  text: {
    header: string;
    button?: string;
  };
  icon?: ReactElement;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabledButton?: boolean;
}

export default function Header({
  className,
  text,
  icon,
  onClick,
  type,
  disabledButton,
}: HeaderProps) {
  return (
    <header
      className={cn(
        "flex items-center w-full justify-between",
        className?.header,
      )}
    >
      <Title className={className?.h1}>{text.header}</Title>

      {!disabledButton && (
        <Button
          color="primary"
          type={type}
          className={cn("font-semibold", className?.button)}
          onPress={onClick}
        >
          {icon}
          {text.button}
        </Button>
      )}
    </header>
  );
}
