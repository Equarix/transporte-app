import { Sidebar } from "./Sidebar/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full max-h-screen bg-zinc-50 dark:bg-[#0a0a0a] overflow-x-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
