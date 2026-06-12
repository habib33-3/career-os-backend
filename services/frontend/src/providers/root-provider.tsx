"use client";

import { type ReactNode } from "react";

import ThemeProvider from "./ThemeProvider";
import ToasterProvider from "./ToasterProvider";
import TanstackProviders from "./tanstack-providers";

const RootProvider = ({ children }: { children: ReactNode }) => {
  return (
    <TanstackProviders>
      <ThemeProvider>
        {children}
        <ToasterProvider />
      </ThemeProvider>
    </TanstackProviders>
  );
};

export default RootProvider;
