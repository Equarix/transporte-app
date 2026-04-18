import { GenericProps } from "@/interface/utils.interface";
import { cn } from "@/utils/cn";
import { ReactNode } from "react";

type TypographyType =
  | "p"
  | "span"
  | "div"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6";

interface Typography extends GenericProps {
  startContent?: ReactNode;
  endContent?: ReactNode;
  type?: TypographyType;
}

export default function Typography({
  children,
  className,
  startContent,
  endContent,
  type,
}: Typography) {
  const Component = type ?? "p";

  return (
    <article className="w-full flex items-center gap-2">
      {startContent && <div>{startContent}</div>}

      <Component className={cn("text-gray-600", className)}>
        {children}
      </Component>

      {endContent && <div>{endContent}</div>}
    </article>
  );
}
