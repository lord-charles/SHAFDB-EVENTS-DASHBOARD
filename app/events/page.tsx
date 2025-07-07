import type { Metadata } from "next";
import { AppSidebar } from "@/components/app-sidebar";

import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Dashboard | Shelter Afrique",
  description: "Dashboard for Shelter Afrique",
};
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  // const dashboardData = await getDashboardData();
  const launchDate = new Date();
  launchDate.setDate(launchDate.getDate() + 45);
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <ComingSoon
          moduleName="Events"
          description="Event information will be available here"
          targetDate={launchDate}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
