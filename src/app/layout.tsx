import type { Metadata } from "next";
import { Provider } from "react-redux";
import { Inter } from "next/font/google";
import "./globals.css";
import store from "./store";
import Providers from './Providers';
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FomoFactory Assessment",
  description: "Coin App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <Providers>{children}</Providers>
      </body>
    </html>
  );
}
