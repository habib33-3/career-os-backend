import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  id: string;
  name: string;
  logoUrl?: string | null;
};

const SourceCard = ({ id, name, logoUrl }: Props) => {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="transition-all duration-200 focus-within:ring-2 focus-within:ring-primary hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
      <Link href={`/sources/${id}`}>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="size-12 rounded-lg">
            <AvatarImage
              src={logoUrl ?? undefined}
              alt={`${name} logo`}
            />
            <AvatarFallback className="rounded-lg bg-primary/10 font-semibold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>

          <CardTitle className="line-clamp-2 text-base leading-snug">
            {name}
          </CardTitle>
        </CardHeader>
      </Link>
    </Card>
  );
};

export default SourceCard;
