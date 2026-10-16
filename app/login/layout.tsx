import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/session";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function LoginLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (session) {
    redirect("/dashboard");
  }
  return children;
}
