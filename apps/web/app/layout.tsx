import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const baseUrl = 'https://www.onestopimmigrationstation.com'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Immigration Lawyer & Visa Services | One Stop Immigration Station",
    template: "%s | One Stop Immigration Station",
  },
  description: "Trusted U.S. immigration attorneys helping businesses, families, and individuals with H-1B, green card, K-1 fiancé visa, DACA, and more. Bilingual EN/ES. Free consultation.",
  keywords: [
    "immigration lawyer",
    "immigration attorney",
    "H-1B visa attorney",
    "green card lawyer",
    "K-1 fiancé visa",
    "DACA attorney",
    "work visa lawyer",
    "family immigration lawyer",
    "I-9 compliance",
    "L-1 visa",
    "immigration law firm",
  ],
  authors: [{ name: "One Stop Immigration Station" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "One Stop Immigration Station",
    title: "Immigration Lawyer & Visa Services | One Stop Immigration Station",
    description: "Trusted U.S. immigration attorneys helping businesses, families, and individuals with H-1B, green card, K-1 fiancé visa, DACA, and more. Bilingual EN/ES. Free consultation.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "One Stop Immigration Station — U.S. Immigration Law Firm",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Immigration Lawyer & Visa Services | One Stop Immigration Station",
    description: "Trusted U.S. immigration attorneys. H-1B, green card, K-1, DACA, and more. Bilingual EN/ES. Free consultation.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: baseUrl,
  },
};

// JSON-LD structured data — tells Google this is a law firm
const legalServiceSchema = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  "name": "One Stop Immigration Station",
  "url": baseUrl,
  "telephone": "(800) SUB-HROY",
  "email": "admin@mylegalimmigrationservices.com",
  "description": "U.S. immigration law firm providing services for work visas, family visas, humanitarian relief, and I-9 compliance. Bilingual English and Spanish.",
  "areaServed": "United States",
  "availableLanguage": ["English", "Spanish"],
  "priceRange": "$$",
  "serviceType": [
    "H-1B Visa", "L-1 Visa", "K-1 Fiancé Visa", "Green Card",
    "DACA", "Asylum", "I-9 Compliance", "Family Immigration",
  ],
}

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(legalServiceSchema) }}
        />
      </head>
      <body>
        {children}
        <Script src="/design/script.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
