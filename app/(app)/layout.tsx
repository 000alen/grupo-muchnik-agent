import "./globals.css";
import { Metadata } from "next";
import { Toaster } from "sonner";
import { Providers } from "./providers";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Grupo Muchnik GPT",
  description: "Automatically research and profile potential clients",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        "selection:bg-primary/10"
      )}>
        <Toaster position="top-center" richColors />
        <Providers>
          <main className="relative flex min-h-screen flex-col">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
