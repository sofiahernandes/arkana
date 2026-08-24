// Persistent desktop navigation for every authenticated surface.
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import arkanaLogo from "@/assets/Arkana.png";
import { cn } from "@/lib/utils";

import { getNavItems, isNavItemActive, type NavRole } from "./nav-config";

interface SideNavProps {
  role: NavRole;
  id: string;
}

export default function SideNav({ role, id }: SideNavProps) {
  const pathname = usePathname() ?? "";
  const items = getNavItems(role, id);

  return (
    <aside
      aria-label="Navegação principal"
      className="fixed inset-y-0 left-0 z-40 hidden w-nav flex-col border-r border-border bg-card lg:flex"
    >
      <Link
        href="/"
        className="flex h-20 shrink-0 items-center gap-3 px-6 transition-opacity duration-[--duration-base] ease-[--ease-out] hover:opacity-80"
      >
        <Image
          src={arkanaLogo}
          alt="Arkana"
          width={36}
          height={36}
          className="h-9 w-9 object-contain"
        />
        <span className="text-lg font-semibold tracking-tight text-primary">
          Arkana
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1 px-3 pb-6">
        {items.map(({ href, label, icon: Icon }) => {
          const active = isNavItemActive(pathname, href);

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium",
                "transition-colors duration-[--duration-base] ease-[--ease-out]",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Icon className="size-[18px] shrink-0" strokeWidth={1.75} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
