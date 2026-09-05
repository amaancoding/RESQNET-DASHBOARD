"use client";

import { createContext, useContext } from "react";
import type { AdminRole } from "@/lib/types";

const AdminRoleContext = createContext<AdminRole>("viewer");

export function AdminRoleProvider({
  role,
  children,
}: {
  role: AdminRole;
  children: React.ReactNode;
}) {
  return <AdminRoleContext.Provider value={role}>{children}</AdminRoleContext.Provider>;
}

export function useAdminRole() {
  return useContext(AdminRoleContext);
}

export function canUpdateEmergencies(role: AdminRole) {
  return role === "operator" || role === "admin";
}
