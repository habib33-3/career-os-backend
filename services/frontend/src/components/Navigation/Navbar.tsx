import { Menu } from "lucide-react";

import { useAuthStore } from "@/stores/useAuthStore";

import Logo from "../shared/Logo";
import ThemeToggle from "../shared/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import SidebarContent from "./SidebarContent";

function Navbar() {
  const { user } = useAuthStore();

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-3 md:px-4">
      {/* LEFT */}
      <div className="flex items-center gap-2">
        {/* Mobile menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="bg-sidebar p-0"
            >
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>

        <Logo />
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">
        <Avatar className="size-8">
          <AvatarImage
            src={user?.image}
            alt={`${user?.name}'s profile picture`}
            className="grayscale"
          />
          <AvatarFallback className="bg-muted text-muted-foreground">
            {user?.name?.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <ThemeToggle />
      </div>
    </header>
  );
}

export default Navbar;
