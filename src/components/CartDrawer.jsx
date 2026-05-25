"use client";

import React, { useState } from "react";
import { useCart } from "@/src/context/CartContext";
import { useLang } from "@/src/context/LangContext";
import { menuData } from "@/src/data/menuData";
import { X, Plus, Minus, Trash2, ShoppingBag, CreditCard, Banknote, User, MapPin, Phone, Upload, ImageIcon } from "lucide-react";

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

  // الـ States الخاصة ببيانات العميل
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  
  // الـ States الجديدة الخاصة برفع إسكرين التحويل
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // دالة التعامل مع اختيار الصورة وعمل المعاينة (Preview)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setScreenshotFile(file);
      // عمل رابط مؤقت لعرض الصورة جوه المتصفح للعميل
      setScreenshotPreview(URL.createObjectURL(file));
    }
  };

  if (!isOpen) return null;

  // فُانكشن إرسال الطلب (هنا هنربط الـ Database مستقبلاً)
  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    if (!customerName || !customerAddress || !phone1) {
      alert(lang === "ar" ? "برجاء ملء الاسم، العنوان، ورقم الهاتف الأساسي!" : "Please fill in Name, Address, and Primary Phone!");
      return;
    }

    // إذا اختار إنستا باي ولم يرفع الإسكرين، نبهه (ممكن تخليها إجباري أو اختياري)
    if (paymentMethod === "online" && !screenshotFile) {
      alert(lang === "ar" ? "برجاء رفع إسكرين تحويل إنستا باي لتأكيد الطلب!" : "Please upload the InstaPay transfer screenshot!");
      return;
    }

    try {
      setIsUploading(true);

      // 1️⃣ [هنا في الخطوة الجاية]: كود رفع الصورة للـ Storage وكتابة الأوردر في الـ Database
      let finalScreenshotUrl = "https://placeholder-link.com/image.jpg"; // لينك تجريبي مؤقتاً
      
      console.log("Saving Order to Database...", {
        customerName,
        customerAddress,
        phone1,
        phone2,
        cartItems,
        cartTotal,
        paymentMethod,
        screenshotUrl: finalScreenshotUrl
      });

      // 2️⃣ بناء نص رسالة الواتساب التقليدية للمتابعة
      let paymentText = lang === "ar"
        ? (paymentMethod === "online" ? "📱 إنستا باي (تم رفع الإسكرين للسيستم)" : "💵 كاش عند الاستلام")
        : (paymentMethod === "online" ? "📱 InstaPay (Screenshot Uploaded)" : "💵 Cash on Delivery");

      let message = lang === "ar" 
        ? `*طلب جديد من Ayla Experience* 🌟\n\n`
        : `*New Order from Ayla Experience* 🌟\n\n`;

      message += lang === "ar"
        ? `*👤 بيانات العميل:*\n• الاسم: ${customerName}\n• التليفون: ${phone1}\n• طريقة الدفع: ${paymentText}\n\n*🛒 جاري مراجعة الطلب والإسكرين من لوحة التحكم الخاصة بالمطعم.*`
        : `*👤 Customer Info:*\n• Name: ${customerName}\n• Phone: ${phone1}\n• Payment: ${paymentText}\n\n*🛒 Order & Screenshot are being reviewed from the Restaurant Dashboard.*`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${menuData.whatsappNumber}?text=${encodedMessage}`;

      setIsUploading(false);
      window.open(whatsappUrl, "_blank");

    } catch (error) {
      console.error("Error creating order:", error);
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
          <button onClick={onClose} className="p-1 text-stone-400 hover:text-white"><X className="h-5 w-5" /></button>
        </div>

        {/* قائمة المنتجات */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 scrollbar-none max-h-[25vh]">
          {cartItems.map((item) => (
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
          ))}
        </div>

        {/* الفاتورة والفورم */}
        {cartItems.length > 0 && (
          <div className="pt-4 border-t border-white/[0.05] space-y-4">
            
            {/* بيانات التوصيل */}
            <div className="space-y-2.5 bg-white/[0.01] border border-white/[0.02] p-3 rounded-xl">
              <label className="text-xs font-light text-stone-400 tracking-wider block">{lang === "ar" ? "بيانات التوصيل" : "DELIVERY DETAILS"}</label>
              <input type="text" placeholder={lang === "ar" ? "الاسم بالكامل *" : "Full Name *"} value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full bg-stone-900/50 border border-white/[0.04] rounded-lg py-2 px-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50" />
              <input type="text" placeholder={lang === "ar" ? "العنوان بالتفصيل *" : "Detailed Address *"} value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} className="w-full bg-stone-900/50 border border-white/[0.04] rounded-lg py-2 px-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50" />
              <div className="grid grid-cols-2 gap-2">
                <input type="tel" placeholder={lang === "ar" ? "رقم هاتف 1 *" : "Phone 1 *"} value={phone1} onChange={(e) => setPhone1(e.target.value)} className="w-full bg-stone-900/50 border border-white/[0.04] rounded-lg py-2 px-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50" />
                <input type="tel" placeholder={lang === "ar" ? "رقم هاتف 2 (اختياري)" : "Phone 2 (Optional)"} value={phone2} onChange={(e) => setPhone2(e.target.value)} className="w-full bg-stone-900/50 border border-white/[0.04] rounded-lg py-2 px-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50" />
              </div>
            </div>

            {/* طريقة الدفع */}
            <div className="space-y-2">
              <label className="text-xs font-light text-stone-400 tracking-wider block">{lang === "ar" ? "طريقة الدفع" : "PAYMENT METHOD"}</label>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => updatePaymentMethod("cash")} className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs transition-all ${paymentMethod === "cash" ? "border-amber-500 bg-amber-500/[0.06] text-amber-500" : "border-white/[0.03] text-stone-400"}`}><Banknote className="h-4 w-4" /><span>{lang === "ar" ? "كاش عند الاستلام" : "Cash on Delivery"}</span></button>
                <button onClick={() => updatePaymentMethod("online")} className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs transition-all ${paymentMethod === "online" ? "border-amber-500 bg-amber-500/[0.06] text-amber-500" : "border-white/[0.03] text-stone-400"}`}><CreditCard className="h-4 w-4" /><span>{lang === "ar" ? "إنستا باي" : "InstaPay"}</span></button>
              </div>
            </div>

            {/* سيكشن رفع الصورة المطور (يظهر فقط مع إنستا باي) */}
            {paymentMethod === "online" && (
              <div className="p-3 rounded-xl bg-amber-500/[0.02] border border-amber-500/10 space-y-3">
                <p className="text-[11px] font-light text-stone-400 text-center">
                  {lang === "ar" ? "حول للحساب: 01273216946 ثم ارفع الإسكرين هنا 👇" : "Transfer to: 01273216946 then upload screenshot 👇"}
                </p>

                {/* حقل الرفع المخفي الشيك */}
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
                      <span className="text-[11px]">{lang === "ar" ? "اختر صورة الإسكرين" : "Upload Screenshot"}</span>
                    </div>
                  )}
                </label>
              </div>
            )}

            {/* الإجمالي وزر الإرسال */}
            <div className="flex items-center justify-between text-sm pt-1">
              <span className="text-stone-400 font-light">{lang === "ar" ? "المجموع الإجمالي:" : "Subtotal:"}</span>
              <span className="text-base font-inter font-semibold text-amber-500">{cartTotal} {lang === "ar" ? "ج.م" : "EGP"}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isUploading}
              className="w-full rounded-xl bg-amber-500 py-3.5 text-xs font-normal tracking-widest text-black uppercase transition-all duration-300 hover:bg-white disabled:bg-stone-700 disabled:text-stone-400"
            >
              {isUploading ? (lang === "ar" ? "جاري تسجيل الطلب..." : "Saving Order...") : (lang === "ar" ? "تأكيد وإرسال الطلب" : "Confirm & Send Order")}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}