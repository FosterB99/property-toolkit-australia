import type { Metadata } from "next";
import { SiteNav } from "./components/SiteNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aussie Property | Premium Australian Property Toolkit",
  description:
    "A premium Australian property website landing page for buying, investing, grants, and renovating.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.10),_transparent_32%),linear-gradient(135deg,_#f7fffb_0%,_#f3f9ff_55%,_#ffffff_100%)] text-slate-900">
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
