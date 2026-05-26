"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Calendar,
  CheckCircle,
  UserCheck,
  Building,
  Globe,
  TrendingUp,
  MapPin,
  Activity,
  ArrowUpRight,
  RefreshCw,
  Award,
  ShieldCheck,
  FileText,
  Percent,
} from "lucide-react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { getDelegateStatistics, getEventYears } from "@/services/delegates.service";

export default function DashboardPage() {
  const [currentYear, setCurrentYear] = useState<number>(2025);
  const [eventYears, setEventYears] = useState<number[]>([2025, 2024, 2023]);
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState({
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
  });

  const loadData = async (year: number) => {
    setLoading(true);
    try {
      const statsData = await getDelegateStatistics(year);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load dashboard statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch years on mount
  useEffect(() => {
    const loadYears = async () => {
      try {
        const years = await getEventYears();
        if (years && years.length > 0) {
          setEventYears(years);
          setCurrentYear(years[0]);
          loadData(years[0]);
        } else {
          loadData(currentYear);
        }
      } catch (error) {
        console.error("Failed to load event years:", error);
        loadData(currentYear);
      }
    };
    loadYears();
  }, []);

  // Fetch statistics when currentYear changes
  const handleYearChange = (yearStr: string) => {
    const yr = Number.parseInt(yearStr);
    setCurrentYear(yr);
    loadData(yr);
  };

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
          <div className="p-6 space-y-6">
            
            {/* Greeting Header & Year Picker */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                  Executive Dashboard
                </h1>
                <p className="text-muted-foreground mt-1 text-sm">
                  Shelter Afrique Event Intelligence and Delegate Operations for {currentYear}.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadData(currentYear)}
                  disabled={loading}
                  className="h-9 hover:bg-accent border"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                
                <Select value={currentYear.toString()} onValueChange={handleYearChange}>
                  <SelectTrigger className="w-36 border shadow-sm">
                    <Calendar className="h-4 w-4 mr-2 text-emerald-600" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {eventYears.map((yr) => (
                      <SelectItem key={yr} value={yr.toString()}>
                        AGM Year {yr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Total Registrations */}
              <Card className="border shadow-lg relative overflow-hidden bg-gradient-to-br from-card to-emerald-500/5 group hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">
                    Total Registered
                  </CardTitle>
                  <Users className="h-5 w-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-extrabold">{stats.total}</div>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1 text-emerald-500" />
                    Active registrations for {currentYear}
                  </p>
                </CardContent>
              </Card>

              {/* Approval Rate Card */}
              <Card className="border shadow-lg relative overflow-hidden bg-gradient-to-br from-card to-blue-500/5 group hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">
                    Approved Registrations
                  </CardTitle>
                  <ShieldCheck className="h-5 w-5 text-blue-500 group-hover:scale-110 transition-transform" />
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-extrabold">{stats.approved}</div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className="bg-blue-600/90 text-white border-0 font-medium">
                      {stats.approvalRate}% Rate
                    </Badge>
                    <span className="text-xs text-muted-foreground">{stats.pending} pending approval</span>
                  </div>
                </CardContent>
              </Card>

              {/* Check-In Performance */}
              <Card className="border shadow-lg relative overflow-hidden bg-gradient-to-br from-card to-purple-500/5 group hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">
                    Event Check-In
                  </CardTitle>
                  <UserCheck className="h-5 w-5 text-purple-500 group-hover:scale-110 transition-transform" />
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-extrabold">{stats.checkedIn}</div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className="bg-purple-600/90 text-white border-0 font-medium">
                      {stats.checkInRate}% Attending
                    </Badge>
                    <span className="text-xs text-muted-foreground">{stats.approved - stats.checkedIn} pending check-in</span>
                  </div>
                </CardContent>
              </Card>

              {/* Global Diversity */}
              <Card className="border shadow-lg relative overflow-hidden bg-gradient-to-br from-card to-orange-500/5 group hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 left-0 w-1 h-full bg-orange-500" />
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">
                    Global Diversity
                  </CardTitle>
                  <Globe className="h-5 w-5 text-orange-500 group-hover:scale-110 transition-transform" />
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-extrabold">{stats.countries}</div>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center">
                    Representing {stats.organizations} organizations worldwide
                  </p>
                </CardContent>
              </Card>

            </div>

            {/* Layout Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Deep Dive & Visual Statistics */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Attendance Mode Gauges */}
                <Card className="border shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Activity className="h-5 w-5 text-emerald-500 mr-2" />
                      Attendance Distribution
                    </CardTitle>
                    <CardDescription>
                      Physical vs. Virtual participation modes for the {currentYear} Annual General Assembly.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Physical Gauge */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 text-emerald-500 mr-1" />
                          Physical (In-Person Venue)
                        </span>
                        <span>{stats.physical} delegates ({stats.total > 0 ? Math.round((stats.physical / stats.total) * 100) : 0}%)</span>
                      </div>
                      <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${stats.total > 0 ? (stats.physical / stats.total) * 100 : 0}%` }}
                        />
                      </div>
                    </div>

                    {/* Virtual Gauge */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="flex items-center">
                          <Globe className="h-4 w-4 text-blue-500 mr-1" />
                          Virtual (Zoom Live Stream)
                        </span>
                        <span>{stats.virtual} delegates ({stats.total > 0 ? Math.round((stats.virtual / stats.total) * 100) : 0}%)</span>
                      </div>
                      <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-500"
                          style={{ width: `${stats.total > 0 ? (stats.virtual / stats.total) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Delegate Profiles Summary */}
                <Card className="border shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Building className="h-5 w-5 text-indigo-500 mr-2" />
                      Sectors & Organization Types
                    </CardTitle>
                    <CardDescription>
                      Classification of participating delegates across diverse sectors.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      
                      {/* Government */}
                      <div className="p-4 border rounded-xl bg-card hover:bg-accent/40 transition-colors">
                        <div className="text-xs font-semibold text-muted-foreground uppercase">Government & Ministry</div>
                        <div className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">{stats.government}</div>
                        <div className="text-xs text-muted-foreground mt-1">Official state representatives</div>
                      </div>

                      {/* Private */}
                      <div className="p-4 border rounded-xl bg-card hover:bg-accent/40 transition-colors">
                        <div className="text-xs font-semibold text-muted-foreground uppercase">Private Enterprise</div>
                        <div className="text-2xl font-bold mt-1 text-blue-600 dark:text-blue-400">{stats.private}</div>
                        <div className="text-xs text-muted-foreground mt-1">Industry partners & sponsors</div>
                      </div>

                      {/* NGO */}
                      <div className="p-4 border rounded-xl bg-card hover:bg-accent/40 transition-colors">
                        <div className="text-xs font-semibold text-muted-foreground uppercase">NGOs & Observers</div>
                        <div className="text-2xl font-bold mt-1 text-purple-600 dark:text-purple-400">{stats.ngo}</div>
                        <div className="text-xs text-muted-foreground mt-1">Housing & civil societies</div>
                      </div>

                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Quick Operations & Actions */}
              <div className="space-y-6">
                
                {/* Executive Quick Actions */}
                <Card className="border shadow-xl bg-gradient-to-br from-card to-accent/20">
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Operations</CardTitle>
                    <CardDescription>Direct management shortcuts.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm transition-all flex items-center justify-between"
                      onClick={() => window.location.href = "/delegates"}
                    >
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        Manage Delegate Directory
                      </span>
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-between hover:bg-accent transition-all"
                      onClick={() => window.location.href = "/delegates?tab=email"}
                    >
                      <span className="flex items-center text-foreground">
                        <FileText className="h-4 w-4 mr-2 text-indigo-500" />
                        Email Composition
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-between hover:bg-accent transition-all"
                      onClick={() => window.location.href = "/delegates?tab=push"}
                    >
                      <span className="flex items-center text-foreground">
                        <Activity className="h-4 w-4 mr-2 text-purple-500" />
                        Push Notification Center
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </CardContent>
                </Card>

                {/* Event Host Details */}
                <Card className="border shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Award className="h-5 w-5 text-amber-500 mr-2" />
                      AGM Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3 text-sm">
                      <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="font-semibold text-foreground">Shelter Afrique AGM</div>
                        <div className="text-xs text-muted-foreground">Annual General Assembly of Shareholders</div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 text-sm">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="font-semibold text-foreground">Event Year {currentYear}</div>
                        <div className="text-xs text-muted-foreground">Dynamic system filter year active</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>
              
            </div>

          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
