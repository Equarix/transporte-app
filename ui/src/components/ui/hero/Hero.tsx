import { cn } from "@/utils/cn";
import Image from "next/image";
import { PropsWithChildren } from "react";

interface HeroProps extends PropsWithChildren {
  className?: {
    container?: string;
    imagebg?: string;
    wrapper?: string;
  };
  image: string;
}

export default function Hero({ children, className, image }: HeroProps) {
  return (
    <section
      className={cn(
        "w-full relative overflow-hidden min-h-112.5",
        className?.container,
      )}
    >
      <Image
        fill
        src={image}
        alt="bg-hero"
        className={cn(
          "w-full h-full absolute object-cover opacity-20",
          className?.imagebg,
        )}
      />
      <div
        className={cn(
          "w-full h-full absolute flex items-center px-4",
          className?.wrapper,
        )}
      >
        {children}
      </div>
    </section>
  );
}
