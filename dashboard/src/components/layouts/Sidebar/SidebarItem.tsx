import { cn } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  cloneElement,
  isValidElement,
  useState,
  type ReactElement,
} from "react";
import { LuChevronDown, LuPlus } from "react-icons/lu";
import { Link, useLocation } from "react-router";
export interface SidebarItemProps {
  icon: ReactElement<{ size?: number; strokeWidth?: number }>;
  label: string;
  badge?: string | number;
  hasPlus?: boolean;
  href: string;
  isOpen?: boolean;
  children: SidebarItemProps[];
}

export function SidebarItem({
  icon: Icon,
  label,
  badge,
  hasPlus,
  href,
  isOpen,
  children,
}: SidebarItemProps) {
  const { pathname } = useLocation();
  const Component = children.length > 0 ? "div" : Link;
  const isPathActive = () => {
    if (href === "/") return pathname === "/";
    if (children.length > 0) {
      return pathname.startsWith(href);
    }
    return pathname === href;
  };

  const hasActiveChild = (items: SidebarItemProps[]): boolean => {
    return items.some((child) => {
      if (pathname === child.href) return true;
      if (child.children.length > 0) return hasActiveChild(child.children);
      return false;
    });
  };

  const [isOpenSubItems, setIsOpen] = useState(() => hasActiveChild(children));

  return (
    <div className="flex flex-col gap-1">
      <Component
        className={cn(
          "flex items-center justify-between w-full px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer group",
          isPathActive()
            ? "bg-primary text-white shadow-lg shadow-primary/25"
            : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white",
          !isOpen && "px-0 justify-center",
        )}
        to={href}
        onClick={() => {
          if (children.length > 0) {
            setIsOpen(!isOpenSubItems);
          }
        }}
      >
        <div className="flex items-center gap-3">
          <div>
            {isValidElement(Icon) &&
              cloneElement(Icon, {
                size: 24,
              })}
          </div>
          {isOpen && <span className="font-medium">{label}</span>}
        </div>
        <div className="flex items-center gap-2">
          {badge && (
            <span
              className={cn(
                "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                typeof badge === "number"
                  ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 w-5 h-5 flex items-center justify-center"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 uppercase tracking-wider",
              )}
            >
              {badge}
            </span>
          )}
          {hasPlus && (
            <LuPlus
              size={16}
              className="text-zinc-500 group-hover:text-zinc-300 transition-colors"
            />
          )}

          {children.length > 0 && isOpen && (
            <LuChevronDown
              size={16}
              className={cn(
                "text-zinc-500 transition-all group-hover:text-zinc-300",
                isOpenSubItems && "rotate-180",
                isPathActive() && "text-white",
              )}
            />
          )}
        </div>
      </Component>
      <AnimatePresence>
        {isOpenSubItems && children.length > 0 && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col pl-4 border-l gap-1 overflow-hidden border-zinc-200 dark:border-zinc-800"
          >
            {children.map((child) => (
              <SidebarItem key={child.href} {...child} isOpen={isOpen} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
