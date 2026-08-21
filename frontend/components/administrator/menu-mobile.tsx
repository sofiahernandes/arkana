// Mobile navigation menu for administrator pages.
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export default function MenuMobileAdmin() {
  const pathname = usePathname();
  const params = useParams();
  const [IdMentor, setIdMentor] = useState<string | null>(null);

  const historyHref = `admin/${IdMentor}/admin-history`;
  const profileHref = `admin/${IdMentor}/admin-profile`;

  // Highlights the active admin tab by comparing the current route prefix with each destination.
  const isActive = (href: string) => pathname?.startsWith(href);

  // Extracts the admin id from the route to assemble mobile navigation links dynamically.
  useEffect(() => {
    if (params?.IdMentor) {
      setIdMentor(params.IdMentor as string);
    }
  }, [params]);

  const basePill =
    "relative flex items-center px-4 justify-center h-12 rounded-[40px] border-transparent transition-all duration-300 ease-out will-change-transform will-change-auto";

  const neutralPill =
    "bg-[#A6B895] text-white hover:bg-[#F2D1D4] active:scale-95";

  const activePill =
    "bg-[#70805A] text-white ring-2 ring-[#6B7E5D] ring-offset-2 ring-offset-white animate-selected-pop";

  return (
    <nav
      className="
        md:hidden
        fixed bottom-0 left-0 right-0 z-40
        pb-[calc(env(safe-area-inset-bottom,0px)+10px)] pt-3
      "
      role="navigation"
      aria-label="Menu mobile"
    >
      <div className="mx-auto max-w-lg px-4">
        <div
          className="
            grid grid-cols-2 gap-2
            p-2 
            bg-[#A6B895]
            rounded-[30px]   
          "
        >
          <Link
            href={`/admin/${IdMentor}/admin-profile`}
            aria-label="Início"
            className={`${basePill} ${
              isActive(profileHref) ? activePill : neutralPill
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 10.5 12 3l9 7.5M5 10v10a1 1 0 0 0 1 1h4.5a.5.5 0 0 0 .5-.5V15a1 1 0 0 1 1-1h0a1 1 0 0 1 1 1v6.5a.5.5 0 0 0 .5.5H18a1 1 0 0 0 1-1V10"
              />
            </svg>
          </Link>
          <Link
            href={`/admin/${IdMentor}/admin-history`}
            aria-label="Histórico"
            className={`${basePill} ${
              isActive(historyHref) ? activePill : neutralPill
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6l3 3"
              />
              <circle cx="12" cy="12" r="9" />
            </svg>
          </Link>
        </div>
      </div>
    </nav>
  );
}
