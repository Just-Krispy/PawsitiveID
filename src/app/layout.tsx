import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PawsitiveID - Find Their Family",
  description:
    "AI-powered lost pet matching. Upload a photo of a stray, and we'll search shelters, rescues, and lost pet databases to reunite them with their family.",
  keywords: ["lost pet", "found dog", "animal rescue", "pet matching", "shelter search"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="paw-cursor min-h-screen">
        {children}
      </body>
    </html>
  );
}
