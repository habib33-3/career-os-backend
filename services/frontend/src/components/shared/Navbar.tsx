import { Menu } from "lucide-react";

import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import Logo from "./Logo";
import SidebarContent from "./SidebarContent";

function Navbar() {
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
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-muted text-muted-foreground">
            HR
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}

export default Navbar;
