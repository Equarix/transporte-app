"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
  LuArrowRight,
  LuCompass,
  LuHeadphones,
  LuClock,
  LuMapPin,
} from "react-icons/lu";

export default function Custom404() {
  // Motion animation variants for content items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as const, // Custom cubic-bezier for a premium, snappy feel
      },
    },
  };

  return (
    <section className="w-full flex-1 flex items-center justify-center bg-linear-to-br from-[#FCFBF9] via-[#FAF6F2] to-[#F5EFE8] py-12 md:py-20 px-6 md:px-12 lg:px-16 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 xl:gap-20">
        {/* Left Side: Bus Banner Image and Error Card */}
        <motion.div
          initial={{ opacity: 0, x: -50, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
          className="relative w-full lg:w-1/2 max-w-153.75 aspect-4/3 rounded-[40px] overflow-hidden shadow-[0_24px_60px_-15px_rgba(137,90,52,0.18)] border border-[#EAE2D8]/80 group"
        >
          {/* Main Sunset Bus Banner */}
          <Image
            src="/banner-404.png"
            alt="Ruta no encontrada"
            fill
            sizes="(max-w-768px) 100vw, 50vw"
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            priority
          />

          {/* Glassmorphism Error Card Overlay */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              delay: 0.4,
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1] as const,
            }}
            className="absolute bottom-6 left-6 p-6 rounded-[28px] bg-white/20 backdrop-blur-xl border border-white/40 shadow-[0_12px_40px_rgba(0,0,0,0.12)] flex flex-col items-center justify-center min-w-38.75 text-center"
          >
            <span className="text-[10px] font-black tracking-widest text-[#8A5A36] uppercase mb-1.5">
              ERROR CODE
            </span>
            <span className="text-5xl font-black text-[#1A1A1A] tracking-tight">
              404
            </span>
          </motion.div>
        </motion.div>

        {/* Right Side: Informative Text & Help Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full lg:w-1/2 max-w-137.5 flex flex-col items-start text-left"
        >
          {/* Section Tag Badge */}
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center px-4.5 py-1.5 rounded-full bg-[#F5ECE2] text-[#A66E4E] text-[11px] font-black tracking-widest uppercase">
              Ruta no encontrada
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-[38px] sm:text-[44px] md:text-[50px] font-black text-[#1A1A1A] leading-[1.1] tracking-tight mb-5"
          >
            ¡Oops! Parece que te has desviado del camino
          </motion.h1>

          {/* Description Paragraph */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-[#5C5C5C] font-medium leading-relaxed mb-10"
          >
            La página que buscas ha tomado una ruta alternativa o ya no existe
            en nuestro mapa. No te preocupes, el viaje continúa.
          </motion.p>

          {/* Core CTAs Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4.5 mb-12 w-full"
          >
            {/* Primary Action: Go Home */}
            <Link href="/" className="flex-1 sm:flex-initial">
              <button className="w-full sm:w-auto px-8 py-4.5 rounded-full bg-linear-to-r from-[#CB5D10] to-[#E37A2C] hover:from-[#B5500A] hover:to-[#CD6C20] text-white font-bold flex items-center justify-center gap-2.5 transition-all duration-300 shadow-[0_15px_30px_rgba(203,93,16,0.32)] hover:shadow-[0_20px_40px_rgba(203,93,16,0.45)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
                <span>Volver al Inicio</span>
                <LuArrowRight className="text-xl" />
              </button>
            </Link>

            {/* Secondary Action: View Destinations */}
            <Link href="/destinos" className="flex-1 sm:flex-initial">
              <button className="w-full sm:w-auto px-8 py-4.5 rounded-full bg-white hover:bg-[#FAF9F7] text-[#1A1A1A] font-bold flex items-center justify-center gap-2.5 transition-all duration-300 border border-[#E1DBD2] hover:border-[#D5CEC4] hover:scale-[1.02] active:scale-[0.98] shadow-sm cursor-pointer">
                <span>Ver Destinos</span>
                <LuCompass className="text-xl text-[#5C5C5C]" />
              </button>
            </Link>
          </motion.div>

          {/* Helper links section Divider */}
          <motion.div
            variants={itemVariants}
            className="w-full h-px bg-[#EAE2D8]/80 mb-8"
          />

          {/* Bottom Help Options */}
          <motion.div variants={itemVariants} className="w-full">
            <p className="text-[10px] font-black text-[#A89E95] tracking-widest uppercase mb-4.5">
              O podemos ayudarte
            </p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              {/* Help Center link */}
              <Link
                href="/contacto"
                className="flex items-center gap-2 text-sm font-bold text-[#5C5C5C] hover:text-[#CB5D10] transition-colors group"
              >
                <LuHeadphones className="text-lg text-[#8C8279] group-hover:text-[#CB5D10] transition-colors" />
                <span>Centro de Ayuda</span>
              </Link>

              {/* Schedules link */}
              <Link
                href="/servicios"
                className="flex items-center gap-2 text-sm font-bold text-[#5C5C5C] hover:text-[#CB5D10] transition-colors group"
              >
                <LuClock className="text-lg text-[#8C8279] group-hover:text-[#CB5D10] transition-colors" />
                <span>Horarios</span>
              </Link>

              {/* Stops/Offices link */}
              <Link
                href="/agencias"
                className="flex items-center gap-2 text-sm font-bold text-[#5C5C5C] hover:text-[#CB5D10] transition-colors group"
              >
                <LuMapPin className="text-lg text-[#8C8279] group-hover:text-[#CB5D10] transition-colors" />
                <span>Paradas</span>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
