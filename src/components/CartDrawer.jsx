"use client";

import React from "react";
import { useCart } from "@/src/context/CartContext";
import { useLang } from "@/src/context/LangContext";
import { menuData } from "@/src/data/menuData";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";

export default function CartDrawer({ isOpen, onClose }) {
  const { cartItems, addToCart, removeFromCart, clearItem, cartTotal } = useCart();
  const { lang } = useLang();

  // لو السلة مقفولة مش هنظهر حاجة تماماً
  if (!isOpen) return null;

  // فُانكشن إرسال الطلب للواتساب بـ تنسيق راقي جداً
  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    // بناء نص الرسالة بذكاء حسب اللغة
    let message = lang === "ar" 
      ? `*طلب جديد من Ayla Experience* 🌟\n\n*الطلبات:*\n`
      : `*New Order from Ayla Experience* 🌟\n\n*Items:*\n`;

    cartItems.forEach((item) => {
      message += `• ${item.name[lang]} (x${item.quantity}) -> ${item.price * item.quantity} ${lang === "ar" ? "ج.م" : "EGP"}\n`;
    });

    message += `\n*${lang === "ar" ? "إجمالي الحساب" : "Total Price"}:* ${cartTotal} ${lang === "ar" ? "ج.م" : "EGP"}\n`;
    message += `--------------------------------`;

    // عمل encode للنص عشان المتصفح يفهمه والـ Link ما يتكسرش
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${menuData.whatsappNumber}?text=${encodedMessage}`;

    // فتح شات الواتساب في صفحة جديدة فوراً
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* الخلفية المظلمة الشفافة (Overlay) عند الضغط عليها تقفل السلة */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* لوحة السلة الجانبية (Drawer Panel) */}
      <div className={`absolute top-0 bottom-0 w-full max-w-md bg-[#0d0d0d] border-stone-800 p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 ${
        lang === "ar" ? "left-0 border-r" : "right-0 border-l"
      }`}>
        
        {/* الـ Header بتاع السلة */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.05]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-amber-500 stroke-[1.5]" />
            <h2 className="text-lg font-light text-stone-100">
              {lang === "ar" ? "سلة المأكولات" : "Your Order"}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-stone-400 hover:text-white transition-colors">
            <X className="h-5 w-5 stroke-[1.5]" />
          </button>
        </div>

        {/* جسم السلة (قائمة المنتجات) */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 scrollbar-none">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500">
              <ShoppingBag className="h-12 w-12 stroke-[1] mb-3 opacity-30" />
              <p className="text-sm font-light">
                {lang === "ar" ? "سلتك فارغة حالياً.. ألقِ نظرة على القائمة" : "Your cart is empty.. explore the menu"}
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.01] border border-white/[0.03] hover:border-white/[0.06] transition-all"
              >
                {/* اسم وطبق وتفاصيل السعر */}
                <div className="flex-1 min-w-0 pr-2">
                  <h4 className="text-sm font-light text-stone-200 truncate">{item.name[lang]}</h4>
                  <p className="text-xs text-amber-500/80 font-inter mt-1">
                    {item.price * item.quantity} {lang === "ar" ? "ج.م" : "EGP"}
                  </p>
                </div>

                {/* أزرار التحكم بالكمية (+ / - / مسح) */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-stone-900 border border-white/[0.05] rounded-lg overflow-hidden">
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 text-stone-400 hover:text-white transition-colors"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="px-2 text-xs font-inter font-medium text-stone-200">{item.quantity}</span>
                    <button 
                      onClick={() => addToCart(item)}
                      className="p-1.5 text-stone-400 hover:text-white transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  
                  {/* زر الحذف النهائي */}
                  <button 
                    onClick={() => clearItem(item.id)}
                    className="p-2 text-stone-600 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 stroke-[1.5]" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* الفاتورة وزر الدفع السحري */}
        {cartItems.length > 0 && (
          <div className="pt-4 border-t border-white/[0.05] space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-400 font-light">{lang === "ar" ? "المجموع الإجمالي:" : "Subtotal:"}</span>
              <span className="text-base font-inter font-semibold text-amber-500">{cartTotal} {lang === "ar" ? "ج.م" : "EGP"}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full rounded-xl bg-amber-500 py-3.5 text-xs font-normal tracking-widest text-black uppercase transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-white/5 active:scale-95"
            >
              {lang === "ar" ? "إرسال الطلب عبر الواتساب" : "Send Order via WhatsApp"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}