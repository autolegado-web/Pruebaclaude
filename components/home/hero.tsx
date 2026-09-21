"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { HeroScene } from "@/components/home/hero-scene";
import { Button } from "@/components/ui/button";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const sceneY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "12%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "-18%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, reduced ? 1 : 0]);

  return (
    <section
      ref={ref}
      className="dark-surface relative flex h-[min(92svh,860px)] min-h-[32rem] flex-col justify-end overflow-hidden bg-night text-paper"
    >
      <motion.div style={{ y: sceneY }} className="absolute inset-0 -z-10 scale-[1.06]">
        <HeroScene className="h-full w-full object-cover" />
      </motion.div>

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="page pb-14 lg:pb-20">
        <h1 className="display-xl rise max-w-[15ch] text-balance">Encuentra tu próximo coche.</h1>

        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <p
            className="rise max-w-[42ch] text-[0.9375rem] leading-relaxed text-white/70 sm:text-base"
            style={{ animationDelay: "120ms" }}
          >
            Seleccionamos y revisamos cada coche antes de publicarlo. Tú eliges, comparas y
            reservas sin llamadas ni sorpresas.
          </p>

          <div className="rise flex flex-wrap gap-3" style={{ animationDelay: "220ms" }}>
            <Button asChild size="lg" variant="light">
              <Link href="/coches">Ver los coches</Link>
            </Button>
            <Button asChild size="lg" variant="onDark">
              <Link href="/vender">Vender el mío</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
