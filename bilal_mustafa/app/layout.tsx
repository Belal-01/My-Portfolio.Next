import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'DevSecOps & FrontEnd Architecture Portfolio',
  description: 'Personal Portfolio & Admin Dashboard - FrontEnd & DevSecOps Architecture',
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

        {/* Clean Sharp Footer */}
        <footer className="w-full border-t border-purple-900/30 bg-black/70 backdrop-blur-md py-8">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.svg"
                alt="Bilal Khubieh Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="font-bold text-sm text-slate-200">Bilal Khubieh</span>
              <span className="text-slate-700">|</span>
              <p>© {new Date().getFullYear()} FrontEnd & DevSecOps Portfolio. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
