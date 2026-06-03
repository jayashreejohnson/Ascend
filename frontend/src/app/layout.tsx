import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OfficeHours",
  description: "Shared coordination notes for people and opportunities",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
