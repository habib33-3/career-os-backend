import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

import logo from "@/assets/logo.png";

type LogoVariant =
  | "navbar"
  | "footer"
  | "sidebar"
  | "sidebar-collapsed"
  | "auth";

type LogoProps = {
  variant?: LogoVariant;
  className?: string;
  priority?: boolean;
};

const variantConfig: Record<
  LogoVariant,
  { size: number; wrapperClass: string; textClass: string; showText: boolean }
> = {
  navbar: {
    size: 32,
    wrapperClass: "gap-2",
    textClass: "text-base font-semibold tracking-tight",
    showText: true,
  },
  footer: {
    size: 28,
    wrapperClass: "gap-2",
    textClass: "text-sm font-medium text-muted-foreground",
    showText: true,
  },
  sidebar: {
    size: 30,
    wrapperClass: "gap-2.5",
    textClass: "text-sm font-semibold",
    showText: true,
  },
  "sidebar-collapsed": {
    size: 30,
    wrapperClass: "justify-center",
    textClass: "",
    showText: false,
  },
  auth: {
    size: 40,
    wrapperClass: "flex-col gap-3",
    textClass: "text-xl font-bold",
    showText: true,
  },
};

const Logo = ({
  variant = "navbar",
  className,
  priority = false,
}: LogoProps) => {
  const config = variantConfig[variant];

  return (
    <Link
      href="/"
      aria-label="CareerOS homepage"
      className={cn(
        "flex shrink-0 items-center rounded-md",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
        config.wrapperClass,
        className
      )}
    >
      <Image
        src={logo}
        alt=""
        aria-hidden="true"
        draggable={false}
        width={config.size}
        height={config.size}
        priority={priority}
        className="object-contain select-none"
      />

      {config.showText && (
        <span className={cn(config.textClass, "leading-none")}>CareerOS</span>
      )}
    </Link>
  );
};

export default Logo;
