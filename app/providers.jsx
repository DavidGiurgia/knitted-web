// app/providers.tsx
"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AuthProvider } from "./_context/AuthContext";
import { Toaster } from "react-hot-toast";
import { PanelProvider } from "./_context/PanelContext";

export function Providers({ children }) {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="light">
        <AuthProvider>
          <PanelProvider>
            {children}
            <Toaster
              toastOptions={{
                className: "dark:text-white dark:bg-gray-900",
              }}
            />
          </PanelProvider>
        </AuthProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
