import Link from "next/link";

import NotFoundState from "@/components/shared/NotFoundState";
import { Button } from "@/components/ui/button";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <NotFoundState
        title="404 - Page not found"
        description="This route doesn't exist or may have been moved."
        action={
          <div className="flex gap-3">
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>

            <Button
              variant="outline"
              asChild
            >
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default NotFoundPage;
