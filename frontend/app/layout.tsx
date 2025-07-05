import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import Navbar from './components/Navbar';
import { ClerkProvider } from '@clerk/nextjs';
import '@rainbow-me/rainbowkit/styles.css';
import { Providers } from './providers';
import { FlowProvider } from "@onflow/kit";

import flowJson from "../flow.json"

const lato = Lato({
  weight: ['100', '300', '400', '700', '900'],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Snitch",
  description: "Snitch",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
      <ClerkProvider>
        <html lang="en">
          <body className={lato.className}>
            <Providers>
              <Navbar />
              {children}
            </Providers>
          </body>
        </html>
      </ClerkProvider>
    
  );
}
