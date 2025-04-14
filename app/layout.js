import { Noto_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/app/providers";
import Navbar from "@/components/Layout/Navbar";

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
        <Providers>
          <div className={"grid min-h-[100dvh] grid-rows-[1fr_auto]"}>
            <Navbar />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
