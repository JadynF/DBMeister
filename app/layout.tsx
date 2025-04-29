import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

// Load custom fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap", // Improves loading performance
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DBMeister - Database Management Made Simple",
  description: "A powerful database management tool with intuitive interfaces",
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-slate-50`}
      >

        <main className="flex-1">
          {children}
        </main>

        
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}

//<header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
//          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
//            <div className="font-medium text-lg">DBMeister</div>
//          </div>
//        </header>
//
//<footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-4">
//<div className="container mx-auto px-4 text-center text-sm text-slate-600 dark:text-slate-400">
//  <p>DBMeister © {new Date().getFullYear()}</p>
//</div>
//</footer>