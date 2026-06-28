import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  id: string;
  name: string;
  logoUrl?: string;
};

const SourceCard = ({ id, name, logoUrl }: Props) => {
  return (
    <Card className="transition-all hover:border-primary/40 hover:bg-accent/40 hover:shadow-sm">
      <Link href={`/sources/${id}`}>
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
          <Avatar className="size-12 rounded-lg">
            <AvatarImage
              src={logoUrl}
              alt={`${name} logo`}
            />
            <AvatarFallback className="rounded-lg text-base font-semibold">
              {name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <CardTitle className="truncate text-base">{name}</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground">Source</p>
        </CardContent>
      </Link>
    </Card>
  );
};

export default SourceCard;
