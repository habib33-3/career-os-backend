"use client";

import InlineLoading from "@/components/shared/loading/InlineLoading";
import { Button } from "@/components/ui/button";

import useLogout from "../../hooks/useLogout";

const LogoutButton = () => {
  const { mutate, isPending } = useLogout();

  const handleLogout = () => {
    if (isPending) return;
    mutate();
  };

  return (
    <Button
      variant="ghost"
      onClick={handleLogout}
      disabled={isPending}
    >
      {isPending ? (
        <InlineLoading
          showText
          text="Logging out..."
        />
      ) : (
        "Logout"
      )}
    </Button>
  );
};

export default LogoutButton;
