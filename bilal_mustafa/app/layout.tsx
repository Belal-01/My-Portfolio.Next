import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'Bilal Khubieh | FrontEnd & DevSecOps Portfolio',
  description: 'Personal Portfolio & Admin Dashboard - FrontEnd & DevSecOps Architecture',
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" className={cn("dark", "font-sans", geist.variable)}>
      <body className="min-h-screen bg-mesh-gradient grid-pattern text-slate-100 antialiased selection:bg-purple-500 selection:text-white flex flex-col justify-between">
        {/* Clean Responsive Header */}
        <Header />

        <main className="w-full min-h-[calc(100vh-10rem)] flex-1">
          {children}
        </main>

        {/* Dedicated Modern Footer */}
        <Footer />
      </body>
    </html>
  );
}
