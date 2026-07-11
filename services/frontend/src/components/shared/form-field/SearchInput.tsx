import { useEffect, useState } from "react";

import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import useDebounce from "@/hooks/useDebounce";

import { cn } from "@/lib/utils";

type Props = {
  value?: string;
  onSearch: (value: string) => void;
  placeholder?: string;
  delay?: number;
  disabled?: boolean;
  className?: string;
};

const SearchInput = ({
  onSearch,
  className,
  placeholder = "Search ...",
  disabled,
  delay = 300,
  value = "",
}: Props) => {
  const [search, setSearch] = useState(value);
  const [prevValue, setPrevValue] = useState(value);

  // Adjust state during render instead of in an effect (avoids extra render pass)
  if (value !== prevValue) {
    setPrevValue(value);
    setSearch(value);
  }

  const debouncedSearch = useDebounce(search, delay);

  useEffect(() => {
    onSearch(debouncedSearch.trim());
  }, [debouncedSearch, onSearch]);

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="pr-10 pl-9"
      />

      {search && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setSearch("")}
          className="absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default SearchInput;
