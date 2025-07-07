"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Mail,
  Bell,
  TrendingUp,
  Globe,
  CheckCircle,
  Building,
  MapPin,
  UserCheck,
  Monitor,
  Activity,
} from "lucide-react";
import { DelegateManagement } from "@/components/delegates/delegate-management";
import { EmailComposer } from "@/components/delegates/email-composer";
import { PushNotificationCenter } from "@/components/delegates/push-notification-center";
import type { Delegate } from "@/types/delegate";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { apiService } from "@/services/api";

export default function ShelterAfriqueNotifications() {
  const [selectedDelegates, setSelectedDelegates] = useState<Delegate[]>([]);
  const [currentYear, setCurrentYear] = useState(2025);
  const [loading, setLoading] = useState(false);
  const [delegates, setDelegates] = useState<Delegate[]>([]);

  useEffect(() => {
    const loadDelegates = async () => {
      setLoading(true);
      try {
        const data = await apiService.getDelegatesByYear(currentYear);
        setDelegates(data);
      } catch (error) {
        console.error("Failed to load delegates:", error);
        setDelegates([]);
      } finally {
        setLoading(false);
      }
    };

    loadDelegates();
  }, [currentYear]);

  // Calculate comprehensive statistics
  const stats = {
    total: delegates.length,
    approved: delegates.filter((d) => d.status === "approved").length,
    pending: delegates.filter((d) => d.status === "pending").length,
    rejected: delegates.filter((d) => d.status === "rejected").length,
    checkedIn: delegates.filter((d) => d.hasCheckedIn).length,
    physical: delegates.filter((d) => d.attendanceMode === "physical").length,
    virtual: delegates.filter((d) => d.attendanceMode === "virtual").length,
    government: delegates.filter((d) => d.delegateType === "government").length,
    private: delegates.filter((d) => d.delegateType === "private").length,
    ngo: delegates.filter((d) => d.delegateType === "ngo").length,
    countries: new Set(delegates.map((d) => d.address.country)).size,
    organizations: new Set(delegates.map((d) => d.organization)).size,
    admins: delegates.filter((d) => d.isAdmin).length,
    approvalRate: Math.round(
      (delegates.filter((d) => d.status === "approved").length /
        delegates.length) *
        100
    ),
    checkInRate:
      Math.round(
        (delegates.filter((d) => d.hasCheckedIn).length /
          delegates.filter((d) => d.status === "approved").length) *
          100
      ) || 0,
  };

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="min-h-screen">
          <div className="p-2 space-y-4">
            {/* Executive Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-2">
              {/* Total Delegates */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700">
                    Total Delegates
                  </CardTitle>
                  <Users className="h-5 w-5 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-900">
                    {stats.total}
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge
                      variant="secondary"
                      className="bg-blue-200 text-blue-800"
                    >
                      {stats.countries} Countries
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-blue-200 text-blue-800"
                    >
                      {stats.organizations} Orgs
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Approval Status */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100 hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-emerald-700">
                    Approval Rate
                  </CardTitle>
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-emerald-900">
                    {stats.approvalRate}%
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className="bg-emerald-600 text-white">
                      {stats.approved} Approved
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-orange-300 text-orange-700"
                    >
                      {stats.pending} Pending
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Check-in Status */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-700">
                    Check-in Rate
                  </CardTitle>
                  <UserCheck className="h-5 w-5 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-900">
                    {stats.checkInRate}%
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className="bg-purple-600 text-white">
                      {stats.checkedIn} Checked In
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-gray-300 text-gray-700"
                    >
                      {stats.approved - stats.checkedIn} Pending
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Attendance Mode */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-orange-700">
                    Attendance Mode
                  </CardTitle>
                  <Activity className="h-5 w-5 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-orange-700 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        Physical
                      </span>
                      <Badge className="bg-orange-600 text-white">
                        {stats.physical}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-orange-700 flex items-center">
                        <Monitor className="h-3 w-3 mr-1" />
                        Virtual
                      </span>
                      <Badge
                        variant="outline"
                        className="border-orange-300 text-orange-700"
                      >
                        {stats.virtual}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Navigation Tabs */}
            <Tabs defaultValue="delegates" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 shadow-lg rounded-xl p-1 h-14">
                <TabsTrigger
                  value="delegates"
                  className="flex items-center space-x-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-lg h-12 text-sm font-medium transition-all duration-200"
                >
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Delegate Management</span>
                  <span className="sm:hidden">Delegates</span>
                </TabsTrigger>
                <TabsTrigger
                  value="email"
                  className="flex items-center space-x-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-lg h-12 text-sm font-medium transition-all duration-200"
                >
                  <Mail className="h-4 w-4" />
                  <span className="hidden sm:inline">Email Composition</span>
                  <span className="sm:hidden">Email</span>
                </TabsTrigger>
                <TabsTrigger
                  value="push"
                  className="flex items-center space-x-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-lg h-12 text-sm font-medium transition-all duration-200"
                >
                  <Bell className="h-4 w-4" />
                  <span className="hidden sm:inline">Push Notifications</span>
                  <span className="sm:hidden">Push</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="delegates" className="space-y-6">
                <DelegateManagement
                  delegates={delegates}
                  selectedDelegates={selectedDelegates}
                  onSelectionChange={setSelectedDelegates}
                  currentYear={currentYear}
                  onYearChange={setCurrentYear}
                  loading={loading}
                />
              </TabsContent>

              <TabsContent value="email" className="space-y-6">
                <EmailComposer selectedDelegates={selectedDelegates} />
              </TabsContent>

              <TabsContent value="push" className="space-y-6">
                <PushNotificationCenter selectedDelegates={selectedDelegates} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
