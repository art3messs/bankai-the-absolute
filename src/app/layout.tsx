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
  title: "Harleen • The 16th Birthday Archive 🌸",
  description: "An intimate luxury editorial celebration created for Harleen • February 16",
  metadataBase: new URL("https://harleen-birthday.vercel.app"),
  openGraph: {
    title: "Happy 16th Birthday, Harleen 🌸",
    description: "An intimate celebration created for Harleen • February 16",
    url: "/",
    siteName: "Harleen 16th Birthday Archive",
    images: [
      {
        url: "/media/harleen-red-feather-dress.jpg",
        width: 1200,
        height: 630,
        alt: "Harleen's 16th Birthday Celebration",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Happy 16th Birthday, Harleen 🌸",
    description: "An intimate celebration created for Harleen • February 16",
    images: ["/media/harleen-red-feather-dress.jpg"],
  },
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
      <body className="font-raleway antialiased bg-[#FFF8F5] text-[#3A1F2B] min-h-screen selection:bg-[#FFD9E3] selection:text-[#B0295F]">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
