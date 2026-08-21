// Mobile navigation menu for restricted participant pages.
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useParams } from "next/navigation";

import homeDefault from "@/assets/icons/home.png";
import homeActive from "@/assets/icons/home-active.png";
import homePressed from "@/assets/icons/home-pressed.png";

import addDefault from "@/assets/icons/add.png";
import addActive from "@/assets/icons/add-active.png";
import addPressed from "@/assets/icons/add-pressed.png";

import historyDefault from "@/assets/icons/history.png";
import historyActive from "@/assets/icons/history-active.png";
import historyPressed from "@/assets/icons/history-pressed.png";

export default function MenuMobile() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const [RaUsuario, setRaUsuario] = useState<number | null>(null);

  const raSegment = RaUsuario ?? "";
  const baseHref = "/user/" + raSegment;
  const homeHref = baseHref + "/user-profile";
  const createHref = baseHref + "/new-contribution";
  const historyHref = baseHref + "/team-history";

  // Marks the current tab by comparing the route prefix against the destination for each menu item.
  const isActive = (href: string) => pathname?.startsWith(href);

  // Extracts the current participant id from the route so the menu links always point to the active user area.
  useEffect(() => {
    if (params?.RaUsuario) {
      setRaUsuario(Number(params.RaUsuario));
    }
  }, [params]);

  // Forces a refresh when the user taps the active creation tab again instead of navigating to the same URL.
  const onCreateClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    if (isActive(createHref)) {
      e.preventDefault();
      router.refresh();
    }
  };

  const basePill =
    "relative flex items-center justify-center h-10 w-16 rounded-[10px] transition-all duration-300 ease-out";
  const neutralPill = "bg-transparent hover:bg-primary/20";
  const activePill = "bg-[#3B5D3D] text-white border border-[#3B5D3D]";

  // Memoizes the icon variants once because the menu only switches between a small fixed set of images.
  const icons = useMemo(
    () => ({
      home: { default: homeDefault, active: homeActive, pressed: homePressed },
      add: { default: addDefault, active: addActive, pressed: addPressed },
      history: {
        default: historyDefault,
        active: historyActive,
        pressed: historyPressed,
      },
    }),
    [],
  );

  const [pressed, setPressed] = useState<{ [key: string]: boolean }>({});
  const timersRef = useRef<{ [key: string]: number }>({});

  // Applies a short pressed state so the mobile navigation has immediate visual feedback on tap.
  const triggerPress = (key: string) => {
    if (timersRef.current[key]) window.clearTimeout(timersRef.current[key]);
    setPressed((p) => ({ ...p, [key]: true }));
    timersRef.current[key] = window.setTimeout(() => {
      setPressed((p) => ({ ...p, [key]: false }));
    }, 150);
  };

  // Clears the tap animation timers on unmount to avoid updating state after the menu is gone.
  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach((t) => window.clearTimeout(t));
    };
  }, []);

  // Chooses the icon variant based on the tab state so active and pressed feedback stay centralized.
  const getIconSrc = (
    set: { default: any; active: any; pressed?: any },
    isTabActive: boolean,
    isPressed: boolean,
  ) => {
    if (isPressed && set.pressed) return set.pressed;
    if (isTabActive) return set.active;
    return set.default;
  };

  return (
    <nav
      role="navigation"
      aria-label="Menu mobile"
      className="md:hidden fixed inset-x-0 bottom-0 z-50"
    >
      <style jsx global>{`
        @keyframes pop {
          0% {
            transform: scale(1);
          }
          40% {
            transform: scale(1.12);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-pop {
          animation: pop 150ms ease-out;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-pop {
            animation: none !important;
          }
          .transition-all {
            transition: none !important;
          }
        }
      `}</style>

      <div className="mx-auto w-xs px-4 sm:px-6 rounded-2xl">
        <div className="flex items-center justify-center gap-8 sm:gap-12 py-2 mb-6 bg-primary rounded-xl">
          <Link
            href={homeHref}
            aria-label="Início"
            className={`${basePill} ${
              isActive(homeHref) ? activePill : neutralPill
            } ${pressed.home ? "animate-pop" : ""}`}
            onMouseDown={() => triggerPress("home")}
            onTouchStart={() => triggerPress("home")}
          >
            <Image
              src={getIconSrc(icons.home, isActive(homeHref), !!pressed.home)}
              alt="Início"
              width={24}
              height={24}
              className="pointer-events-none select-none"
              draggable={false}
              priority
            />
          </Link>

          <Link
            href={createHref}
            aria-label="Cadastrar"
            onClick={onCreateClick}
            className={`${basePill} ${
              isActive(createHref) ? activePill : neutralPill
            } ${pressed.add ? "animate-pop" : ""}`}
            onMouseDown={() => triggerPress("add")}
            onTouchStart={() => triggerPress("add")}
          >
            <Image
              src={getIconSrc(icons.add, isActive(createHref), !!pressed.add)}
              alt="Cadastrar"
              width={24}
              height={24}
              className="pointer-events-none select-none"
              draggable={false}
              priority
            />
          </Link>

          <Link
            href={historyHref}
            aria-label="Histórico"
            className={`${basePill} ${
              isActive(historyHref) ? activePill : neutralPill
            } ${pressed.history ? "animate-pop" : ""}`}
            onMouseDown={() => triggerPress("history")}
            onTouchStart={() => triggerPress("history")}
          >
            <Image
              src={getIconSrc(
                icons.history,
                isActive(historyHref),
                !!pressed.history,
              )}
              alt="Histórico"
              width={24}
              height={24}
              className="pointer-events-none select-none"
              draggable={false}
              priority
            />
          </Link>
        </div>
      </div>
    </nav>
  );
}
