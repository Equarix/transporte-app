"use client";
import React from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Custom404 from "./(landing)/404";

export default function NotFound() {
  return (
    <main className="w-full min-h-screen flex flex-col overflow-auto">
      <Header />
      <section className="w-full h-full flex-1 flex flex-col">
        <Custom404 />
      </section>
      <Footer />
    </main>
  );
}
