import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDelegateById } from "@/services/delegates.service";
import { Card, CardContent } from "@/components/ui/card";
import { BadgeAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { redirect } from "next/navigation";
import EditForm from "./edit-form";

export default async function EditDelegatePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  let delegate = null;
  try {
    delegate = await getDelegateById(params.id);
  } catch (error) {
    console.error("Failed to load delegate for editing:", error);
  }

  if (!delegate) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
            <BadgeAlert className="h-16 w-16 text-muted-foreground/40 mb-4" />
            <h1 className="text-2xl font-bold text-foreground">Delegate Not Found</h1>
            <p className="text-muted-foreground mt-2 max-w-md">
              The delegate registration record could not be retrieved. It may have been deleted.
            </p>
            <Link href="/delegates" className="mt-6">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Directory
              </Button>
            </Link>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
          <div className="p-6 max-w-4xl mx-auto">
            <EditForm delegate={delegate} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
