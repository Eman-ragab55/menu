"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/src/context/CartContext";
import { useLang } from "@/src/context/LangContext";
import { menuData } from "@/src/data/menuData";
import { X, Plus, Minus, Trash2, ShoppingBag, CreditCard, Banknote, Upload, ImageIcon, Copy, Check } from "lucide-react";

// 🛠️ حقن الـ Supabase Client مباشرة داخل الملف لإنهاء مشكلة الـ Placeholder نهائياً
import { createClient } from '@supabase/supabase-js';

// 🛠️ تنظيف وحقن المفاتيح مباشرة لضمان عدم حدوث إيرور الـ Headers وتوافقها مع الـ Self-Hosted JWS
const supabaseUrl = "https://ppzdnchvguyxqipxbkbk.supabase.co".trim();
const supabaseAnonKey = "sb_publishable_2dqy00XlWZlWx4LeyAB_zQ_RDBxT8ay".trim();

// ✅ إجبار الـ SDK على تمرير المفاتيح كـ Global Headers لتفادي إيرور Invalid Compact JWS في الـ Storage
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  },
  global: {
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`
    }
  }
});

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

  // State محلية للتحكم الفوري في إظهار فورم الدفع لتفادي مشاكل الـ Context
  const [localPayment, setLocalPayment] = useState("cash");

  // مزامنة الحالة أول ما الـ Drawer يفتح
  useEffect(() => {
    if (paymentMethod) {
      if (paymentMethod === "online" || paymentMethod === "InstaPay / Cash") {
        setLocalPayment("online");
      } else {
        setLocalPayment("cash");
      }
    }
  }, [paymentMethod]);

  // states لبيانات العميل
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  
  // states لرفع الإسكرين والمعاينة
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  // 💡 رقم إنستا باي الخاص بكِ
  const myInstaPayNumber = "01200417433";

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setScreenshotFile(file);
      setScreenshotPreview(URL.createObjectURL(file));
    }
  };

  const handleOpenInstaPay = () => {
    navigator.clipboard.writeText(myInstaPayNumber);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
    window.location.href = "instapay://";
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    if (!customerName || !customerAddress || !phone1) {
      alert(lang === "ar" ? "برجاء ملء الاسم، العنوان، ورقم الهاتف الأساسي!" : "Please fill in Name, Address, and Primary Phone!");
      return;
    }
// 🔒 شرط الأمان الصارم المحدث
    const isOnline = localPayment === "online";
    if (isOnline && !screenshotFile) {
      alert(lang === "ar" ? "عذراً، يجب رفع إسكرين شوت للتحويل أولاً لتأكيد طلبك وإرساله عبر الواتساب!" : "Sorry, you must upload a transfer screenshot first to confirm your order and send it to WhatsApp!");
      return;
    }

    try {
      setIsUploading(true);
      let screenshotUrl = null;

      if (isOnline && screenshotFile) {
        // 🚀 الضربة القاضية: تمرير الـ apikey داخل الـ Authorization لتخطي فحص الـ JWS وإرضاء الـ Gateway
        const fileExt = screenshotFile.name.split('.').pop().toLowerCase();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const uploadUrl = `${supabaseUrl}/storage/v1/object/screenshots/${fileName}`;

        const response = await fetch(uploadUrl, {
          method: 'POST',
          headers: {
            'apikey': supabaseAnonKey,
            'Authorization': supabaseAnonKey, // 💡 مررنا المفتاح مباشرة بدون كلمة Bearer عشان نمنع الفحص للـ JWS
            'Content-Type': fileExt === 'jpg' || fileExt === 'jpeg' ? 'image/jpeg' : 'image/png'
          },
          body: screenshotFile
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Storage Upload Failed: ${errorText}`);
        }

        // بناء الرابط العام الفعلي للسيرفر الخاص بكِ (مكتوب مرة واحدة وبشكل صحيح هنا)
        screenshotUrl = `${supabaseUrl}/storage/v1/object/public/screenshots/${fileName}`;
      }

      // إدخال البيانات في الداتابيز في جدول screenshots
      const { error: orderError } = await supabase
        .from('screenshots')
        .insert([
          {
            customer_name: customerName,
            customer_address: customerAddress,
            phone1: phone1,
            phone2: phone2 || null,
            payment_method: isOnline ? "online" : "cash",
            cart_items: cartItems, 
            cart_total: cartTotal,
            screenshot_url: screenshotUrl
          }
        ]);

      if (orderError) throw orderError;

      let paymentText = lang === "ar"
        ? (isOnline ? "📱 إنستا باي (تم حفظ الإسكرين بالسيستم)" : "💵 كاش عند الاستلام")
        : (isOnline ? "📱 InstaPay (Screenshot Saved)" : "💵 Cash on Delivery");

      let message = lang === "ar" 
        ? `*طلب جديد من Ayla Experience* 🌟\n\n*👤 بيانات العميل:*\n• الاسم: ${customerName}\n• التليفون: ${phone1}\n• طريقة الدفع: ${paymentText}\n\n*🛒 تم تسجيل الأوردر بنجاح في نظام المطعم وجاري مراجعته!*`
        : `*New Order from Ayla Experience* 🌟\n\n*👤 Customer Info:*\n• Name: ${customerName}\n• Phone: ${phone1}\n• Payment: ${paymentText}\n\n*🛒 Order saved successfully and is being reviewed!*`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${menuData.whatsappNumber}?text=${encodedMessage}`;

      setIsUploading(false);
      window.open(whatsappUrl, "_blank");

    } catch (error) {
      console.error("Error creating order:", error);
      alert(lang === "ar" ? "حدث خطأ أثناء حفظ الطلب، حاول مرة أخرى." : "Error creating order, please try again.");
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className={`fixed top-0 bottom-0 w-full max-w-md bg-[#0d0d0d] border-stone-800 p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 overflow-y-auto ${
        lang === "ar" ? "left-0 border-r" : "right-0 border-l"
      }`}>
        
        {/* الـ Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.05]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-amber-500 stroke-[1.5]" />
            <h2 className="text-lg font-light text-stone-100">{lang === "ar" ? "سلة المأكولات" : "Your Order"}</h2>
          </div>
          <button onClick={onClose} className="p-1 text-stone-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* قائمة المنتجات في السلة */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 scrollbar-none max-h-[25vh]">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.01] border border-white/[0.03]">
              <div className="flex-1 min-w-0 pr-2">
                <h4 className="text-sm font-light text-stone-200 truncate">{item.name[lang] || item.name}</h4>
                <p className="text-xs text-amber-500/80 font-inter mt-1 font-medium">
                  {item.price * item.quantity} {lang === "ar" ? "ج.م" : "EGP"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-stone-900 border border-white/[0.05] rounded-lg overflow-hidden">
                  <button onClick={() => removeFromCart(item.id)} className="p-1.5 text-stone-400 hover:text-white">
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="px-2 text-xs font-inter font-medium text-stone-200">{item.quantity}</span>
                  <button onClick={() => addToCart(item)} className="p-1.5 text-stone-400 hover:text-white">
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <button onClick={() => clearItem(item.id)} className="p-2 text-stone-600 hover:text-red-400">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* سيكشن الدفع والبيانات */}
        {cartItems.length > 0 && (
          <div className="pt-4 border-t border-white/[0.05] space-y-4">
            
            {/* بيانات التوصيل */}
            <div className="space-y-2.5 bg-white/[0.01] border border-white/[0.02] p-3 rounded-xl">
              <label className="text-xs font-light text-stone-400 tracking-wider block">
                {lang === "ar" ? "بيانات التوصيل" : "DELIVERY DETAILS"}
              </label>
              <input 
                type="text" 
                placeholder={lang === "ar" ? "الاسم بالكامل *" : "Full Name *"} 
                value={customerName} 
                onChange={(e) => setCustomerName(e.target.value)} 
                className="w-full bg-stone-900/50 border border-white/[0.04] rounded-lg py-2 px-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50" 
              />
              <input 
                type="text" 
                placeholder={lang === "ar" ? "العنوان بالتفصيل *" : "Detailed Address *"} 
                value={customerAddress} 
                onChange={(e) => setCustomerAddress(e.target.value)} 
                className="w-full bg-stone-900/50 border border-white/[0.04] rounded-lg py-2 px-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50" 
              />
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="tel" 
                  placeholder={lang === "ar" ? "رقم هاتف 1 *" : "Phone 1 *"} 
                  value={phone1} 
                  onChange={(e) => setPhone1(e.target.value)} 
                  className="w-full bg-stone-900/50 border border-white/[0.04] rounded-lg py-2 px-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50" 
                />
                <input 
                  type="tel" 
                  placeholder={lang === "ar" ? "رقم هاتف 2 (اختياري)" : "Phone 2 (Optional)"} 
                  value={phone2} 
                  onChange={(e) => setPhone2(e.target.value)} 
                  className="w-full bg-stone-900/50 border border-white/[0.04] rounded-lg py-2 px-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50" 
                />
              </div>
            </div>

            {/* طريقة الدفع */}
            <div className="space-y-2">
              <label className="text-xs font-light text-stone-400 tracking-wider block">
                {lang === "ar" ? "طريقة الدفع" : "PAYMENT METHOD"}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button"
                  onClick={() => {
                    setLocalPayment("cash");
                    if(typeof updatePaymentMethod === 'function') updatePaymentMethod("cash");
                  }} 
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs transition-all duration-300 ${
                    localPayment === "cash" ? "border-amber-500 bg-amber-500/[0.06] text-amber-500" : "border-white/[0.03] text-stone-400"
                  }`}
                >
                  <Banknote className="h-4 w-4" />
                  <span>{lang === "ar" ? "كاش عند الاستلام" : "Cash on Delivery"}</span>
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setLocalPayment("online");
                    if(typeof updatePaymentMethod === 'function') updatePaymentMethod("online");
                  }} 
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs transition-all duration-300 ${
                    localPayment === "online" ? "border-amber-500 bg-amber-500/[0.06] text-amber-500" : "border-white/[0.03] text-stone-400"
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  <span>{lang === "ar" ? "إنستا باي" : "InstaPay / Cash"}</span>
                </button>
              </div>
            </div>

            {/* سيكشن إنستا باي والرفع */}
            {localPayment === "online" && (
              <div className="p-3 rounded-xl bg-amber-500/[0.02] border border-amber-500/10 space-y-3">
                <button
                  type="button"
                  onClick={handleOpenInstaPay}
                  className="w-full flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 border border-white/[0.05] text-[11px] text-stone-200 py-2.5 rounded-lg font-light transition-colors"
                >
                  {isCopied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5 text-amber-500" />}
                  <span>
                    {isCopied 
                      ? (lang === "ar" ? "تم نسخ الرقم بنجاح! ✅" : "Number Copied Successfully! ✅") 
                      : (lang === "ar" ? "اضغط لنسخ الرقم وفتح تطبيق InstaPay 🚀" : "Click to copy number & open InstaPay 🚀")}
                  </span>
                </button>

                <div className="text-center bg-stone-900/40 p-2 rounded-lg border border-white/[0.02]">
                  <p className="text-[11px] text-amber-500/90 font-mono font-medium tracking-wider select-all">
                    {myInstaPayNumber}
                  </p>
                </div>

                <p className="text-[10px] font-light text-stone-500 text-center">
                  {lang === "ar" ? "بعد إتمام التحويل، يجب رفع لقطة الشاشة هنا لتفعيل زر الإرسال 👇" : "After transfer, you must upload the screenshot here to enable sending 👇"}
                </p>

                <label className="flex flex-col items-center justify-center border border-dashed border-white/[0.08] hover:border-amber-500/40 rounded-xl p-4 cursor-pointer transition-colors bg-stone-900/40">
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  {screenshotPreview ? (
                    <div className="relative w-full h-24 rounded-lg overflow-hidden border border-white/[0.05]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={screenshotPreview} alt="Preview" className="w-full h-full object-contain" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Upload className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 text-stone-500">
                      <ImageIcon className="h-5 w-5 stroke-[1.5]" />
                      <span className="text-[11px]">{lang === "ar" ? "اضغط هنا لرفع الصورة *" : "Click here to upload image *"}</span>
                    </div>
                  )}
                </label>
              </div>
            )}

            {/* المجموع الكلي */}
            <div className="flex items-center justify-between text-sm pt-1">
              <span className="text-stone-400 font-light">{lang === "ar" ? "المجموع الإجمالي:" : "Subtotal:"}</span>
              <span className="text-base font-inter font-semibold text-amber-500">{cartTotal} {lang === "ar" ? "ج.م" : "EGP"}</span>
            </div>

            {/* زرار الإرسال المعزز */}
            <button
              onClick={handleCheckout}
              disabled={isUploading}
              className="w-full rounded-xl bg-amber-500 py-3.5 text-xs font-normal tracking-widest text-black uppercase transition-all duration-300 hover:bg-white disabled:bg-stone-700 disabled:text-stone-400"
            >
              {isUploading ? (lang === "ar" ? "جاري تسجيل طلبك ورفع الإسكرين..." : "Saving Order...") : (lang === "ar" ? "تأكيد وإرسال الطلب" : "Confirm & Send Order")}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}