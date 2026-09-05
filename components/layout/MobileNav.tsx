"use client";

import { X } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/common/Button";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/55"
        aria-label="Close navigation overlay"
        onClick={onClose}
      />
      <div className="relative h-full w-[min(18.5rem,86vw)] shadow-2xl">
        <Button
          variant="ghost"
          className="absolute top-3 right-3 z-10"
          onClick={onClose}
          aria-label="Close navigation"
        >
          <X className="size-4" />
        </Button>
        <Sidebar onNavigate={onClose} />
      </div>
    </div>
  );
}
