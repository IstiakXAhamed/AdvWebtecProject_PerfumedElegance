import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

// SEO Best Practice: Professional page metadata
export const metadata: Metadata = {
  title: 'Perfumed Elegance | Luxury Fragrance Collection',
  description: 'Discover your signature scent from our premium, highly curated collection of luxury perfumes.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        {/* Load Inter font from Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-base-100 text-base-content">
        {/* Render our dynamic Navigation Bar globally */}
        <Navbar />
        
        {/* Render active page route content below the Navbar */}
        <main className="flex-grow">{children}</main>

        {/* Render our custom official minimalist Footer globally at the bottom */}
        <Footer />
      </body>
    </html>
  );
}
