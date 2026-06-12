"use client";

import { type Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Home, Menu, X } from "lucide-react";

import Logo from "@/components/shared/Logo";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import { useAuthStore } from "@/stores/useAuthStore";

const navPaths: { name: string; path: Route; icon: typeof Home }[] = [
  { name: "Home", path: "/", icon: Home },
  // { name: "Jobs", path: "/jobs", icon: Search },
  // { name: "Companies", path: "/companies", icon: Building2 },
  // { name: "About", path: "/about", icon: Info },
];

const isActivePath = (current: string, path: string) => {
  if (path === "/") return current === "/";
  return current.startsWith(path);
};

const PublicNavbar = () => {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const isAuthenticated = !!user;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Logo />

        {/* Desktop Nav */}
        <div className="hidden items-center gap-0.5 md:flex">
          {navPaths.map((item) => {
            const active = isActivePath(pathname, item.path);
            return (
              <Button
                key={item.path}
                variant="ghost"
                size="sm"
                asChild
                className={
                  active
                    ? "bg-muted font-medium text-foreground hover:bg-muted"
                    : "text-muted-foreground"
                }
              >
                <Link href={item.path}>{item.name}</Link>
              </Button>
            );
          })}
        </div>

        {/* Desktop Auth */}
        <div className="hidden shrink-0 items-center gap-2 md:flex">
          <ThemeToggle />
          <Separator
            orientation="vertical"
            className="h-4"
          />

          {isAuthenticated ? (
            <Button
              size="sm"
              asChild
            >
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                asChild
              >
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button
                size="sm"
                asChild
              >
                <Link href="/sign-up">Get started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
              >
                <Menu className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-64 p-0"
            >
              <div className="flex h-full flex-col">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border/40 px-4 py-3.5">
                  <Logo />
                  <SheetClose asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </SheetClose>
                </div>

                {/* Nav */}
                <div className="flex-1 px-2 py-3">
                  <div className="flex flex-col gap-0.5">
                    {navPaths.map((item) => {
                      const active = isActivePath(pathname, item.path);
                      const Icon = item.icon;

                      return (
                        <SheetClose
                          asChild
                          key={item.path}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className={[
                              "w-full justify-start gap-2.5",
                              active
                                ? "bg-muted font-medium text-foreground hover:bg-muted"
                                : "text-muted-foreground",
                            ].join(" ")}
                          >
                            <Link href={item.path}>
                              <Icon className="h-4 w-4" />
                              {item.name}
                            </Link>
                          </Button>
                        </SheetClose>
                      );
                    })}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex flex-col gap-2 border-t border-border/40 p-3">
                  <div className="flex justify-end">
                    <ThemeToggle />
                  </div>

                  {isAuthenticated ? (
                    <SheetClose asChild>
                      <Button
                        className="w-full"
                        size="sm"
                        asChild
                      >
                        <Link href="/dashboard">Dashboard</Link>
                      </Button>
                    </SheetClose>
                  ) : (
                    <>
                      <SheetClose asChild>
                        <Button
                          variant="outline"
                          className="w-full"
                          size="sm"
                          asChild
                        >
                          <Link href="/sign-in">Sign in</Link>
                        </Button>
                      </SheetClose>

                      <SheetClose asChild>
                        <Button
                          className="w-full"
                          size="sm"
                          asChild
                        >
                          <Link href="/sign-up">Get started</Link>
                        </Button>
                      </SheetClose>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};

export default PublicNavbar;
