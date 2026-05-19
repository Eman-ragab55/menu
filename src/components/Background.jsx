"use client";

import React from "react";

export default function Background() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-[#070707]">
      {/* لمسة إضاءة سينمائية خلف الكروت */}
      <div className="absolute top-[30%] left-[50%] -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-amber-500/[0.02] blur-[150px]" />
      
      {/* الـ Texture الحجري الداكن يعطي عمق ملوكي للموقع */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-screen pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&q=80&w=1000')`,
          backgroundSize: 'cover'
        }}
      />
    </div>
  );
}