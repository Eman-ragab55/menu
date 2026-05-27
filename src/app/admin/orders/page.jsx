"use client";
export const dynamic = "force-dynamic";
import React, { useEffect, useState } from "react";
import { supabase } from "@/src/utils/supabaseClient"; // اتأكدي من صحة المسار حسب فولدراتك
import { ShoppingBag, User, MapPin, Phone, CreditCard, Banknote, Calendar, Eye, X, RefreshCw } from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScreenshot, setSelectedScreenshot] = useState(null); // للتحكم في بوب-أب الصورة

  // دالة جلب الأوردرات من السوبابيز مرتبة من الأحدث للأقدم
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("حدث خطأ أثناء تحميل الأوردرات!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // دالة لتنسيق التاريخ بشكل شيك
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('ar-EG', options);
  };

  return (
    <div className="min-h-screen bg-[#070707] text-stone-200 p-4 md:p-8 dir-rtl" style={{ direction: 'rtl' }}>
      
      {/* الـ Header الخاص بالـ Dashboard */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between border-b border-white/[0.05] pb-6 mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/[0.06] border border-amber-500/20 rounded-xl">
            <ShoppingBag className="h-6 w-6 text-amber-500 stroke-[1.5]" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-light tracking-wide text-stone-100">لوحة تحكم الأوردرات</h1>
            <p className="text-xs text-stone-500 mt-1">متابعة طلبات العلاء وإسكرينات إنستا باي لحظة بلحظة</p>
          </div>
        </div>
        
        {/* زرار التحديث اليدوي السريع */}
        <button 
          onClick={fetchOrders} 
          disabled={loading}
          className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 border border-white/[0.05] px-4 py-2 rounded-xl text-xs font-light transition-all text-stone-300"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          تحديث البيانات
        </button>
      </div>

      {/* محتوى الصفحة الرئيسي */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-stone-500 text-sm font-light">
            <RefreshCw className="h-6 w-6 animate-spin text-amber-500 mb-2" />
            جاري تحميل الأوردرات الجديدة...
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/[0.05] rounded-2xl text-stone-500 text-sm font-light">
            لا توجد أوردرات مسجلة في السيستم حتى الآن.
          </div>
        ) : (
          /* جدول الأوردرات الاحترافي */
          <div className="overflow-x-auto rounded-2xl border border-white/[0.05] bg-white/[0.01] backdrop-blur-sm shadow-xl">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-white/[0.05] bg-white/[0.02] text-xs font-light text-stone-400 tracking-wider">
                  <th className="p-4">العميل والتاريخ</th>
                  <th className="p-4">العنوان والاتصال</th>
                  <th className="p-4">الطلبات</th>
                  <th className="p-4">طريقة الدفع</th>
                  <th className="p-4">الإجمالي</th>
                  <th className="p-4 text-center">إسكرين التحويل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03] text-xs font-light">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.01] transition-colors">
                    
                    {/* العميل والتاريخ */}
                    <td className="p-4 space-y-1">
                      <div className="flex items-center gap-1.5 font-medium text-stone-200">
                        <User className="h-3.5 w-3.5 text-stone-500" />
                        <span>{order.customer_name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-stone-500 text-[11px]">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDate(order.created_at)}</span>
                      </div>
                    </td>

                    {/* العنوان والاتصال */}
                    <td className="p-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-stone-300">
                        <MapPin className="h-3.5 w-3.5 text-stone-500" />
                        <span className="truncate max-w-[180px]">{order.customer_address}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-stone-400 font-inter">
                        <Phone className="h-3.5 w-3.5 text-stone-500" />
                        <span>{order.phone1} {order.phone2 ? ` / ${order.phone2}` : ""}</span>
                      </div>
                    </td>

                    {/* المنتجات المطلوبة */}
                    <td className="p-4">
                      <div className="max-h-[60px] overflow-y-auto space-y-1 text-[11px] text-stone-400 pr-1">
                        {order.cart_items?.map((item, index) => (
                          <div key={index}>
                            • {item.name?.ar || item.name} <span className="text-amber-500/80 font-inter font-medium">(x{item.quantity})</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* طريقة الدفع */}
                    <td className="p-4">
                      {order.payment_method === "online" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/[0.08] border border-amber-500/20 text-amber-500 text-[11px]">
                          <CreditCard className="h-3 w-3" /> إنستا باي
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-800 border border-white/[0.03] text-stone-400 text-[11px]">
                          <Banknote className="h-3 w-3" /> كاش
                        </span>
                      )}
                    </td>

                    {/* الإجمالي */}
                    <td className="p-4 font-inter font-semibold text-amber-500 text-sm">
                      {order.cart_total} <span className="text-xs font-light text-stone-400 font-sans">ج.م</span>
                    </td>

                    {/* زرار عرض الإسكرين السحري */}
                    <td className="p-4 text-center">
                      {order.screenshot_url ? (
                        <button
                          onClick={() => setSelectedScreenshot(order.screenshot_url)}
                          className="inline-flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-stone-300 border border-white/[0.05] px-3 py-1.5 rounded-lg text-[11px] transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5 text-amber-500" />
                          عرض الإسكرين
                        </button>
                      ) : (
                        <span className="text-stone-600 text-[11px]">—</span>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* بوب-أب (Modal) مخصص لعرض صورة إسكرين التحويل بحجمها الكامل الفخم */}
      {selectedScreenshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative max-w-md w-full bg-[#0d0d0d] border border-white/[0.08] p-4 rounded-2xl shadow-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-white/[0.05] pb-2">
              <h3 className="text-xs font-light text-stone-400">إسكرين تحويل العميل (InstaPay)</h3>
              <button 
                onClick={() => setSelectedScreenshot(null)} 
                className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-white/[0.03] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="w-full bg-stone-950 rounded-xl overflow-hidden max-h-[70vh] flex items-center justify-center border border-white/[0.02]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={selectedScreenshot} 
                alt="InstaPay Screenshot" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}