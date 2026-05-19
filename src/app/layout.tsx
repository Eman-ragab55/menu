import { Inter, Cairo } from "next/font/google";
import { CartProvider } from "@/src/context/CartContext";
import { LangProvider } from "@/src/context/LangContext";
import "./globals.css";

// خطوط راقية: Cairo للعربي و Inter للإنجليزي
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cairo = Cairo({ subsets: ["arabic"], variable: "--font-cairo" });

export const metadata = {
  title: "Ayla Experience | Fine Dining",
  description: "A minimalist luxury Japanese culinary journey",
};

// تحديد الـ Interface والـ Types للـ TypeScript عشان الـ Build ينجح
interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ar" dir="rtl" className={`${inter.variable} ${cairo.variable}`}>
      <body className="bg-[#050505] text-stone-100 antialiased font-cairo overflow-x-hidden">
        <LangProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </LangProvider>
      </body>
    </html>
  );
}