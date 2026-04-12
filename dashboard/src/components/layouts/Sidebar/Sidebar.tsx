import { Avatar, Button, ScrollShadow } from "@heroui/react";
import { LuChevronsLeft } from "react-icons/lu";
import { SideBarConfig } from "@/config/sidebard.config";
import { SidebarItem } from "./SidebarItem";
import { HiOutlineMinusCircle } from "react-icons/hi";
import { cn } from "@/utils/cn";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAuth } from "@/components/providers/AuthContext";
import ButtonTheme from "@/components/ui/button-theme/ButtonTheme";

export function Sidebar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useLocalStorage("sidebar-is-open", true);

  console.log(user);

  return (
    <aside
      className={cn(
        "w-72 h-screen transition-all duration-300 ease-in-out sticky top-0 left-0 bg-white dark:bg-[#09090b] border-r border-zinc-200 dark:border-zinc-800 flex flex-col p-4 text-zinc-900 dark:text-zinc-400 z-50",
        !isOpen && "w-20",
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-between mb-8 px-2",
          !isOpen && "px-0 justify-center",
        )}
      >
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <div className="w-5 h-5 bg-white rounded-md transform rotate-45 flex items-center justify-center">
              <span className="text-[12px] text-primary -rotate-45 font-black">
                I
              </span>
            </div>
          </div>
          {isOpen && (
            <span className="text-xl font-black tracking-tighter dark:text-white text-zinc-900">
              Inventario
            </span>
          )}
        </div>
        <Button
          isIconOnly
          variant="light"
          size="sm"
          className={cn(
            "text-zinc-400 hover:text-zinc-900 dark:hover:text-white min-w-8 w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm",
            !isOpen && "absolute right-0 translate-x-1/2",
          )}
          onPress={() => setIsOpen(!isOpen)}
        >
          <LuChevronsLeft
            size={16}
            className={cn(
              "transition-transform duration-300",
              !isOpen && "rotate-180",
            )}
          />
        </Button>
      </div>

      {/* User Profile */}
      <div
        className={cn(
          "flex items-center gap-3 mb-8 px-2 relative w-full",
          !isOpen && "px-0 justify-center",
        )}
      >
        <Avatar
          src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
          className="min-w-10 h-10 text-large"
        />
        {isOpen && (
          <div className="w-full flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-black dark:text-white">
                {user?.profile.firstName} {user?.profile.lastName}
              </span>
              <span className="text-xs text-zinc-500">
                {user?.profile.email}
              </span>
            </div>

            <ButtonTheme />
          </div>
        )}
      </div>

      {/* Navigation */}
      <ScrollShadow className="flex-1 -mx-2 px-2">
        <nav className="flex flex-col gap-1">
          {SideBarConfig.body.map((item) => (
            <SidebarItem key={item.href} {...item} isOpen={isOpen} />
          ))}
        </nav>
      </ScrollShadow>

      {/* Footer */}
      <div className="mt-auto pt-4 flex flex-col gap-1">
        {SideBarConfig.footer.map((item) => (
          <SidebarItem key={item.href} {...item} isOpen={isOpen} />
        ))}
        <button
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer group text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-danger"
          onClick={() => {
            logout();
          }}
        >
          <HiOutlineMinusCircle size={22} />
          {isOpen && (
            <span className="font-semibold text-sm">Cerrar sesión</span>
          )}
        </button>
      </div>
    </aside>
  );
}
