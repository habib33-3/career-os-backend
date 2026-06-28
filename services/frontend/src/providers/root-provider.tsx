"use client";

import { type ReactNode } from "react";

import NuqsProvider from "./NuqsProvider";
import ThemeProvider from "./ThemeProvider";
import ToasterProvider from "./ToasterProvider";
import TanstackProviders from "./tanstack-providers";

const RootProvider = ({ children }: { children: ReactNode }) => {
  return (
    <TanstackProviders>
      <ThemeProvider>
        <NuqsProvider>{children}</NuqsProvider>

        <ToasterProvider />
      </ThemeProvider>
    </TanstackProviders>
  );
};

export default RootProvider;
