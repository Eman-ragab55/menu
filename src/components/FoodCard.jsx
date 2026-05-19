"use client";

import React from "react";
import { useCart } from "@/src/context/CartContext";
import { useLang } from "@/src/context/LangContext";
import { Plus } from "lucide-react";

export default function FoodCard({ dish }) {
  const { addToCart } = useCart();
  const { lang } = useLang();

  const getLocalizedText = (field) => {
    if (!field) return "";
    if (typeof field === "object" && field[lang]) return field[lang];
    if (typeof field === "object") return field.en || field.ar || "";
    return field;
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-[1.2rem] md:rounded-[2rem] bg-stone-900/40 border border-white/[0.06] p-3 md:p-4 backdrop-blur-md transition-all duration-500 hover:shadow-xl hover:shadow-black/50 hover:-translate-y-1">
      
      <div>
        {/* بوكس الصورة: زوايا أصغر لتناسب الحجم الجديد */}
        <div className="relative aspect-square w-full overflow-hidden rounded-[0.8rem] md:rounded-[1.5rem] bg-stone-950">
          <img 
            src={dish.image} 
            alt={getLocalizedText(dish.name)} 
            className="h-full w-full object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </div>

        {/* الاسم والسعر: جعل الخطوط أصغر في الموبايل text-sm وتكبر في الكمبيوتر text-lg */}
        <div className="mt-3 md:mt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-4 px-0.5">
          <h3 className="text-sm md:text-lg font-light text-stone-100 tracking-tight leading-tight line-clamp-1">
            {getLocalizedText(dish.name)}
          </h3>
          <span className="font-inter text-xs md:text-sm font-semibold tracking-wider text-amber-500 whitespace-nowrap">
            {dish.price} {lang === "ar" ? "ج.م" : "EGP"}
          </span>
        </div>

        {/* وصف الطبق: خط أصغر وخفيف جداً */}
        <p className="mt-1 md:mt-2 px-0.5 text-[10px] md:text-xs font-light leading-relaxed text-stone-400 line-clamp-2">
          {getLocalizedText(dish.description)}
        </p>

        {/* بوكس المكونات: يختفي في الموبايل الصغير عشان يوفر مساحة ويظهر من أول الشاشات المتوسطة */}
        {dish.details && (
          <div className="hidden md:block mt-4 mx-0.5 p-3 rounded-xl bg-stone-950/60 border border-white/[0.03]">
            <span className="text-[10px] font-medium tracking-widest text-stone-500 uppercase block mb-1">
              {lang === "ar" ? "المكونات الأساسية" : "Key Ingredients"}
            </span>
            <p className="text-[11px] leading-relaxed text-stone-300 font-light">
              {getLocalizedText(dish.details)}
            </p>
          </div>
        )}
      </div>

      {/* الزرار: ملموم وبأزرار أصغر في الموبايل */}
      <div className="mt-3 md:mt-5 px-0.5">
        <button
          onClick={() => addToCart(dish)}
          className="flex w-full items-center justify-center gap-1 md:gap-2 rounded-lg md:rounded-xl bg-transparent border border-stone-800 py-2 md:py-3 text-[10px] md:text-xs tracking-widest text-stone-300 uppercase transition-all duration-300 hover:bg-amber-500 hover:border-amber-500 hover:text-black hover:font-medium active:scale-[0.98]"
        >
          <Plus className="h-3 w-3 md:h-3.5 md:w-3.5 stroke-[2]" />
          {lang === "ar" ? "إضافة" : "Add"}
        </button>
      </div>
      
    </div>
  );
}