import type { Metadata } from "next";
import { Young_Serif, Figtree, Reenie_Beanie } from "next/font/google";
import "./globals.css";

const youngSerif = Young_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-young-serif",
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

const reenieBeanie = Reenie_Beanie({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-reenie-beanie",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Harleen • Birthday celebration",
  description: "A private birthday celebration made for Harleen • 16 February",
  metadataBase: new URL("https://harleen-birthday.vercel.app"),
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Harleen • Birthday celebration",
    description: "A private birthday celebration made for Harleen • 16 February",
    url: "/",
    siteName: "Harleen birthday",
    images: [
      {
        url: "/media/harleen-red-feather-dress.jpg",
        width: 1200,
        height: 630,
        alt: "Harleen",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Harleen • Birthday celebration",
    description: "A private birthday celebration made for Harleen • 16 February",
    images: ["/media/harleen-red-feather-dress.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${youngSerif.variable} ${figtree.variable} ${reenieBeanie.variable} scroll-smooth`}
    >
      <body className="font-sans antialiased bg-box-pink text-ink min-h-screen selection:bg-strawberry/20 selection:text-ink">
        {children}
      </body>
    </html>
  );
}
