import "./globals.css";
import {Providers} from "./providers";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"], // Ajustează greutățile necesare
  variable: "--font-poppins",
});

export const metadata = {
  title: "ZIC",
  description: "Web aplication created by Giurgia David in 2024.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      <link rel="icon" href="/assets/Z-logo.svg" sizes="any" />
      </head>
      <body className={`${poppins.variable} font-sans`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
