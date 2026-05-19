"use client";

import React from "react";
import { useLang } from "@/src/context/LangContext";

export default function Hero() {
  const { lang } = useLang();

  // رابط صورة الطبق الفخم الكبير اللي هيملأ الخلفية (تقدري تبدليه بأي صورة)
  const bgImage = "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1920";

  return (
    <section className="relative h-screen w-full overflow-hidden bg-stone-950">
      
      {/* 1. صورة الطبق الكبيرة اللي مالية الخلفية بالكامل */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{ backgroundImage: `url('${bgImage}')` }}
      />

      {/* 2. الـ Overlay (الظلال النظيفة عشان التيكست يبان وميغطيش على جمال الطبق) */}
      {/* لو الـ Theme غامق بنسيب الـ Overlay ده، لو فاتح بنخليه أبيض شفاف */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent max-md:bg-black/60 z-10" />

      {/* 3. محتوى التيكست المكتوب فوق الصورة (على الشمال بالظبط زي الـ Layouts اللي بعتيها) */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-6 md:px-12 flex items-center">
        <div className="max-w-xl text-left md:animate-fadeIn">
          
          {/* هيدلاين فخم وتايبوجرافي قوي */}
          <h1 className="font-inter text-5xl sm:text-7xl font-extralight tracking-tight text-white leading-[1.1]">
            {lang === "ar" ? (
              <>
                مذاق فريد <br />
                <span className="font-light text-amber-500">في انتظارك</span>
              </>
            ) : (
              <>
                Delicious Food <br />
                <span className="font-light text-amber-500">Is Waiting For You</span>
              </>
            )}
          </h1>

          {/* وصف صغير وراقي تحت العنوان */}
          <p className="mt-6 text-base font-light text-stone-300 leading-relaxed max-w-md">
            {lang === "ar" ? 
              "اكتشف تجربة طهي استثنائية تجمع بين المكونات العضوية الطازجة وفن التقديم العصري المبتكر." : 
              "Discover an exceptional culinary experience combining fresh organic ingredients and innovative modern presentation."
            }
          </p>

          {/* زرار الـ Call to Action الأنيق */}
          <div className="mt-8">
            <button 
              onClick={() => document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="rounded-full bg-amber-500 px-8 py-4 text-xs font-medium uppercase tracking-widest text-black transition-all duration-300 hover:bg-white hover:scale-105 active:scale-98 shadow-xl shadow-amber-500/10"
            >
              {lang === "ar" ? "تصفح المنيو" : "Book Menu"}
            </button>
          </div>

        </div>
      </div>

    </section>
  );
}