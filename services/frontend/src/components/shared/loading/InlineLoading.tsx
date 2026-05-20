import { cn } from "@/lib/utils";

type Props = {
  text?: string;
  className?: string;
  showText?: boolean;
};

const InlineLoading = ({
  text = "Processing...",
  className,
  showText = true,
}: Props) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm text-muted-foreground",
        className
      )}
    >
      <div className="h-3 w-3 animate-spin rounded-full border-2 border-transparent border-t-primary" />

      {showText && <span>{text}</span>}
    </div>
  );
};

export default InlineLoading;
