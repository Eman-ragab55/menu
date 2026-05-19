"use client";

import React from "react";
import { useCart } from "@/src/context/CartContext";
import { useLang } from "@/src/context/LangContext";
import { ShoppingBag, Languages } from "lucide-react";

export default function Header({ onCartOpen }) {
  const { cartCount } = useCart();
  const { lang, toggleLang } = useLang();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.05] bg-[#0a0a0a]/70 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8">
        
        {/* اللوجو البسيط الفخم */}
        <div className="flex flex-col">
          <span className="font-inter text-2xl font-light tracking-[0.2em] text-white">AYLA</span>
          <span className="text-[9px] tracking-[0.4em] text-amber-500/80 uppercase font-light">
            {lang === "ar" ? "تجربة يابانية" : "Experience"}
          </span>
        </div>

        {/* أزرار التحكم (اللغة + السلة) */}
        <div className="flex items-center gap-6">
          {/* زر تبديل اللغة */}
          <button 
            onClick={toggleLang}
            className="flex items-center gap-2 text-sm font-light text-stone-400 hover:text-amber-500 transition-colors duration-300 group"
          >
            <Languages className="h-4 w-4 stroke-[1.5] group-hover:rotate-12 transition-transform" />
            <span className="font-inter tracking-wider">{lang === "ar" ? "EN" : "عربي"}</span>
          </button>

          {/* أيقونة السلة الذكية */}
          <button 
            onClick={onCartOpen}
            className="relative flex items-center justify-center p-2 text-stone-300 hover:text-white transition-colors duration-300"
          >
            <ShoppingBag className="h-5 w-5 stroke-[1.5]" />
            
            {/* بادج العداد - بيظهر بس لو في أطباق في السلة */}
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-black animate-scaleIn">
                {cartCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}