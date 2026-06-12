"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import LogoutButton from "@/features/auth/components/logout/LogoutButton";

const items = [
  { name: "Job Applications", path: "/job-applications" },
  { name: "Companies", path: "/companies" },
  { name: "Interviews", path: "/interviews" },
];

const SidebarContent = () => {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 p-3">
      {items.map((item) => {
        const active = pathname === item.path;

        return (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              "rounded-md px-3 py-2 text-sm transition",
              active
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            )}
          >
            {item.name}
          </Link>
        );
      })}
      <LogoutButton />
    </nav>
  );
};

export default SidebarContent;
