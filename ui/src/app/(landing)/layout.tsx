import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <main className="w-full min-h-screen flex flex-col overflow-auto">
      <Header />
      <section className="w-full h-full flex-1 flex flex-col">
        {children}
      </section>
      <Footer />
    </main>
  );
}
