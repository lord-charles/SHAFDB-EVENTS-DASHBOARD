"use client";

import React, { useState } from "react";
import type { Delegate } from "@/types/delegate";
import { PremiumBadge } from "./premium-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Printer, Loader2, Award, Languages } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfileBadgeCardProps {
  delegate: Delegate;
}

export function ProfileBadgeCard({ delegate }: ProfileBadgeCardProps) {
  const { toast } = useToast();
  const [language, setLanguage] = useState<"en" | "fr" | "bilingual">("bilingual");
  const [category, setCategory] = useState<string>("auto");
  const [exporting, setExporting] = useState(false);

  const handleDownload = async () => {
    setExporting(true);
    try {
      const { toPng } = await import("html-to-image");
      const badgeEl = document.getElementById(`profile-badge-card-element`);
      if (badgeEl) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const dataUrl = await toPng(badgeEl, {
          quality: 1.0,
          pixelRatio: 2,
          cacheBust: true,
        });

        const link = document.createElement("a");
        link.download = `badge_${delegate.firstName}_${delegate.lastName}_${language}.png`;
        link.href = dataUrl;
        link.click();
        
        toast({
          title: "Badge Downloaded",
          description: "High-resolution badge image saved successfully.",
        });
      }
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Download Failed",
        description: err.message || "Failed to convert badge to image.",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Card className="border shadow-lg overflow-hidden h-fit">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-base font-bold flex items-center text-foreground justify-between">
          <span className="flex items-center">
            <Award className="h-4.5 w-4.5 text-indigo-600 mr-2" />
            Bilingual Event Badge
          </span>
          <span className="text-xs font-semibold text-[#0D47A1]">Morocco AGM</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 flex flex-col items-center space-y-6">
        
        {/* The Live Interactive Badge Card Preview */}
        <div className="scale-90 sm:scale-95 origin-center shadow-2xl rounded-2xl overflow-hidden hover:scale-100 transition-transform duration-300">
          <PremiumBadge
            id="profile-badge-card-element"
            delegate={delegate}
            language={language}
            categoryOverride={category === "auto" ? undefined : category}
          />
        </div>

        {/* Badge Customization Controls */}
        <div className="w-full grid grid-cols-2 gap-3 text-sm pt-2">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
              <Languages className="h-3.5 w-3.5 text-indigo-600" />
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="w-full p-1.5 border rounded-lg bg-background text-xs font-semibold focus:outline-none focus:border-indigo-500"
            >
              <option value="bilingual">Bilingual</option>
              <option value="fr">French (Français)</option>
              <option value="en">English (English)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-1.5 border rounded-lg bg-background text-xs font-semibold focus:outline-none focus:border-indigo-500"
            >
              <option value="auto">Auto-detect</option>
              <option value="VIP">VIP</option>
              <option value="STAFF">STAFF</option>
              <option value="DELEGATE">DELEGATE</option>
              <option value="OBSERVER">OBSERVER</option>
              <option value="PARTNER">PARTNER</option>
              <option value="GUEST">GUEST</option>
            </select>
          </div>
        </div>

        {/* Action Triggers */}
        <div className="w-full grid grid-cols-2 gap-2 pt-2">
          <Button
            onClick={handleDownload}
            disabled={exporting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 py-2 h-9"
          >
            {exporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Download
          </Button>

          <Button
            onClick={handlePrint}
            variant="outline"
            className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-semibold text-xs flex items-center justify-center gap-1.5 py-2 h-9"
          >
            <Printer className="h-4 w-4" />
            Print Badge
          </Button>
        </div>

      </CardContent>

      {/* Hidden printable frame triggered during print */}
      <div className="hidden print:block fixed inset-0 z-[9999] bg-white print-section">
        <div className="page-break-after-always flex items-center justify-center h-screen w-screen">
          <PremiumBadge
            delegate={delegate}
            language={language}
            categoryOverride={category === "auto" ? undefined : category}
          />
        </div>
      </div>
    </Card>
  );
}
