// Root layout for the Next.js app. Applies global styles and shared providers once for every page.
import type { Metadata } from "next";
import { Changa_One } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";

// Geist carries every task surface. Changa One is the brand voice and is
// scoped to the hero — see DESIGN.md, "Typography".
const changaOne = Changa_One({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-changa-one",
});

export const metadata: Metadata = {
  title: "Arkana",
  description:
    "Gestão de campanhas de arrecadação do projeto Lideranças Empáticas: times, contribuições, metas e relatórios.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${GeistSans.variable} ${GeistMono.variable} ${changaOne.variable}`}
    >
      <body className="font-sans">
        {children}
        {/* Mounted once so no surface has to fall back to window.alert(). */}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
