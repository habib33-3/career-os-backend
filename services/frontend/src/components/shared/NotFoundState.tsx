import { type ReactNode } from "react";

import { Card, CardContent, CardHeader } from "../ui/card";

type Props = { title?: string; description?: string; action?: ReactNode };

const NotFoundState = ({
  title = "Nothing here",
  description = "We couldn't find what you're looking for.",
  action,
}: Props) => {
  return (
    <Card className="w-full max-w-md border-border bg-card text-card-foreground shadow-sm">
      <CardHeader className="space-y-2 text-center">
        <div className="text-5xl font-semibold text-primary">404</div>

        <h2 className="text-lg font-semibold">{title}</h2>

        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>

      {action && (
        <CardContent className="flex justify-center pt-2">{action}</CardContent>
      )}
    </Card>
  );
};

export default NotFoundState;
