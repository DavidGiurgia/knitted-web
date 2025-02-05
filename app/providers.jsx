// app/providers.tsx
"use client";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AuthProvider } from "./_context/AuthContext";
import { Toaster } from "react-hot-toast";
import { PanelProvider } from "./_context/PanelContext";
import { WebSocketProvider } from "./_context/WebSoketContext";
import { KeyboardProvider } from "./_context/KeyboardContext";

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
            <KeyboardProvider>
              <PanelProvider>
                {children}
                <Toaster
                  toastOptions={{
                    className: "dark:text-white dark:bg-gray-900",
                  }}
                />
              </PanelProvider>
            </KeyboardProvider>
          </WebSocketProvider>
        </AuthProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
