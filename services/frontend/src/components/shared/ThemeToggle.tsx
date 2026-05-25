"use client";

import { useEffect, useState } from "react";

import { useTheme } from "next-themes";

import { ChevronDown, Laptop, Moon, Sun } from "lucide-react";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const ThemeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const current = theme === "system" ? resolvedTheme : theme;

  const toggleTheme = () => {
    setTheme(current === "dark" ? "light" : "dark");
  };

  return (
    <div className="flex items-center">
      {/* Render a stable placeholder during SSR / before mount to avoid hydration mismatches */}
      {!mounted ? (
        <>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {}}
            className="rounded-r-none border-r-0"
          >
            <span className="inline-block h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="w-6 rounded-l-none"
              >
                <ChevronDown className="h-3 w-3" />
                <span className="sr-only">Open theme menu</span>
              </Button>
            </DropdownMenuTrigger>
          </DropdownMenu>
        </>
      ) : (
        <>
          {/* Left: quick toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="rounded-r-none border-r-0"
          >
            {current === "dark" ? (
              <Moon className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <Sun className="h-[1.2rem] w-[1.2rem]" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Right: dropdown for light / dark / system */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="w-6 rounded-l-none"
              >
                <ChevronDown className="h-3 w-3" />
                <span className="sr-only">Open theme menu</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                Light
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Laptop className="mr-2 h-4 w-4" />
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </div>
  );
};

export default ThemeToggle;
