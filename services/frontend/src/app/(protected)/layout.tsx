import { type PropsWithChildren } from "react";

import Sidebar from "@/components/Navigation/Sidebar";

import AuthProvider from "@/providers/AuthProvider";

const ProtectedLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-6xl px-4 py-4 md:px-6 md:py-6">
          <AuthProvider>{children}</AuthProvider>
        </div>
      </main>
    </div>
  );
};

export default ProtectedLayout;
