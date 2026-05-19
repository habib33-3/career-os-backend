import { type ReactNode } from "react";

import TanstackProviders from "./tanstack-providers";

const RootProvider = ({ children }: { children: ReactNode }) => {
  return <TanstackProviders>{children}</TanstackProviders>;
};

export default RootProvider;
