import { Noto_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/app/providers";

const noto_sans = Noto_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
});

export const metadata = {
  title: "Crunch Time",
  description:
    "High quality ingredients mixed with excellent service is the best recipe for a successful food vendor."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={noto_sans.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
