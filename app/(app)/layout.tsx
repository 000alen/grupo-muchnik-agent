import "./globals.css";
import { Metadata } from "next";
import { Toaster } from "sonner";
import { Providers } from "./providers";

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
    <html lang="en">
      <body>
        <Toaster position="top-center" richColors />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
