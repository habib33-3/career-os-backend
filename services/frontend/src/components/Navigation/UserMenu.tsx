"use client";

import Link from "next/link";

import { User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import LogoutButton from "@/features/auth/components/logout/LogoutButton";

import { useAuthStore } from "@/stores/useAuthStore";

const UserMenu = () => {
  const { user } = useAuthStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex w-full items-center gap-2 rounded-md p-2 hover:bg-sidebar-accent">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.image} />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col items-start text-left">
            <span className="text-sm">{user?.name}</span>
            <span className="text-xs text-muted-foreground">View account</span>
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56"
      >
        <DropdownMenuItem asChild>
          <Link
            href="/profile"
            className="flex items-center gap-2"
          >
            <User size={16} />
            Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <LogoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
