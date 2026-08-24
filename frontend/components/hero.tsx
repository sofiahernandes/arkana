// Landing hero section shown on the public entry pages to frame the campaign purpose.
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ChevronDown } from "lucide-react";

import heroBackground from "@/assets/texture.png";

const Hero = () => {
  return (
    <section className="relative isolate flex h-[min(85dvh,40rem)] flex-col items-center justify-between overflow-hidden bg-primary pt-10">
      {/* Texture sits behind everything; -z-10 keeps it out of the stacking soup
          the old z-300/z-auto pairing created. */}
      <Image
        src={heroBackground}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover opacity-50"
      />

      <div className="pointer-events-none flex h-full select-none flex-col items-center justify-center gap-2 px-6 text-center">
        <h1 className="font-display text-4xl leading-[1.05] text-primary-foreground md:text-7xl">
          LIDERANÇAS
          <br />
          EMPÁTICAS
        </h1>
        <p className="font-display text-xl text-primary-foreground/90 md:text-2xl">
          + ARKANA
        </p>
      </div>

      <Link
        href="#public-graph"
        aria-label="Ir para os resultados da campanha"
        className="mb-4 rounded-full p-2 text-primary-foreground transition-opacity duration-[--duration-base] ease-[--ease-out] hover:opacity-80 md:mb-10"
      >
        <ChevronDown className="animate-nudge size-7" aria-hidden />
      </Link>
    </section>
  );
};

export default Hero;
