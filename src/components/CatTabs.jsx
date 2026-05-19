"use client";

import React from "react";
import { menuData } from "@/src/data/menuData";
import { useLang } from "@/src/context/LangContext";

export default function CatTabs({ activeTab, setActiveTab }) {
  const { lang } = useLang();

  return (
    <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 mb-12">
      {/* شريط الأزرار - بيعمل Scroll لو الشاشة صغيرة عشان الـ Responsive */}
      <div className="flex items-center justify-start sm:justify-center gap-3 overflow-x-auto pb-4 scrollbar-none border-b border-white/[0.03]">
        {menuData.categories.map((category) => {
          const isActive = activeTab === category.id;
          
          return (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`whitespace-nowrap px-6 py-2.5 text-xs tracking-widest uppercase rounded-full transition-all duration-300 border font-light ${
                isActive
                  ? "bg-amber-500 border-amber-500 text-black font-normal shadow-lg shadow-amber-500/10"
                  : "bg-transparent border-stone-800 text-stone-400 hover:text-white hover:border-stone-600"
              }`}
            >
              {category.name[lang]}
            </button>
          );
        })}
      </div>
    </div>
  );
}