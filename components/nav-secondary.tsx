"use client";

import * as React from "react";
import { BarChart3Icon, SettingsIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavSecondary({ ...props }: any) {
  const pathname = usePathname();
  const { toast } = useToast();

  const isAnalyticsActive = pathname === "/dashboard";
  const isSettingsActive = pathname === "/settings";

  return (
    <SidebarGroup {...props}>
      <SidebarGroupLabel className="px-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/70 border border-sidebar-border">
        System
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="gap-1 mt-2">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isAnalyticsActive}
              className="group relative transition-all duration-200 hover:bg-sidebar-accent/50 data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-700 data-[active=true]:shadow-sm dark:data-[active=true]:bg-emerald-950/30 dark:data-[active=true]:text-emerald-400"
            >
              <Link href="/dashboard" className="flex items-center gap-3">
                <BarChart3Icon
                  className={`transition-colors ${
                    isAnalyticsActive
                      ? "text-emerald-600 dark:text-emerald-400"
                      : ""
                  }`}
                />
                <span className="font-medium">Analytics</span>
                {isAnalyticsActive && (
                  <div className="absolute right-2 h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isSettingsActive}
              className="group relative transition-all duration-200 hover:bg-sidebar-accent/50 data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-700 data-[active=true]:shadow-sm dark:data-[active=true]:bg-emerald-950/30 dark:data-[active=true]:text-emerald-400"
              onClick={() => {
                toast({
                  title: "Settings",
                  description: "Settings feature coming soon!",
                });
              }}
            >
              <div className="flex items-center gap-3">
                <SettingsIcon
                  className={`transition-colors ${
                    isSettingsActive
                      ? "text-emerald-600 dark:text-emerald-400"
                      : ""
                  }`}
                />
                <span className="font-medium text-md">Settings</span>
                {isSettingsActive && (
                  <div className="absolute right-2 h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                )}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
