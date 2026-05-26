import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDelegateById } from "@/services/delegates.service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Building,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Globe,
  ArrowLeft,
  Edit,
  Printer,
  BadgeAlert,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { redirect } from "next/navigation";
import { ProfileBadgeCard } from "@/components/delegates/profile-badge-card";

export default async function DelegateProfilePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  let delegate = null;
  try {
    delegate = await getDelegateById(params.id);
  } catch (error) {
    console.error("Failed to load delegate details:", error);
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
              The delegate credentials could not be loaded. They may have been revoked or have expired.
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

  const getDelegateTypeColor = (type: string) => {
    switch (type) {
      case "government":
        return "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground";
      case "private":
        return "bg-secondary/10 text-secondary dark:bg-secondary/20 dark:text-secondary-foreground";
      case "ngo":
        return "bg-accent/10 text-accent dark:bg-accent/20 dark:text-accent-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
          <div className="p-6 max-w-4xl mx-auto space-y-6">
            
            {/* Navigation and Actions */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <Link href="/delegates">
                <Button variant="ghost" size="sm" className="hover:bg-accent text-sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Directory
                </Button>
              </Link>

              <div className="flex items-center space-x-3">
                <Link href={`/delegates/${delegate._id}/edit`}>
                  <Button size="sm" className="h-9 bg-green-600 hover:bg-green-700 text-white font-medium shadow-sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </div>

            {/* Profile Overview Card */}
            <Card className="border shadow-xl overflow-hidden bg-gradient-to-br from-card to-emerald-500/5">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                  <Avatar className="h-28 w-28 border-4 border-background shadow-xl">
                    <AvatarImage src={delegate.profilePicture || "/placeholder.svg"} />
                    <AvatarFallback className="bg-accent text-accent-foreground font-bold text-3xl uppercase">
                      {delegate.firstName[0]}
                      {delegate.lastName[0]}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                      <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                        {delegate.title} {delegate.fullName}
                      </h2>
                      <div className="flex flex-wrap justify-center gap-1.5 mt-1">
                        <Badge className="capitalize text-xs px-2.5 py-0.5">
                          {delegate.status}
                        </Badge>
                        <Badge variant="outline" className={`capitalize text-xs px-2.5 py-0.5 ${getDelegateTypeColor(delegate.delegateType)}`}>
                          {delegate.delegateType}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-lg font-medium text-muted-foreground flex items-center justify-center md:justify-start">
                      <Building className="h-4 w-4 mr-2 text-primary" />
                      {delegate.position} <span className="text-muted-foreground/60 mx-1.5">|</span> {delegate.organization}
                    </p>

                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground pt-1">
                      <span className="flex items-center">
                        <Globe className="h-4 w-4 text-emerald-600 mr-1.5" />
                        {delegate.nationality}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 text-indigo-600 mr-1.5" />
                        AGM Year {delegate.eventYear}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Columns (Span 2): Contact, Attendance & Address Details */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Contact Information */}
                <Card className="border shadow-lg">
                  <CardHeader className="pb-3 border-b">
                    <CardTitle className="text-base font-bold flex items-center text-foreground">
                      <User className="h-4 w-4 text-emerald-600 mr-2" />
                      Contact details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start space-x-3 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="text-xs text-muted-foreground uppercase font-semibold">Email Address</div>
                        <div className="text-foreground mt-0.5 font-medium">{delegate.email}</div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="text-xs text-muted-foreground uppercase font-semibold">Phone Number</div>
                        <div className="text-foreground mt-0.5 font-medium">{delegate.phoneNumber}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Event Logistics */}
                <Card className="border shadow-lg">
                  <CardHeader className="pb-3 border-b">
                    <CardTitle className="text-base font-bold flex items-center text-foreground">
                      <ShieldCheck className="h-4 w-4 text-indigo-600 mr-2" />
                      Attendance details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-muted-foreground uppercase font-semibold">Participation Mode</div>
                        <Badge variant="outline" className="mt-1 capitalize px-3 py-0.5">
                          {delegate.attendanceMode}
                        </Badge>
                      </div>

                      <div>
                        <div className="text-xs text-muted-foreground uppercase font-semibold">Check-in Status</div>
                        <div className="flex items-center mt-1">
                          {delegate.hasCheckedIn ? (
                            <Badge className="bg-green-600 text-white font-medium flex items-center">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Checked In
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="font-medium text-muted-foreground">
                              Not Checked In
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Address Details */}
                <Card className="border shadow-lg">
                  <CardHeader className="pb-3 border-b">
                    <CardTitle className="text-base font-bold flex items-center text-foreground">
                      <MapPin className="h-4 w-4 text-orange-600 mr-2" />
                      Address & Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 space-y-4">
                    <div>
                      <div className="text-xs text-muted-foreground uppercase font-semibold">Street Address</div>
                      <p className="text-foreground mt-0.5 font-medium text-sm">{delegate.address?.street || "N/A"}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-muted-foreground uppercase font-semibold">City</div>
                        <p className="text-foreground mt-0.5 font-medium text-sm">{delegate.address?.city || "N/A"}</p>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground uppercase font-semibold">State / Province</div>
                        <p className="text-foreground mt-0.5 font-medium text-sm">{delegate.address?.state || "N/A"}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-muted-foreground uppercase font-semibold">Country</div>
                        <p className="text-foreground mt-0.5 font-medium text-sm">{delegate.address?.country || "N/A"}</p>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground uppercase font-semibold">Postal Code</div>
                        <p className="text-foreground mt-0.5 font-mono text-sm">{delegate.address?.postalCode || "N/A"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>

              {/* Right Column: Dynamic Event Badge Card */}
              <div className="lg:col-span-1">
                <ProfileBadgeCard delegate={delegate} />
              </div>

            </div>

          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
