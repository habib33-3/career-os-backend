import { type ReactNode } from "react";

import ToasterProvider from "./ToasterProvider";
import TanstackProviders from "./tanstack-providers";

const RootProvider = ({ children }: { children: ReactNode }) => {
  return (
    <TanstackProviders>
      {children}
      <ToasterProvider />
    </TanstackProviders>
  );
};

export default RootProvider;
