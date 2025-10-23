import "./globals.css"
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Toaster } from "sonner";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Intervue_neo",
  description: "Ai interview platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark pattern">
      <body
        className={`${dmSans.className} antialiased`}
      >
        {children}
        <Toaster/>
      </body>
    </html>
  );
}
