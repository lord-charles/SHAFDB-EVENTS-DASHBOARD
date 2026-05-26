import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Globe,
  CheckCircle,
  MapPin,
  UserCheck,
  Activity,
  Monitor,
} from "lucide-react";
import { DelegatesTabsContainer } from "@/components/delegates/delegates-tabs-container";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
  getEventYears,
  getDelegatesByYear,
  getDelegateStatistics,
} from "@/services/delegates.service";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{
    year?: string;
    page?: string;
    limit?: string;
    search?: string;
    country?: string;
    status?: string;
    type?: string;
    mode?: string;
  }>;
}

export default async function ShelterAfriqueNotificationsPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // 1. Fetch Event Years to determine the active year filter
  let eventYears: number[] = [2025, 2024, 2023];
  try {
    const years = await getEventYears();
    if (years && years.length > 0) {
      eventYears = years;
    }
  } catch (error) {
    console.error("Failed to load event years:", error);
  }

  const currentYear = searchParams.year ? Number.parseInt(searchParams.year) : eventYears[0];
  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1;
  const limit = searchParams.limit ? Number.parseInt(searchParams.limit) : 10;

  // Filters read from URL
  const filters = {
    search: searchParams.search || "",
    country: searchParams.country || "all",
    status: searchParams.status || "all",
    type: searchParams.type || "all",
    mode: searchParams.mode || "all",
  };

  // 2. Parallel server-side fetch of statistics and delegates for the selected year
  let delegates: any[] = [];
  let stats = {
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    checkedIn: 0,
    physical: 0,
    virtual: 0,
    government: 0,
    private: 0,
    ngo: 0,
    countries: 0,
    organizations: 0,
    approvalRate: 0,
    checkInRate: 0,
  };

  try {
    const [delegatesData, statsData] = await Promise.all([
      getDelegatesByYear(currentYear),
      getDelegateStatistics(currentYear),
    ]);
    delegates = delegatesData || [];
    stats = statsData || stats;
  } catch (error) {
    console.error("Failed to load server data:", error);
  }

  // 3. Process robust Server-side filtering
  const filteredDelegates = delegates.filter((delegate) => {
    const fullName = (delegate.fullName || "").toLowerCase();
    const email = (delegate.email || "").toLowerCase();
    const position = (delegate.position || "").toLowerCase();
    const org = (delegate.organization || "").toLowerCase();
    const searchVal = filters.search.toLowerCase();

    const matchesSearch =
      !filters.search ||
      fullName.includes(searchVal) ||
      email.includes(searchVal) ||
      position.includes(searchVal) ||
      org.includes(searchVal);

    const matchesCountry =
      filters.country === "all" || delegate.address?.country === filters.country;

    const matchesStatus =
      filters.status === "all" || delegate.status === filters.status;

    const matchesType =
      filters.type === "all" || delegate.delegateType === filters.type;

    const matchesMode =
      filters.mode === "all" || delegate.attendanceMode === filters.mode;

    return matchesSearch && matchesCountry && matchesStatus && matchesType && matchesMode;
  });

  // Calculate dynamic options list for filters based on all registered delegates of that year
  const countries = Array.from(new Set(delegates.map((d) => d.address?.country)))
    .filter(Boolean)
    .sort() as string[];

  const delegateTypes = Array.from(new Set(delegates.map((d) => d.delegateType)))
    .filter(Boolean)
    .sort() as string[];

  // 4. Server-side Pagination computation
  const totalDelegates = filteredDelegates.length;
  const totalPages = Math.ceil(totalDelegates / limit) || 1;
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (currentPage - 1) * limit;
  const paginatedDelegates = filteredDelegates.slice(startIndex, startIndex + limit);

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
          <div className="p-4 space-y-4">
            
            {/* Executive Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-2">
              {/* Total Delegates */}
              <Card className="border shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl dark:from-blue-950/20 dark:to-blue-900/10 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                    Total Delegates
                  </CardTitle>
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-extrabold text-blue-900 dark:text-blue-100">
                    {stats.total}
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="secondary" className="bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 font-medium border-0">
                      {stats.countries} Countries
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 font-medium border-0">
                      {stats.organizations} Orgs
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Approval Status */}
              <Card className="border shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100 hover:shadow-xl dark:from-emerald-950/20 dark:to-emerald-900/10 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                    Approval Rate
                  </CardTitle>
                  <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-extrabold text-emerald-900 dark:text-emerald-100">
                    {stats.approvalRate}%
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className="bg-emerald-600 text-white font-medium border-0">
                      {stats.approved} Approved
                    </Badge>
                    <Badge variant="outline" className="border-orange-300 text-orange-700 dark:text-orange-400 font-medium bg-orange-500/5">
                      {stats.pending} Pending
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Check-in Status */}
              <Card className="border shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl dark:from-purple-950/20 dark:to-purple-900/10 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold text-purple-700 dark:text-purple-400">
                    Check-in Rate
                  </CardTitle>
                  <UserCheck className="h-5 w-5 text-purple-600 dark:text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-extrabold text-purple-900 dark:text-purple-100">
                    {stats.checkInRate}%
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className="bg-purple-600 text-white font-medium border-0">
                      {stats.checkedIn} Checked In
                    </Badge>
                    <Badge variant="outline" className="border-gray-300 text-gray-700 dark:text-gray-300 font-medium bg-secondary">
                      {stats.approved - stats.checkedIn} Pending
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Attendance Mode */}
              <Card className="border shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-xl dark:from-orange-950/20 dark:to-orange-900/10 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold text-orange-700 dark:text-orange-400">
                    Attendance Mode
                  </CardTitle>
                  <Activity className="h-5 w-5 text-orange-600 dark:text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm font-semibold">
                      <span className="text-orange-700 dark:text-orange-400 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        Physical
                      </span>
                      <Badge className="bg-orange-600 text-white font-semibold border-0">{stats.physical}</Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm font-semibold">
                      <span className="text-orange-700 dark:text-orange-400 flex items-center">
                        <Monitor className="h-3 w-3 mr-1" />
                        Virtual
                      </span>
                      <Badge variant="outline" className="border-orange-300 text-orange-700 dark:text-orange-400 bg-orange-500/5 font-semibold">{stats.virtual}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Navigation Tabs */}
            <DelegatesTabsContainer
              delegates={paginatedDelegates}
              currentYear={currentYear}
              eventYears={eventYears}
              currentPage={currentPage}
              totalPages={totalPages}
              totalDelegates={totalDelegates}
              countries={countries}
              delegateTypes={delegateTypes}
              initialFilters={filters}
            />

          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
