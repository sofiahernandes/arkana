// Mobile and tablet navigation for every authenticated surface.
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { getNavItems, isNavItemActive, type NavRole } from "./nav-config";

interface BottomNavProps {
  role: NavRole;
  id: string;
}

export default function BottomNav({ role, id }: BottomNavProps) {
  const pathname = usePathname() ?? "";
  const items = getNavItems(role, id);

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] lg:hidden"
    >
      <ul className="mx-auto flex max-w-md items-stretch gap-1 rounded-xl bg-primary p-1.5 shadow-lg">
        {items.map(({ href, shortLabel, icon: Icon }) => {
          const active = isNavItemActive(pathname, href);

          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "pill flex h-14 flex-col items-center justify-center gap-1 rounded-md px-1",
                  "text-[0.6875rem] font-medium leading-none",
                  "transition-colors duration-[--duration-base] ease-[--ease-out]",
                  active
                    ? "animate-selected-pop bg-primary-foreground text-primary"
                    : "text-primary-foreground/75 hover:text-primary-foreground",
                )}
              >
                <Icon className="size-5 shrink-0" strokeWidth={1.75} />
                <span className="max-w-full truncate">{shortLabel}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
