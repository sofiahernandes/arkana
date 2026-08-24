// The frame every page sits in. Owns the ground colour, the navigation, the
// content measure and the horizontal gutters, so no page declares its own.
import BottomNav from "@/components/navigation/bottom-nav";
import SideNav from "@/components/navigation/side-nav";
import type { NavRole } from "@/components/navigation/nav-config";
import { cn } from "@/lib/utils";

interface PageShellProps {
  children: React.ReactNode;
  /**
   * Renders the authenticated navigation for a role. Omit on public and auth
   * surfaces — they are framed by their own content, not by a nav.
   */
  nav?: { role: NavRole; id: string };
  /**
   * `surface` is the authenticated task ground; `background` is the warm cream
   * used by public, marketing and auth surfaces.
   */
  ground?: "surface" | "background";
  /** Opt out of the content measure for full-bleed pages. */
  bleed?: boolean;
  /** Full-bleed content above `main`, outside the measure — e.g. the landing hero. */
  banner?: React.ReactNode;
  className?: string;
}

export default function PageShell({
  children,
  nav,
  ground = "surface",
  bleed = false,
  banner,
  className,
}: PageShellProps) {
  return (
    <div
      className={cn(
        "min-h-dvh",
        ground === "surface" ? "bg-surface" : "bg-background",
        nav && "lg:pl-nav",
      )}
    >
      {nav && <SideNav role={nav.role} id={nav.id} />}

      {banner}

      <main
        className={cn(
          !bleed && "mx-auto w-full max-w-[--content-max] px-4 sm:px-6 lg:px-8",
          !bleed && "py-8 lg:py-12",
          // Clear the floating bottom bar on small screens.
          nav && "pb-[calc(var(--bottom-nav-height)+1.5rem)] lg:pb-12",
          className,
        )}
      >
        {children}
      </main>

      {nav && <BottomNav role={nav.role} id={nav.id} />}
    </div>
  );
}
