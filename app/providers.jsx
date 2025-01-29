// app/providers.tsx
"use client";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AuthProvider } from "./_context/AuthContext";
import { Toaster } from "react-hot-toast";
import { PanelProvider } from "./_context/PanelContext";
import { WebSocketProvider } from "./_context/WebSoketContext";

export function Providers({ children }) {
  return (
    <HeroUIProvider>
      <NextThemesProvider
        attribute="class"
        defaultTheme="light" // Set a default theme
        enableSystem={true} // Enable system preference detection
      >
        <AuthProvider>
          <WebSocketProvider>
            <PanelProvider>
              {children}
              <Toaster
                toastOptions={{
                  className: "dark:text-white dark:bg-gray-900",
                }}
              />
            </PanelProvider>
          </WebSocketProvider>
        </AuthProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
