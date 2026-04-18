import { GenericProps } from "@/interface/utils.interface";
import { cn } from "@/utils/cn";
import Image from "next/image";

interface CardImageProps extends GenericProps {
  src: string;
}

export default function CardImage({ src, className }: CardImageProps) {
  return (
    <div className={cn("relative w-full min-h-64 rounded-t-4xl", className)}>
      <Image
        src={src}
        alt="Card Image"
        fill
        className="object-cover rounded-t-4xl"
      />
    </div>
  );
}
