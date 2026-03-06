import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PawsitiveID - Find Their Family",
  description:
    "AI-powered lost pet matching. Upload a photo of a stray, and we'll search shelters, rescues, and lost pet databases to reunite them with their family.",
  keywords: ["lost pet", "found dog", "animal rescue", "pet matching", "shelter search"],
  metadataBase: new URL("https://pawsitiveid.vercel.app"),
  openGraph: {
    title: "PawsitiveID - Find Their Family",
    description:
      "Found a stray? Upload a photo and our AI will identify the breed, search shelters, and help reunite them with their family.",
    url: "https://pawsitiveid.vercel.app",
    siteName: "PawsitiveID",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PawsitiveID - Find Their Family",
    description:
      "Found a stray? Upload a photo and our AI will identify the breed, search shelters, and help reunite them with their family.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
