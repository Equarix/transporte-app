import { Card, CardHeader, CardBody, Divider } from "@heroui/react";
import type { PropsWithChildren, ReactNode } from "react";
import { cn } from "@/utils/cn";

interface FormSectionProps extends PropsWithChildren {
  title?: string;
  description?: string;
  icon?: ReactNode;
  headerAction?: ReactNode;
  className?: string;
  contentClassName?: string;
}

export default function FormSection({
  title,
  description,
  icon,
  headerAction,
  children,
  className,
  contentClassName,
}: FormSectionProps) {
  return (
    <Card className={cn("shadow-sm border-none bg-content1/50", className)}>
      {(title || description || headerAction) && (
        <>
          <CardHeader className="flex flex-row items-center justify-between px-6 py-4 gap-2">
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-2">
                {icon && <span className="text-primary">{icon}</span>}
                {title && (
                  <h3 className="text-lg font-semibold text-foreground/90 leading-none">
                    {title}
                  </h3>
                )}
              </div>
              {description && (
                <p className="text-small text-default-500">{description}</p>
              )}
            </div>
            {headerAction && <div className="shrink-0">{headerAction}</div>}
          </CardHeader>
          <Divider className="opacity-50" />
        </>
      )}
      <CardBody className={cn("px-6 py-6 gap-6", contentClassName)}>
        {children}
      </CardBody>
    </Card>
  );
}
