"use client";

import type * as React from "react";
import {
  BarChart3Icon,
  BoxIcon,
  CalendarIcon,
  FileTextIcon,
  HardDriveIcon,
  LayoutDashboardIcon,
  MapPinIcon,
  NetworkIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";

import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import Image from "next/image";

const data = {
  user: {
    name: "John Doe",
    email: "john@ofgen.africa",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Delegates",
      url: "/delegates",
      icon: UsersIcon,
    },
    {
      title: "Users",
      url: "/users",
      icon: UsersIcon,
    },
    {
      title: "Events",
      url: "/events",
      icon: CalendarIcon,
    },
    {
      title: "Information",

      url: "/information",
      icon: InfoCircledIcon,
    },
  ],
  navSecondary: [
    {
      title: "Analytics",
      url: "/analytics",
      icon: BarChart3Icon,
    },
    {
      title: "Equipment",
      url: "/equipment",
      icon: HardDriveIcon,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: SettingsIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" className="border-r-0" {...props}>
      <SidebarHeader className="border-b border-sidebar-border bg-sidebar p-0">
        <SidebarMenu>
          <SidebarMenu>
            <SidebarMenuItem className="py-2">
              <SidebarMenuButton
                tooltip="Home"
                className="group relative overflow-hidden   shadow-sm transition-all duration-200 hover:from-emerald-700 hover:to-emerald-800 hover:shadow-md active:scale-95 "
              >
                <Link href="/dashboard" className="flex items-center gap-3">
                  <div className="rounded-sm p-0.5">
                    <Image
                      src="https://res.cloudinary.com/dn3q6mcwp/image/upload/v1751808227/shaf-icon2_c54wvd.png"
                      alt="Logo"
                      width={24}
                      height={24}
                    />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-lg font-bold tracking-tight  hover:text-foreground/90 bg-gradient-to-r from-green-600 to-purple-600 bg-clip-text text-transparent">
                      SHAFDB EVENTS
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-sidebar">
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border bg-sidebar">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
