import type { Metadata } from "next";
import { Forum, Parisienne, Raleway } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";

const forum = Forum({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-forum",
  display: "swap",
});

const parisienne = Parisienne({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-parisienne",
  display: "swap",
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Harleen • The Editorial Archive 🌸",
  description: "An intimate luxury editorial celebration for Harleen • February 16",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌸</text></svg>",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${forum.variable} ${parisienne.variable} ${raleway.variable} scroll-smooth`}>
      <body className="font-raleway antialiased bg-[#fdfaf5] text-[#241e16] min-h-screen selection:bg-rose-200 selection:text-rose-950">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
