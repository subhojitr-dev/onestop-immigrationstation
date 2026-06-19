import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Contact an Immigration Lawyer — Free Consultation",
  description: "Contact One Stop Immigration Station for a free immigration consultation. We help with H-1B, green card, K-1 fiancé visa, DACA, family visas, and more. Bilingual EN/ES.",
  openGraph: {
    title: "Contact an Immigration Lawyer | One Stop Immigration Station",
    description: "Free immigration consultation. H-1B, green card, K-1, DACA, family visas, and more. Bilingual EN/ES.",
    url: "https://www.onestopimmigrationstation.com/contact",
  },
  alternates: { canonical: "https://www.onestopimmigrationstation.com/contact" },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
