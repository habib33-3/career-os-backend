"use client";

import ThemeToggle from "@/components/shared/ThemeToggle";

import UserMenu from "./UserMenu";

const SidebarFooter = () => {
  return (
    <div className="space-y-2 border-t border-border p-3">
      <ThemeToggle />
      <UserMenu />
    </div>
  );
};

export default SidebarFooter;
