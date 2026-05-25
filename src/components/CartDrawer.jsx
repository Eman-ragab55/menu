"use client";

import React, { useState } from "react";
import { useCart } from "@/src/context/CartContext";
import { useLang } from "@/src/context/LangContext";
import { menuData } from "@/src/data/menuData";
import { X, Plus, Minus, Trash2, ShoppingBag, CreditCard, Banknote, User, MapPin, Phone } from "lucide-react";

export default function CartDrawer({ isOpen, onClose }) {
  const { 
    cartItems, 
    addToCart, 
    removeFromCart, 
    clearItem, 
    cartTotal, 
    paymentMethod, 
    updatePaymentMethod 
  } = useCart();
  const { lang } = useLang();

  // الـ States الخاصة ببيانات العميل الجديدة
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");

  // لو السلة مقفولة مش هنظهر حاجة تماماً
  if (!isOpen) return null;

  // فُانكشن إرسال الطلب للواتساب
  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    // التأكد من ملء البيانات الأساسية أولاً لحماية صاحب المكان
    if (!customerName || !customerAddress || !phone1) {
      alert(lang === "ar" ? "برجاء ملء الاسم، العنوان، ورقم الهاتف الأساسي!" : "Please fill in Name, Address, and Primary Phone!");
      return;
    }

    // بناء نص رسالة طريقة الدفع
    let paymentText = "";
    if (lang === "ar") {
      paymentText = paymentMethod === "online" 
        ? "📱 إنستا باي / فودافون كاش" 
        : "💵 كاش عند الاستلام";
    } else {
      paymentText = paymentMethod === "online" ? "📱 InstaPay / Vodafone Cash" : "💵 Cash on Delivery";
    }

    // بناء نص الرسالة بذكاء حسب اللغة وشامل البيانات الجديدة
    let message = lang === "ar" 
      ? `*طلب جديد من Ayla Experience* 🌟\n\n`
      : `*New Order from Ayla Experience* 🌟\n\n`;

    // سيكشن بيانات العميل
    message += lang === "ar"
      ? `*👤 بيانات العميل:*\n• الاسم: ${customerName}\n• العنوان: ${customerAddress}\n• رقم الهاتف 1: ${phone1}\n${phone2 ? `• رقم الهاتف 2: ${phone2}\n` : ""}\n`
      : `*👤 Customer Info:*\n• Name: ${customerName}\n• Address: ${customerAddress}\n• Phone 1: ${phone1}\n${phone2 ? `• Phone 2: ${phone2}\n` : ""}\n`;

    // سيكشن الأطباق
    message += lang === "ar" ? `*🛒 الطلبات:*\n` : `*🛒 Items:*\n`;
    cartItems.forEach((item) => {
      message += `• ${item.name[lang]} (x${item.quantity}) -> ${item.price * item.quantity} ${lang === "ar" ? "ج.م" : "EGP"}\n`;
    });

    message += `\n*${lang === "ar" ? "إجمالي الحساب" : "Total Price"}:* ${cartTotal} ${lang === "ar" ? "ج.م" : "EGP"}\n`;
    message += `*${lang === "ar" ? "طريقة الدفع" : "Payment Method"}:* ${paymentText}\n`;
    message += `--------------------------------`;

    // عمل encode للنص
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${menuData.whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" onClick={onClose} />

      <div className={`fixed top-0 bottom-0 w-full max-w-md bg-[#0d0d0d] border-stone-800 p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 overflow-y-auto ${
        lang === "ar" ? "left-0 border-r" : "right-0 border-l"
      }`}>
        
        {/* الـ Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.05]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-amber-500 stroke-[1.5]" />
            <h2 className="text-lg font-light text-stone-100">{lang === "ar" ? "سلة المأكولات" : "Your Order"}</h2>
          </div>
          <button onClick={onClose} className="p-1 text-stone-400 hover:text-white transition-colors">
            <X className="h-5 w-5 stroke-[1.5]" />
          </button>
        </div>

        {/* جسم السلة (قائمة المنتجات) */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 scrollbar-none max-h-[35vh]">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500">
              <ShoppingBag className="h-12 w-12 stroke-[1] mb-3 opacity-30" />
              <p className="text-sm font-light">
                {lang === "ar" ? "سلتك فارغة حالياً.. ألقِ نظرة على القائمة" : "Your cart is empty.. explore the menu"}
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.01] border border-white/[0.03]">
                <div className="flex-1 min-w-0 pr-2">
                  <h4 className="text-sm font-light text-stone-200 truncate">{item.name[lang]}</h4>
                  <p className="text-xs text-amber-500/80 font-inter mt-1">{item.price * item.quantity} {lang === "ar" ? "ج.م" : "EGP"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-stone-900 border border-white/[0.05] rounded-lg overflow-hidden">
                    <button onClick={() => removeFromCart(item.id)} className="p-1.5 text-stone-400 hover:text-white"><Minus className="h-3.5 w-3.5" /></button>
                    <span className="px-2 text-xs font-inter font-medium text-stone-200">{item.quantity}</span>
                    <button onClick={() => addToCart(item)} className="p-1.5 text-stone-400 hover:text-white"><Plus className="h-3.5 w-3.5" /></button>
                  </div>
                  <button onClick={() => clearItem(item.id)} className="p-2 text-stone-600 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* الفاتورة، الفورم وزر الدفع */}
        {cartItems.length > 0 && (
          <div className="pt-4 border-t border-white/[0.05] space-y-5">
            
            {/* سيكشن فورم بيانات العميل المطور */}
            <div className="space-y-3 bg-white/[0.01] border border-white/[0.02] p-3 rounded-xl">
              <label className="text-xs font-light text-stone-400 tracking-wider block">
                {lang === "ar" ? "بيانات التوصيل" : "DELIVERY DETAILS"}
              </label>
              
              {/* حقل الاسم */}
              <div className="relative">
                <User className="absolute right-3 top-3 h-4 w-4 text-stone-500 stroke-[1.5]" />
                <input 
                  type="text" 
                  placeholder={lang === "ar" ? "الاسم بالكامل *" : "Full Name *"}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-stone-900/50 border border-white/[0.04] rounded-lg py-2 pr-10 pl-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>

              {/* حقل العنوان */}
              <div className="relative">
                <MapPin className="absolute right-3 top-3 h-4 w-4 text-stone-500 stroke-[1.5]" />
                <input 
                  type="text" 
                  placeholder={lang === "ar" ? "العنوان بالتفصيل *" : "Detailed Address *"}
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full bg-stone-900/50 border border-white/[0.04] rounded-lg py-2 pr-10 pl-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>

              {/* حقول أرقام التليفونات */}
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <Phone className="absolute right-3 top-3 h-4 w-4 text-stone-500 stroke-[1.5]" />
                  <input 
                    type="tel" 
                    placeholder={lang === "ar" ? "رقم هاتف 1 *" : "Phone 1 *"}
                    value={phone1}
                    onChange={(e) => setPhone1(e.target.value)}
                    className="w-full bg-stone-900/50 border border-white/[0.04] rounded-lg py-2 pr-10 pl-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute right-3 top-3 h-4 w-4 text-stone-500 stroke-[1.5]" />
                  <input 
                    type="tel" 
                    placeholder={lang === "ar" ? "رقم هاتف 2 (اختياري)" : "Phone 2 (Optional)"}
                    value={phone2}
                    onChange={(e) => setPhone2(e.target.value)}
                    className="w-full bg-stone-900/50 border border-white/[0.04] rounded-lg py-2 pr-10 pl-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* سيكشن اختيار طريقة الدفع */}
            <div className="space-y-2">
              <label className="text-xs font-light text-stone-400 tracking-wider block">{lang === "ar" ? "طريقة الدفع" : "PAYMENT METHOD"}</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => updatePaymentMethod("cash")}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs transition-all duration-300 ${
                    paymentMethod === "cash" ? "border-amber-500 bg-amber-500/[0.06] text-amber-500" : "border-white/[0.03] text-stone-400"
                  }`}
                >
                  <Banknote className="h-4 w-4" />
                  <span>{lang === "ar" ? "كاش عند الاستلام" : "Cash on Delivery"}</span>
                </button>
                <button
                  onClick={() => updatePaymentMethod("online")}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs transition-all duration-300 ${
                    paymentMethod === "online" ? "border-amber-500 bg-amber-500/[0.06] text-amber-500" : "border-white/[0.03] text-stone-400"
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  <span>{lang === "ar" ? "إنستا باي / كاش" : "InstaPay / Cash"}</span>
                </button>
              </div>
            </div>

            {/* المجموع الإجمالي */}
            <div className="flex items-center justify-between text-sm pt-1">
              <span className="text-stone-400 font-light">{lang === "ar" ? "المجموع الإجمالي:" : "Subtotal:"}</span>
              <span className="text-base font-inter font-semibold text-amber-500">{cartTotal} {lang === "ar" ? "ج.م" : "EGP"}</span>
            </div>

            {/* زر إرسال الأوردر */}
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