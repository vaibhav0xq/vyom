import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vyom | Sealed Programmable Capsules on Sui",
  description:
    "Seal private messages, choose an unlock time, and share capsules safely.",
  openGraph: {
    title: "Vyom",
    description:
      "Seal private messages, choose an unlock time, and share capsules safely.",
    type: "website",
    siteName: "Vyom",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vyom",
    description:
      "Seal private messages, choose an unlock time, and share capsules safely.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col overflow-x-hidden bg-vyom-black text-vyom-white">
        {children}
      </body>
    </html>
  );
}
