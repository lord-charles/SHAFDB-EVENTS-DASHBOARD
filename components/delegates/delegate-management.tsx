"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Filter,
  Users,
  CheckSquare,
  Square,
  MapPin,
  Building,
  Phone,
  Mail,
  Calendar,
  UserCheck,
  Globe,
  Star,
  SortAsc,
  SortDesc,
  Eye,
  Grid,
  List,
} from "lucide-react";
import type { Delegate } from "@/types/delegate";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DelegateDetailDrawer } from "./delegate-detail-drawer";

interface DelegateManagementProps {
  delegates: Delegate[];
  selectedDelegates: Delegate[];
  onSelectionChange: (delegates: Delegate[]) => void;
  currentYear: number;
  onYearChange: (year: number) => void;
  loading: boolean;
}

export function DelegateManagement({
  delegates,
  selectedDelegates,
  onSelectionChange,
  currentYear,
  onYearChange,
  loading,
}: DelegateManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [delegateTypeFilter, setDelegateTypeFilter] = useState("all");
  const [attendanceModeFilter, setAttendanceModeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedDelegate, setSelectedDelegate] = useState<Delegate | null>(
    null
  );
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filteredAndSortedDelegates = useMemo(() => {
    const filtered = delegates.filter((delegate) => {
      const matchesSearch =
        delegate.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delegate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delegate.organization
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        delegate.position.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCountry =
        countryFilter === "all" || delegate.address.country === countryFilter;
      const matchesStatus =
        statusFilter === "all" || delegate.status === statusFilter;
      const matchesType =
        delegateTypeFilter === "all" ||
        delegate.delegateType === delegateTypeFilter;
      const matchesMode =
        attendanceModeFilter === "all" ||
        delegate.attendanceMode === attendanceModeFilter;

      return (
        matchesSearch &&
        matchesCountry &&
        matchesStatus &&
        matchesType &&
        matchesMode
      );
    });

    // Sort delegates
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case "name":
          aValue = a.fullName;
          bValue = b.fullName;
          break;
        case "organization":
          aValue = a.organization;
          bValue = b.organization;
          break;
        case "country":
          aValue = a.address.country;
          bValue = b.address.country;
          break;
        case "created":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          aValue = a.fullName;
          bValue = b.fullName;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortOrder === "asc"
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

    return filtered;
  }, [
    delegates,
    searchTerm,
    countryFilter,
    statusFilter,
    delegateTypeFilter,
    attendanceModeFilter,
    sortBy,
    sortOrder,
  ]);

  const countries = Array.from(new Set(delegates.map((d) => d.address.country)))
    .filter(Boolean)
    .sort();

  const delegateTypes = Array.from(
    new Set(delegates.map((d) => d.delegateType))
  )
    .filter(Boolean)
    .sort();

  const handleSelectDelegate = (delegate: Delegate, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedDelegates, delegate]);
    } else {
      onSelectionChange(
        selectedDelegates.filter((d) => d._id !== delegate._id)
      );
    }
  };

  const handleSelectAll = () => {
    if (selectedDelegates.length === filteredAndSortedDelegates.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(filteredAndSortedDelegates);
    }
  };

  const isSelected = (delegate: Delegate) =>
    selectedDelegates.some((d) => d._id === delegate._id);
  const allSelected =
    filteredAndSortedDelegates.length > 0 &&
    selectedDelegates.length === filteredAndSortedDelegates.length;

  // Theme-adaptive status badge classes
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary-foreground";
      case "pending":
        return "bg-muted text-muted-foreground border-muted-foreground/20";
      case "rejected":
        return "bg-destructive/10 text-destructive border-destructive/20 dark:bg-destructive/20 dark:text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground border-muted-foreground/20";
    }
  };

  // Theme-adaptive delegate type badge classes
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

  const handleViewDelegate = (delegate: Delegate) => {
    setSelectedDelegate(delegate);
    setDrawerOpen(true);
  };

  return (
    <Card className="border shadow-xl backdrop-blur-sm bg-background">
      <div className="pb-6 p-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-foreground flex items-center">
              <Users className="h-6 w-6 mr-3 text-primary" />
              Delegate Directory
            </CardTitle>
            <CardDescription className="text-base mt-2 text-muted-foreground">
              Advanced delegate management with smart filtering and bulk
              operations
            </CardDescription>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8 px-3"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="h-8 px-3"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Select
              value={currentYear.toString()}
              onValueChange={(value) => onYearChange(Number.parseInt(value))}
            >
              <SelectTrigger className="w-32 border">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-2">
        {/* Advanced Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search delegates, organizations, positions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border focus:border-primary bg-background"
            />
          </div>

          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger className="border">
              <Globe className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="border">
              <UserCheck className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={delegateTypeFilter}
            onValueChange={setDelegateTypeFilter}
          >
            <SelectTrigger className="border">
              <Building className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {delegateTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={attendanceModeFilter}
            onValueChange={setAttendanceModeFilter}
          >
            <SelectTrigger className="border">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modes</SelectItem>
              <SelectItem value="physical">Physical</SelectItem>
              <SelectItem value="virtual">Virtual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center justify-between p-4 rounded-xl border bg-muted">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              className="border hover:bg-muted bg-background"
            >
              {allSelected ? (
                <CheckSquare className="h-4 w-4 mr-2" />
              ) : (
                <Square className="h-4 w-4 mr-2" />
              )}
              {allSelected ? "Deselect All" : "Select All"}
            </Button>
            <span className="text-sm font-medium text-foreground">
              {selectedDelegates.length} of {filteredAndSortedDelegates.length}{" "}
              selected
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 border bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="organization">Organization</SelectItem>
                <SelectItem value="country">Country</SelectItem>
                <SelectItem value="created">Date Added</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="border bg-background"
            >
              {sortOrder === "asc" ? (
                <SortAsc className="h-4 w-4" />
              ) : (
                <SortDesc className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto">
            {filteredAndSortedDelegates.map((delegate) => (
              <div
                key={delegate._id}
                className={`group relative p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                  isSelected(delegate)
                    ? "bg-muted border-primary shadow-md"
                    : "bg-background border hover:border-primary hover:bg-muted/70"
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <Checkbox
                      checked={isSelected(delegate)}
                      onCheckedChange={(checked) =>
                        handleSelectDelegate(delegate, checked as boolean)
                      }
                      className="absolute -top-2 -left-2 z-10 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                    />
                    <Avatar className="h-16 w-16 border-4 border-background shadow-lg">
                      <AvatarImage
                        src={delegate.profilePicture || "/placeholder.svg"}
                      />
                      <AvatarFallback className="bg-accent text-accent-foreground font-semibold text-lg">
                        {delegate.firstName[0]}
                        {delegate.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    {delegate.isAdmin && (
                      <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-accent rounded-full flex items-center justify-center">
                        <Star className="h-3 w-3 text-accent-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-bold text-foreground text-lg truncate">
                        {delegate.title} {delegate.fullName}
                      </h3>
                      <Badge variant={delegate.status as any}>
                        {delegate.status}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Building className="h-4 w-4 text-primary" />
                        <span className="font-medium">{delegate.position}</span>
                        <span className="text-muted-foreground">at</span>
                        <span className="truncate">
                          {delegate.organization}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>
                          {delegate.address.city}, {delegate.address.country}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4 text-primary" />
                        <span className="truncate">{delegate.email}</span>
                      </div>

                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4 text-primary" />
                        <span>{delegate.phoneNumber}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="outline"
                          className={getDelegateTypeColor(
                            delegate.delegateType
                          )}
                        >
                          {delegate.delegateType}
                        </Badge>
                        <Badge variant={delegate.attendanceMode as any}>
                          {delegate.attendanceMode}
                        </Badge>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDelegate(delegate)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Table View */}
        {viewMode === "table" && (
          <div className="border rounded-xl overflow-hidden bg-background backdrop-blur-sm">
            <div className="max-h-[600px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-muted z-10">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={handleSelectAll}
                      className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                    />
                  </TableHead>
                  <TableHead>Delegate</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedDelegates.map((delegate) => (
                    <TableRow
                      key={delegate._id}
                      className={`border transition-colors ${
                        isSelected(delegate) ? "bg-muted" : "hover:bg-muted/70"
                      }`}
                    >
                      <TableCell>
                        <Checkbox
                          checked={isSelected(delegate)}
                          onCheckedChange={(checked) =>
                            handleSelectDelegate(delegate, checked as boolean)
                          }
                          className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                              <AvatarImage
                                src={
                                  delegate.profilePicture || "/placeholder.svg"
                                }
                              />
                              <AvatarFallback className="bg-accent text-accent-foreground font-semibold">
                                {delegate.firstName[0]}
                                {delegate.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            {delegate.isAdmin && (
                              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-accent rounded-full flex items-center justify-center">
                                <Star className="h-2 w-2 text-accent-foreground" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">
                              {delegate.title} {delegate.fullName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {delegate.position}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {delegate.organization}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {delegate.address.city}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {delegate.address.country}
                      </TableCell>
                      <TableCell>
                        <Badge variant={delegate.status as any}>
                          <span className="capitalize">{delegate.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getDelegateTypeColor(
                            delegate.delegateType
                          )}
                        >
                          {delegate.delegateType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={delegate.attendanceMode as any}>
                          {delegate.attendanceMode}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {delegate.hasCheckedIn ? (
                            <CheckSquare className="h-4 w-4 text-primary" />
                          ) : (
                            <Square className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="text-sm font-medium">
                            {delegate.hasCheckedIn ? "Yes" : "No"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDelegate(delegate)}
                          className="h-8 px-2"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {filteredAndSortedDelegates.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No delegates found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}
      </div>
      <DelegateDetailDrawer
        delegate={selectedDelegate}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </Card>
  );
}
