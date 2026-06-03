import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "One Stop Immigration Station — U.S. Immigration Services",
  description: "Centralizing U.S. immigration for businesses, families, and individuals — work visas, family visas, humanitarian relief, and I-9 compliance.",
  keywords: "immigration lawyer, H-1B visa, green card, DACA, family visa, immigration attorney",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Libre+Franklin:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/design/styles.css" />
        <link rel="stylesheet" href="/design/components.css" />
        <link rel="stylesheet" href="/design/additions.css" />
        <link rel="stylesheet" href="/design/pages.css" />
      </head>
      <body>
        {children}
        <Script src="/design/script.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
