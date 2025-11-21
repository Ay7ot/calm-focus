import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import ConditionalSidebar from "@/components/ConditionalSidebar";
import ConditionalLayout from "@/components/ConditionalLayout";
import { MobileSidebarProvider } from "@/components/MobileSidebar";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Calm Focus",
  description: "A therapeutic productivity app for focus and mental wellness",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto.variable}`}>
      <body className="antialiased bg-surface text-on-surface">
        <AuthProvider>
          <MobileSidebarProvider>
            <ConditionalSidebar />
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </MobileSidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
