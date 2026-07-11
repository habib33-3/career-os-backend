import type { Metadata } from "next";

import SourceCards from "@/features/sources/components/SourceCards";

export const metadata: Metadata = {
  title: "Sources",
  description: "Browse and manage your saved content sources.",
};

const SourcesPage = () => {
  return (
    <div>
      <SourceCards />
    </div>
  );
};

export default SourcesPage;
