import { type ComponentProps } from "react";

import { ThemeProvider as NextThemesProvider } from "next-themes";

type Props = ComponentProps<typeof NextThemesProvider>;

const ThemeProvider = ({ children, ...props }: Props) => {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
};

export default ThemeProvider;
