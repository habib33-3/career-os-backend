import { type PropsWithChildren } from "react";

import Navbar from "@/components/shared/Navbar";
import Sidebar from "@/components/shared/Sidebar";

import AuthProvider from "@/providers/AuthProvider";

const ProtectedLayout = ({ children }: PropsWithChildren) => {
  // Authentication redirects are handled in the middleware (src/proxy.ts).
  // Avoid performing an additional server-side redirect here to prevent
  // redirect loops between middleware and layout.

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* App body */}
      <div className="flex">
        {/* Sidebar (desktop only) */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 px-4 py-4 md:px-6 md:py-6">
          <div className="mx-auto w-full max-w-6xl">
            <AuthProvider>{children}</AuthProvider>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProtectedLayout;
