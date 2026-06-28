import { type PropsWithChildren } from "react";

import { NuqsAdapter } from "nuqs/adapters/next/app";

const NuqsProvider = ({ children }: PropsWithChildren) => {
  return <NuqsAdapter>{children}</NuqsAdapter>;
};

export default NuqsProvider;
