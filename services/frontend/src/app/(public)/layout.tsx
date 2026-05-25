import { type PropsWithChildren } from "react";

import PublicNavbar from "@/features/public/components/PublicNavbar";

const PublicLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Top Navigation */}
      <PublicNavbar />

      {/* Main Content */}
      <main className="w-full flex-1">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 md:py-10">
          {children}
        </div>
      </main>

      {/* Future: Footer slot */}
      {/* <PublicFooter /> */}
    </div>
  );
};

export default PublicLayout;
