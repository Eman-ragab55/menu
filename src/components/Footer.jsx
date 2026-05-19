"use client";

import React from "react";
import { useLang } from "@/src/context/LangContext";
import { menuData } from "@/src/data/menuData";
import { Phone, MapPin, Clock, Share2 } from "lucide-react"; // استبدلنا المسببة للمشكلة بـ Share2

export default function Footer() {
  const { lang } = useLang();

  // دالة للنزول بسلاسة لقسم المنيو لما يدوس على اللينكات
  const scrollToMenu = () => {
    document.getElementById("menu-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative mt-20 border-t border-white/[0.04] bg-stone-950/80 backdrop-blur-md py-16 text-stone-400">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* العمود الأول: براند المطعم */}
        <div className="flex flex-col gap-4">
          <h2 className="font-playfair text-2xl font-light tracking-widest text-stone-100 uppercase">
            AYLA
            <span className="block text-[10px] tracking-[0.3em] text-amber-500 font-inter mt-1">EXPERIENCE</span>
          </h2>
          <p className="text-xs font-light leading-relaxed max-w-xs text-stone-500">
            {lang === "ar" 
              ? "تجربة طهي استثنائية مستوحاة من بساطة الفن الياباني والطهي العصري الفاخر." 
              : "An exceptional culinary experience inspired by minimalist Japanese art and modern fine dining."}
          </p>
        </div>

        {/* العمود الثاني: لينكات سريعة للمنيو */}
        <div>
          <h4 className="text-xs font-medium tracking-widest text-stone-200 uppercase mb-5">
            {lang === "ar" ? "تصفح القائمة" : "Discover Menu"}
          </h4>
          <ul className="flex flex-col gap-3 text-xs font-light">
            {menuData?.categories?.map((cat) => (
              <li key={cat.id}>
                <button 
                  onClick={scrollToMenu}
                  className="hover:text-amber-500 transition-colors duration-300"
                >
                  {cat.name[lang]}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* العمود الثالث: مواعيد العمل */}
        <div>
          <h4 className="text-xs font-medium tracking-widest text-stone-200 uppercase mb-5">
            {lang === "ar" ? "ساعات العمل" : "Opening Hours"}
          </h4>
          <div className="flex flex-col gap-3 text-xs font-light">
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-amber-500/70 shrink-0" />
              <span>{lang === "ar" ? "يومياً: ١٢ مساءً - ١٢ صباحاً" : "Daily: 12 PM - 12 AM"}</span>
            </div>
            <div className="flex items-center gap-2 text-stone-500">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span>{lang === "ar" ? "الإسكندرية، مصر" : "Alexandria, Egypt"}</span>
            </div>
          </div>
        </div>

        {/* العمود الرابع: التواصل الاجتماعي والطلب */}
        <div>
          <h4 className="text-xs font-medium tracking-widest text-stone-200 uppercase mb-5">
            {lang === "ar" ? "تواصل معنا" : "Connect With Us"}
          </h4>
          <div className="flex flex-col gap-4 text-xs font-light">
            <a 
              href={`https://wa.me/${menuData?.whatsappNumber}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-amber-500 transition-colors duration-300"
            >
              <Phone className="h-3.5 w-3.5 text-amber-500/70" />
              <span className="font-mono">WhatsApp Order</span>
            </a>
            <div className="flex gap-3 mt-2">
              <a href="#" className="h-8 w-8 rounded-full border border-white/[0.05] flex items-center justify-center hover:border-amber-500 hover:text-amber-500 transition-all duration-300" title="Social">
                <Share2 className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* شريط الحقوق السفلي جداً */}
      <div className="mx-auto max-w-7xl px-6 sm:px-8 mt-16 pt-8 border-t border-white/[0.02] flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-light text-stone-600">
        <p>© {new Date().getFullYear()} Ayla Experience. All rights reserved.</p>
        <p className="tracking-wide">
          Designed & Developed with <span className="text-amber-500/60">♥</span>
        </p>
      </div>
    </footer>
  );
}