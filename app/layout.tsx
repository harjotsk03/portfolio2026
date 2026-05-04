import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Inter,
  Gamja_Flower,
  Google_Sans,
  Modak,
} from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { CursorSetup } from "@/components/cursor-setup";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Navbar } from "@/components/navbar";
import { ScrollToTopButton } from "@/components/scroll-to-top";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const gamjaFlower = Gamja_Flower({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-gamja",
});

const googleSans = Google_Sans({
  subsets: ["latin"],
  variable: "--font-google-sans",
});

const modak = Modak({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-modak",
});

export const metadata: Metadata = {
  title: "Harjot Singh Portfolio",
  description: "Harjot Singh Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",

        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
        gamjaFlower.variable,
        googleSans.variable,
        modak.variable,
      )}
    >
      <body className="min-h-full flex flex-col overflow-x-clip">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <SmoothScroll />
          {children}
          <ScrollToTopButton />
          <CursorSetup />
        </ThemeProvider>
      </body>
    </html>
  );
}
