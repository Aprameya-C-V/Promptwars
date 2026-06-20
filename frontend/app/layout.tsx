import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hesychia",
  description: "Stillness for high-stakes study"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
