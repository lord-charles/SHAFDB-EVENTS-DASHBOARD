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

  // Dynamic QR Code API (high speed, secure)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
    delegate._id
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
        {/* Left: Beautiful CSS Stylized 45 AGM Brand Graphic */}
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="relative w-16 h-16 flex items-center justify-center">
            {/* Geometric representation of 45 mark */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-14 h-14">
                {/* 4 */}
                <path d="M15 15 V50 H45 V65 H55 V50 H65 V40 H55 V15 H45 V40 H27 V15 H15 Z" fill="#B71C1C" />
                {/* 5 */}
                <path d="M48 20 H75 V30 H58 V42 C60 40 68 40 72 44 C76 48 76 56 72 60 C68 64 58 64 54 60 C51 57 51 53 51 53 H41 C41 55 42 62 48 68 C54 74 68 74 76 68 C84 62 84 48 76 40 C72 36 64 36 60 38 V30 H48 V20 Z" fill="#B71C1C" />
                {/* Waving Green Ribbon */}
                <path d="M72 32 C82 45 88 65 88 88 C88 105 78 120 68 120 V105 C72 105 78 95 78 88 C78 72 70 54 62 44 Z" fill="#1B5E20" />
              </svg>
            </div>
          </div>
          {/* Hexagonal Rosettes */}
          <div className="flex gap-0.5 mt-1">
            {[1, 2, 3].map((i) => (
              <svg key={i} viewBox="0 0 100 100" className="w-3.5 h-3.5 fill-[#1B5E20]">
                <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" />
                <circle cx="50" cy="50" r="22" fill="#fff" />
              </svg>
            ))}
          </div>
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
