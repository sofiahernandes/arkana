// Single source of truth for authenticated navigation.
// Both the desktop sidebar and the mobile bottom bar read this — a link added
// here appears in both, for the right role, with no other edit.
import {
  CirclePlus,
  History,
  LayoutDashboard,
  UserRound,
  type LucideIcon,
} from "lucide-react";

export type NavRole = "user" | "admin";

export interface NavItem {
  href: string;
  /** Full label, used by the sidebar. */
  label: string;
  /** Two words at most — the bottom bar has ~64px per item. */
  shortLabel: string;
  icon: LucideIcon;
}

/**
 * Builds the nav for a role. `id` is the route param the role is keyed by:
 * RaUsuario for participants, IdMentor for administrators.
 */
export function getNavItems(role: NavRole, id: string): NavItem[] {
  if (role === "admin") {
    return [
      {
        href: "/",
        label: "Painel público",
        shortLabel: "Painel",
        icon: LayoutDashboard,
      },
      {
        href: `/admin/${id}/admin-profile`,
        label: "Meu perfil",
        shortLabel: "Perfil",
        icon: UserRound,
      },
      {
        href: `/admin/${id}/admin-history`,
        label: "Histórico de contribuições",
        shortLabel: "Histórico",
        icon: History,
      },
    ];
  }

  return [
    {
      href: "/",
      label: "Painel público",
      shortLabel: "Painel",
      icon: LayoutDashboard,
    },
    {
      href: `/user/${id}/user-profile`,
      label: "Meu perfil",
      shortLabel: "Perfil",
      icon: UserRound,
    },
    {
      href: `/user/${id}/new-contribution`,
      label: "Cadastrar contribuição",
      shortLabel: "Cadastrar",
      icon: CirclePlus,
    },
    {
      href: `/user/${id}/team-history`,
      label: "Histórico do time",
      shortLabel: "Histórico",
      icon: History,
    },
  ];
}

/**
 * Route-prefix match. The dashboard link is exact-only so it does not light up
 * on every authenticated route — the bug the previous admin nav shipped with
 * was the mirror of this: it compared against a href missing its leading slash
 * and so never matched at all.
 */
export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
