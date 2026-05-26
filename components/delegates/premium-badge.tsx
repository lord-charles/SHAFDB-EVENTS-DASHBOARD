"use client";

import React from "react";
import type { Delegate } from "@/types/delegate";

interface PremiumBadgeProps {
  delegate: Delegate;
  language: "en" | "fr" | "bilingual";
  categoryOverride?: string;
  id?: string;
}

export function PremiumBadge({
  delegate,
  language = "bilingual",
  categoryOverride,
  id,
}: PremiumBadgeProps) {
  // Determine Category Text & Color
  const rawType = (delegate.delegateType || "delegate").toLowerCase();
  
  // Custom Category Text
  let categoryText = "DELEGATE";
  let bannerBg = "bg-emerald-800"; // Default Emerald

  if (categoryOverride) {
    categoryText = categoryOverride;
    // Map colors based on override text
    const lowerOverride = categoryOverride.toLowerCase();
    if (lowerOverride.includes("vip") || lowerOverride.includes("vvip")) {
      bannerBg = "bg-[#B71C1C]"; // Rich VIP Red
    } else if (lowerOverride.includes("staff") || lowerOverride.includes("admin") || lowerOverride.includes("employee")) {
      bannerBg = "bg-[#1B5E20]"; // Forest Staff Green
    } else if (lowerOverride.includes("government") || lowerOverride.includes("host") || lowerOverride.includes("minister")) {
      bannerBg = "bg-[#1A237E]"; // Royal Indigo
    } else if (lowerOverride.includes("private") || lowerOverride.includes("partner") || lowerOverride.includes("sponsor")) {
      bannerBg = "bg-[#E65100]"; // Amber Gold
    } else if (lowerOverride.includes("guest") || lowerOverride.includes("speaker")) {
      bannerBg = "bg-[#4A148C]"; // Purple
    } else if (lowerOverride.includes("ngo") || lowerOverride.includes("observer")) {
      bannerBg = "bg-[#37474F]"; // Charcoal Slate
    }
  } else {
    // Automatic Mapping
    if (rawType === "government") {
      categoryText = "VIP";
      bannerBg = "bg-[#B71C1C]"; // Red
    } else if (rawType === "staff" || rawType === "employee") {
      categoryText = "STAFF";
      bannerBg = "bg-[#1B5E20]"; // Green
    } else if (rawType === "ngo") {
      categoryText = "OBSERVER";
      bannerBg = "bg-[#37474F]"; // Charcoal
    } else if (rawType === "private") {
      categoryText = "PARTNER";
      bannerBg = "bg-[#E65100]"; // Amber
    } else {
      categoryText = "DELEGATE";
      bannerBg = "bg-emerald-800"; // Emerald
    }
  }

  // Format Letter-Spaced Category
  const spacedCategory = categoryText.split("").join(" ");

  // Dynamic QR Code API encoding structured delegate JSON properties
  const qrDataObj = {
    delegateId: delegate._id,
    name: `${delegate.firstName} ${delegate.lastName}`,
    eventYear: delegate.eventYear || 2026,
  };
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
    JSON.stringify(qrDataObj)
  )}`;

  return (
    <div
      id={id}
      className="relative select-none flex flex-col justify-between overflow-hidden shadow-2xl border bg-white"
      style={{
        width: "380px",
        height: "585px",
        minWidth: "380px",
        minHeight: "585px",
        backgroundImage: "url('/badge-background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "16px",
        fontFamily: "'Outfit', 'Inter', sans-serif",
      }}
    >
      {/* 1. Header Section */}
      <div className="flex items-center justify-between px-6 pt-4 pb-2">
        <img
          src="/shelter-afrique-logo.png"
          alt="Shelter Afrique"
          className="h-9 object-contain"
        />
        <img
          src="/morocco-coat-of-arms.png"
          alt="Royaume du Maroc"
          className="h-11 object-contain"
        />
      </div>

      {/* 2. Middle Event Details Section */}
      <div className="flex items-start px-6 gap-3 pt-1">
        {/* Left: 45th AGM Brand Graphic Logo */}
        <div className="flex-shrink-0 flex items-center justify-center pl-2">
          <img
            src="/agm-45-logo.png"
            alt="45th AGM Logo"
            className="w-[70px] h-[90px] object-contain"
          />
        </div>

        {/* Right: Bilingual Title Text */}
        <div className="flex-1 flex flex-col justify-center min-w-0 pr-1">
          {/* French Column */}
          {(language === "fr" || language === "bilingual") && (
            <div className="space-y-0.5">
              <div className="text-[10px] leading-tight font-extrabold text-slate-900 truncate uppercase">
                Banque de Développement
              </div>
              <div className="text-[9px] leading-tight font-medium text-slate-600 truncate">
                Shelter Afrique (ShafDB)
              </div>
              <div className="text-[10px] leading-tight font-extrabold text-[#1B5E20]">
                La 45ème Assemblée Générale
              </div>
            </div>
          )}

          {/* Separator */}
          {language === "bilingual" && (
            <div className="my-1 border-t border-gray-300 w-full" />
          )}

          {/* English Column */}
          {(language === "en" || language === "bilingual") && (
            <div className="space-y-0.5">
              <div className="text-[10px] leading-tight font-extrabold text-slate-900 truncate uppercase">
                Shelter Afrique Dev Bank (ShafDB)
              </div>
              <div className="text-[10px] leading-tight font-extrabold text-[#1B5E20]">
                The 45th Annual General Meeting
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Profile Info Section */}
      <div className="flex items-center px-6 gap-4 pt-1 pb-1">
        {/* Avatar Ring */}
        <div className="relative flex-shrink-0 w-24 h-24 rounded-full border-4 border-[#0D47A1] bg-white overflow-hidden shadow-lg">
          <img
            src={delegate.profilePicture || "/placeholder.jpg"}
            alt={delegate.fullName}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
            }}
          />
        </div>

        {/* Text Credentials */}
        <div className="flex-1 min-w-0 space-y-1 pr-1">
          <h3 className="text-xl font-extrabold leading-tight text-[#0D47A1] uppercase tracking-wide truncate">
            {delegate.firstName} {delegate.lastName}
          </h3>
          <div className="text-sm font-bold text-slate-800 leading-tight truncate">
            {delegate.organization || "Independent"}
          </div>
          <div className="text-xs font-semibold text-slate-600 leading-tight truncate">
            {delegate.position || "Delegate"}
          </div>
        </div>
      </div>

      {/* 4. Category High-Contrast Banner */}
      <div className={`w-full py-2 text-center ${bannerBg} shadow-inner transition-colors duration-300`}>
        <span className="text-white text-base font-black tracking-[0.25em] uppercase drop-shadow-sm select-none">
          {spacedCategory}
        </span>
      </div>

      {/* 5. Bottom QR & Web Link Section */}
      <div className="flex flex-col items-center pb-4 pt-2">
        <div className="bg-white p-1.5 rounded-xl shadow-md border border-slate-200/60 flex items-center justify-center">
          <img
            src={qrCodeUrl}
            alt="Access Key"
            className="w-20 h-20"
            style={{ imageRendering: "pixelated" }}
          />
        </div>
        <span className="text-[11px] font-black text-[#0D47A1] tracking-wider mt-2 hover:underline">
          agm.shelterafrique.org
        </span>
      </div>
    </div>
  );
}
