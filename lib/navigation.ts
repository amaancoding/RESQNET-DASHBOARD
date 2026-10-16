import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Brain,
  LayoutDashboard,
  Map,
  MessageSquareWarning,
  Network,
  ScrollText,
  Shield,
  Siren,
  Users,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/emergencies", label: "Emergencies", icon: Siren },
  { href: "/map", label: "Map", icon: Map },
  { href: "/users", label: "Users", icon: Users },
  { href: "/feedback", label: "Feedback", icon: MessageSquareWarning },
  { href: "/mesh", label: "Mesh Network", icon: Network },
  { href: "/resq-ai", label: "ResQ AI", icon: Brain },
  { href: "/responders", label: "Responders", icon: Shield },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/audit", label: "Audit Logs", icon: ScrollText },
];

export const CONSOLE_TITLE = "RESQNET";
export const CONSOLE_SUBTITLE = "Emergency Response Administration";

export function isActivePath(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
