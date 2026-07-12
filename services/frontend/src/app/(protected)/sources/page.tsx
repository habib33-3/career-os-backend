import type { Metadata } from "next";

import SourceCards from "@/features/sources/components/SourceCards";
import CreateSourceDialog from "@/features/sources/components/create-source/CreateSourceDialog";

export const metadata: Metadata = {
  title: "Sources",
  description: "Browse and manage your saved content sources.",
};

const SourcesPage = () => {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <section className="mb-8 flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Sources</h1>

          <p className="max-w-2xl text-muted-foreground">
            Organize websites, blogs, documentation, and other resources you
            want to track. Create a source to start collecting content.
          </p>
        </div>

        <div className="w-full sm:w-auto">
          <CreateSourceDialog />
        </div>
      </section>

      <section>
        <SourceCards />
      </section>
    </main>
  );
};

export default SourcesPage;
