import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "SPORVIA | Sports Club Management",
  description: "A comprehensive platform for athlete registration, competition management, and profile tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="container animate-fade-in">
          {children}
        </main>
      </body>
    </html>
  );
}
