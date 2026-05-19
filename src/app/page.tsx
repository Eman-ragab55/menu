"use client";

import React, { useState } from "react";
import Background from "@/src/components/Background";
import Header from "@/src/components/Header";
import Hero from "@/src/components/Hero";
import CatTabs from "@/src/components/CatTabs";
import FoodCard from "@/src/components/FoodCard";
import CartDrawer from "@/src/components/CartDrawer";
import Footer from "@/src/components/Footer";
import { menuData } from "@/src/data/menuData";
import { motion } from "framer-motion";

export default function Home() {
  const [activeTab, setActiveTab] = useState("all");
  const [isCartOpen, setIsCartOpen] = useState(false);

  const filteredDishes = menuData.dishes.filter((dish) => {
    if (activeTab === "all") return true;
    return dish.category === activeTab;
  });

  return (
    <>
      <Background />
      <Header onCartOpen={() => setIsCartOpen(true)} />

      {/* منع أي خروج للعناصر بره الشاشة الكلية بـ overflow-x-hidden */}
      <main className="min-h-screen w-full overflow-x-hidden">
        {/* 1. الـ Hero: متظبطة جواها الـ Typography عشان تصغر تلقائي في الموبايل */}
        <Hero />

        {/* 2. قسم المنيو مع جعل المسافات مرنة (Responsive Margins) */}
        {/* في الموبايل mt-20 أو mt-24 عشان المسافة ما تبقاش مبالغ فيها، وفي الشاشات الكبيرة تفتح لـ md:mt-40 */}
        <motion.section 
          id="menu-section"
          initial={{ y: 60, opacity: 0 }} // تقليل الـ offset لـ 60 عشان الموبايل مش بيحتاج مسافة طلوع ضخمة
          whileInView={{ y: 0, opacity: 1 }} 
          transition={{ 
            type: "spring",
            stiffness: 45,
            damping: 15,
            duration: 0.7 
          }} 
          viewport={{ once: true, amount: 0.05 }} // لقطة الأنميشن أسرع على الموبايل (0.05) عشان السكرول سريع
          className="mt-24 md:mt-40 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24"
        >
          {/* أزرار الأقسام (تأكدي إن المكون ده جواه سكرول أفقي للموبايل عشان الأقسام الكتير) */}
          <CatTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* شبكة الأكل الذكية (Responsive Grid 100%) */}
          {/* gap-6 في الموبايل عشان نوفر مساحة، وتكبر لـ md:gap-8 في الشاشات الكبيرة */}
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8 md:mt-12">
            {filteredDishes.map((dish) => (
              <FoodCard key={dish.id} dish={dish} />
            ))}
          </div>
        </motion.section>
      </main>

      {/* 3. الفوتر: متظبط جواه بالفعل إن العواميد تقلب فوق بعضها في الموبايل */}
      <Footer />

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}