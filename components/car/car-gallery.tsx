"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { CarImage } from "@/components/car/car-image";
import type { Car } from "@/types/car";
import { cn } from "@/lib/utils";

export function CarGallery({ car }: { car: Car }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const touchX = useRef<number | null>(null);
  const n = car.images.length;

  const go = (delta: number) => setIndex((i) => (i + delta + n) % n);

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 44) go(dx < 0 ? 1 : -1);
    touchX.current = null;
  };

  return (
    <section aria-label="Galería del vehículo">
      <div
        className="dark-surface relative aspect-[16/10] w-full overflow-hidden bg-night sm:aspect-[16/9]"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex h-full transition-transform duration-500 ease-[var(--ease-in-out-quart)]"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {car.images.map((img, i) => (
            <div key={img.url + i} className="h-full w-full shrink-0">
              <CarImage url={img.url} alt={img.alt} bodyType={car.bodyType} priority={i === 0} fit="cover" />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Imagen anterior"
          className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-pill bg-black/45 text-paper backdrop-blur-sm transition-colors hover:bg-black/70"
        >
          <ChevronLeft aria-hidden className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Imagen siguiente"
          className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-pill bg-black/45 text-paper backdrop-blur-sm transition-colors hover:bg-black/70"
        >
          <ChevronRight aria-hidden className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-pill bg-black/45 px-3.5 py-2 text-[0.8125rem] text-paper backdrop-blur-sm transition-colors hover:bg-black/70"
        >
          <Maximize2 aria-hidden className="h-3.5 w-3.5" />
          Pantalla completa
        </button>
        <span
          data-numeric
          aria-live="polite"
          className="absolute bottom-3 right-3 rounded-pill bg-black/45 px-3 py-2 text-[0.75rem] text-paper backdrop-blur-sm"
        >
          {index + 1} / {n}
        </span>
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto bg-night px-3 py-3">
        {car.images.map((img, i) => (
          <button
            key={img.url + i}
            type="button"
            onClick={() => setIndex(i)}
            aria-current={i === index}
            aria-label={`Ver imagen ${i + 1} de ${n}`}
            className={cn(
              "aspect-[16/10] w-20 shrink-0 overflow-hidden rounded-xs border transition-opacity",
              i === index ? "border-white/70 opacity-100" : "border-white/10 opacity-50 hover:opacity-80",
            )}
          >
            <CarImage url={img.url} alt="" bodyType={car.bodyType} sizes="80px" />
          </button>
        ))}
      </div>

      <Lightbox car={car} index={index} setIndex={setIndex} open={open} onOpenChange={setOpen} />
    </section>
  );
}

function Lightbox({
  car,
  index,
  setIndex,
  open,
  onOpenChange,
}: {
  car: Car;
  index: number;
  setIndex: (updater: (i: number) => number) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const n = car.images.length;
  const go = (delta: number) => setIndex((i) => (i + delta + n) % n);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="overlay-anim fixed inset-0 z-[70] bg-black/95" />
        <Dialog.Content
          className="panel-center fixed inset-0 z-[70] flex flex-col focus:outline-none"
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") go(-1);
            if (e.key === "ArrowRight") go(1);
          }}
        >
          <Dialog.Title className="sr-only">
            {car.brand} {car.model}, imagen {index + 1} de {n}
          </Dialog.Title>
          <div className="flex items-center justify-between p-4 text-paper">
            <span data-numeric className="text-[0.8125rem] text-white/60">
              {index + 1} / {n}
            </span>
            <Dialog.Close
              aria-label="Cerrar pantalla completa"
              className="flex h-10 w-10 items-center justify-center rounded-pill text-paper transition-colors hover:bg-white/10"
            >
              <X aria-hidden className="h-5 w-5" />
            </Dialog.Close>
          </div>
          <div className="relative flex-1 overflow-hidden">
            <CarImage
              url={car.images[index].url}
              alt={car.images[index].alt}
              bodyType={car.bodyType}
              fit="contain"
              className="bg-black"
            />
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Imagen anterior"
              className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-pill bg-black/45 text-paper backdrop-blur-sm hover:bg-black/70"
            >
              <ChevronLeft aria-hidden className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Imagen siguiente"
              className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-pill bg-black/45 text-paper backdrop-blur-sm hover:bg-black/70"
            >
              <ChevronRight aria-hidden className="h-5 w-5" />
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
