"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Eye,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Printer,
  Loader2,
  Award,
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
import { createDelegate, updateDelegate, deleteDelegate, getDelegatesByYear } from "@/services/delegates.service";
import { useToast } from "@/hooks/use-toast";
import { PremiumBadge } from "./premium-badge";
import Link from "next/link";

interface DelegateManagementProps {
  delegates: Delegate[];
  selectedDelegates: Delegate[];
  onSelectionChange: (delegates: Delegate[]) => void;
  currentYear: number;
  eventYears?: number[];
  currentPage: number;
  totalPages: number;
  totalDelegates: number;
  countries: string[];
  delegateTypes: string[];
  initialFilters: {
    search: string;
    country: string;
    status: string;
    type: string;
    mode: string;
  };
}

export function DelegateManagement({
  delegates,
  selectedDelegates,
  onSelectionChange,
  currentYear,
  eventYears = [2025, 2024, 2023],
  currentPage,
  totalPages,
  totalDelegates,
  countries,
  delegateTypes,
  initialFilters,
}: DelegateManagementProps) {
  const router = useRouter();
  const { toast } = useToast();

  // Local state for interactive search debouncing
  const [localSearch, setLocalSearch] = useState(initialFilters.search);
  const [crudDialogOpen, setCrudDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDelegate, setSelectedDelegate] = useState<Delegate | null>(null);

  // Premium Badge States
  const [badgeModalOpen, setBadgeModalOpen] = useState(false);
  const [badgeLanguage, setBadgeLanguage] = useState<"en" | "fr" | "bilingual">("bilingual");
  const [badgeCategoryOverride, setBadgeCategoryOverride] = useState<string>("auto");
  const [badgeExportProgress, setBadgeExportProgress] = useState(0);
  const [exportingBadges, setExportingBadges] = useState(false);
  const [allYearDelegates, setAllYearDelegates] = useState<Delegate[]>([]);
  const [loadingBadgesData, setLoadingBadgesData] = useState(false);
  const [badgeScope, setBadgeScope] = useState<"selected" | "all">("all");

  // Badge Operation Center local filters
  const [modalSearch, setModalSearch] = useState("");
  const [modalTypeFilter, setModalTypeFilter] = useState("all");
  const [modalStatusFilter, setModalStatusFilter] = useState("all");
  const [modalModeFilter, setModalModeFilter] = useState("all");

  // Derived state: active source targets
  const activeSourceList = badgeScope === "selected" ? selectedDelegates : allYearDelegates;

  const filteredBadgeTargets = activeSourceList.filter((delegate) => {
    const fullName = (delegate.fullName || "").toLowerCase();
    const email = (delegate.email || "").toLowerCase();
    const position = (delegate.position || "").toLowerCase();
    const org = (delegate.organization || "").toLowerCase();
    const searchVal = modalSearch.toLowerCase();

    const matchesSearch =
      !modalSearch ||
      fullName.includes(searchVal) ||
      email.includes(searchVal) ||
      position.includes(searchVal) ||
      org.includes(searchVal);

    const matchesType =
      modalTypeFilter === "all" || delegate.delegateType === modalTypeFilter;

    const matchesStatus =
      modalStatusFilter === "all" || delegate.status === modalStatusFilter;

    const matchesMode =
      modalModeFilter === "all" || delegate.attendanceMode === modalModeFilter;

    return matchesSearch && matchesType && matchesStatus && matchesMode;
  });

  const [formData, setFormData] = useState({
    title: "Mr.",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    nationality: "Kenyan",
    delegateType: "private",
    attendanceMode: "physical",
    organization: "",
    position: "",
    status: "pending",
    eventYear: currentYear,
    address: {
      street: "Uhuru Highway",
      city: "Nairobi",
      state: "Nairobi County",
      country: "Kenya",
      postalCode: "00100",
    },
    password: "DefaultPassword123!",
  });

  // Push filter parameters directly to URL which triggers Server-Side re-rendering
  const updateUrlParams = (updates: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams(window.location.search);
    Object.entries(updates).forEach(([key, val]) => {
      if (val === "all" || val === "" || val === undefined) {
        params.delete(key);
      } else {
        params.set(key, val.toString());
      }
    });
    // Reset page to 1 when filters are changed, except when paginating
    if (!updates.page) {
      params.set("page", "1");
    }
    router.push(`/delegates?${params.toString()}`);
  };

  // Debounce search input updates to URL
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== initialFilters.search) {
        updateUrlParams({ search: localSearch });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [localSearch]);

  // Sync local search when URL state changes
  useEffect(() => {
    setLocalSearch(initialFilters.search);
  }, [initialFilters.search]);

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
    if (selectedDelegates.length === delegates.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(delegates);
    }
  };

  const isSelected = (delegate: Delegate) =>
    selectedDelegates.some((d) => d._id === delegate._id);
  const allSelected =
    delegates.length > 0 && selectedDelegates.length === delegates.length;

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

  const handleOpenAddDialog = () => {
    setSelectedDelegate(null);
    setFormData({
      title: "Mr.",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      nationality: "Kenyan",
      delegateType: "private",
      attendanceMode: "physical",
      organization: "",
      position: "",
      status: "pending",
      eventYear: currentYear,
      address: {
        street: "Uhuru Highway",
        city: "Nairobi",
        state: "Nairobi County",
        country: "Kenya",
        postalCode: "00100",
      },
      password: "DefaultPassword123!",
    });
    setCrudDialogOpen(true);
  };

  const handleOpenEditDialog = (delegate: Delegate) => {
    setSelectedDelegate(delegate);
    setFormData({
      title: delegate.title || "Mr.",
      firstName: delegate.firstName || "",
      lastName: delegate.lastName || "",
      email: delegate.email || "",
      phoneNumber: delegate.phoneNumber || "",
      nationality: delegate.nationality || "",
      delegateType: delegate.delegateType || "private",
      attendanceMode: delegate.attendanceMode || "physical",
      organization: delegate.organization || "",
      position: delegate.position || "",
      status: delegate.status || "pending",
      eventYear: delegate.eventYear || currentYear,
      address: {
        street: delegate.address?.street || "",
        city: delegate.address?.city || "",
        state: delegate.address?.state || "",
        country: delegate.address?.country || "",
        postalCode: delegate.address?.postalCode || "",
      },
      password: "", // Keep existing
    });
    setCrudDialogOpen(true);
  };

  const handleOpenDeleteDialog = (delegate: Delegate) => {
    setSelectedDelegate(delegate);
    setDeleteDialogOpen(true);
  };

  const handleOpenBadgeModal = async (scope: "selected" | "all") => {
    setBadgeScope(scope);
    setBadgeCategoryOverride("auto");
    setBadgeLanguage("bilingual");
    
    // Reset filters
    setModalSearch("");
    setModalTypeFilter("all");
    setModalStatusFilter("all");
    setModalModeFilter("all");
    
    setBadgeModalOpen(true);
    setLoadingBadgesData(true);
    try {
      const allDels = await getDelegatesByYear(currentYear);
      setAllYearDelegates(allDels);
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Connection Alert",
        description: "Failed to load complete directory. Fallback page items applied.",
        variant: "destructive",
      });
      setAllYearDelegates(delegates);
    } finally {
      setLoadingBadgesData(false);
    }
  };

  const handleExportBadges = async () => {
    setExportingBadges(true);
    setBadgeExportProgress(0);
    try {
      const { toPng } = await import("html-to-image");
      const JSZip = (await import("jszip")).default;
      const { saveAs } = await import("file-saver");
      
      const total = filteredBadgeTargets.length;
      let completed = 0;

      if (total === 0) {
        toast({
          title: "No Targets Selected",
          description: "There are no badges matching your filter options to export.",
          variant: "destructive",
        });
        return;
      }

      if (total === 1) {
        const delegate = filteredBadgeTargets[0];
        const badgeEl = document.getElementById(`badge-card-render-${delegate._id}`);
        if (badgeEl) {
          await new Promise((resolve) => setTimeout(resolve, 350));
          const dataUrl = await toPng(badgeEl, {
            quality: 1.0,
            pixelRatio: 2.2,
            cacheBust: true,
          });

          const link = document.createElement("a");
          link.download = `badge_${delegate.firstName}_${delegate.lastName}_${badgeLanguage}.png`.replace(/\s+/g, "_");
          link.href = dataUrl;
          link.click();
          
          toast({
            title: "Badge Downloaded",
            description: `Saved badge for ${delegate.firstName} ${delegate.lastName} successfully.`,
          });
          setBadgeModalOpen(false);
        }
      } else {
        const zip = new JSZip();
        for (const delegate of filteredBadgeTargets) {
          const badgeEl = document.getElementById(`badge-card-render-${delegate._id}`);
          if (badgeEl) {
            await new Promise((resolve) => setTimeout(resolve, 350));
            const dataUrl = await toPng(badgeEl, {
              quality: 1.0,
              pixelRatio: 2.2,
              cacheBust: true,
            });

            const base64Data = dataUrl.split(",")[1];
            const fileName = `badge_${delegate.firstName}_${delegate.lastName}_${badgeLanguage}.png`.replace(/\s+/g, "_");
            zip.file(fileName, base64Data, { base64: true });
          }
          completed++;
          setBadgeExportProgress((completed / total) * 100);
        }

        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, `Morocco_AGM_Badges_${currentYear}.zip`);

        toast({
          title: "ZIP Archive Generated",
          description: `Successfully bundled ${total} high-fidelity badge images in a single ZIP.`,
        });
        setBadgeModalOpen(false);
      }
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Export Failed",
        description: err.message || "Failed to generate badge credentials.",
        variant: "destructive",
      });
    } finally {
      setExportingBadges(false);
    }
  };

  const handlePrintBadges = () => {
    setTimeout(() => {
      window.print();
    }, 400);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (selectedDelegate) {
        const payload: any = { ...formData };
        if (!payload.password) delete payload.password;
        await updateDelegate(selectedDelegate._id, payload);
        toast({
          title: "Delegate Updates Saved",
          description: `Successfully modified credentials for ${formData.firstName} ${formData.lastName}`,
        });
      } else {
        await createDelegate(formData);
        toast({
          title: "Delegate Registered",
          description: `Successfully registered new delegate ${formData.firstName} ${formData.lastName}`,
        });
      }
      setCrudDialogOpen(false);
      router.refresh();
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Registration Failed",
        description: err.message || "Failed to submit delegate details. Verify event year match.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDelegate = async () => {
    if (!selectedDelegate) return;
    setSubmitting(true);
    try {
      await deleteDelegate(selectedDelegate._id);
      toast({
        title: "Registration Revoked",
        description: `Successfully deleted registration for ${selectedDelegate.firstName} ${selectedDelegate.lastName}`,
      });
      setDeleteDialogOpen(false);
      router.refresh();
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Revocation Failed",
        description: err.message || "Failed to remove delegate.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="border shadow-xl backdrop-blur-sm bg-background">
      <div className="pb-6 p-2">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold text-foreground flex items-center">
              <Users className="h-6 w-6 mr-3 text-primary" />
              Delegate Directory
            </CardTitle>
            <CardDescription className="mt-1 ml-9">
              Showing {delegates.length} delegates of {totalDelegates} total entries.
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            {selectedDelegates.length > 0 && (
              <Button
                onClick={() => handleOpenBadgeModal("selected")}
                className="h-9 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md transition-all duration-150 animate-in fade-in zoom-in-95"
              >
                <Award className="h-4 w-4 mr-1.5" />
                Badge Selected ({selectedDelegates.length})
              </Button>
            )}

            <Button
              onClick={() => handleOpenBadgeModal("all")}
              variant="outline"
              className="h-9 px-3 border border-indigo-200 text-indigo-700 hover:bg-indigo-50 shadow-sm"
            >
              <Award className="h-4 w-4 mr-1.5 text-indigo-600" />
              Badge All ({totalDelegates})
            </Button>

            <Button
              onClick={handleOpenAddDialog}
              className="h-9 px-3 bg-green-600 hover:bg-green-700 text-white font-medium shadow-sm transition-all"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Add Delegate
            </Button>
            
            <Select
              value={currentYear.toString()}
              onValueChange={(value) => updateUrlParams({ year: value })}
            >
              <SelectTrigger className="w-28 border">
                <Calendar className="h-4 w-4 mr-1.5 text-emerald-600" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {eventYears.map((yr) => (
                  <SelectItem key={yr} value={yr.toString()}>
                    {yr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-2">
        {/* Advanced Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
          <div className="lg:col-span-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search directory..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-10 border focus:border-primary bg-background"
            />
          </div>

          <Select value={initialFilters.country || "all"} onValueChange={(val) => updateUrlParams({ country: val })}>
            <SelectTrigger className="border">
              <Globe className="h-4 w-4 mr-2 text-primary" />
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

          <Select value={initialFilters.status || "all"} onValueChange={(val) => updateUrlParams({ status: val })}>
            <SelectTrigger className="border">
              <UserCheck className="h-4 w-4 mr-2 text-primary" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={initialFilters.type || "all"} onValueChange={(val) => updateUrlParams({ type: val })}>
            <SelectTrigger className="border">
              <Building className="h-4 w-4 mr-2 text-primary" />
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

          <Select value={initialFilters.mode || "all"} onValueChange={(val) => updateUrlParams({ mode: val })}>
            <SelectTrigger className="border">
              <Filter className="h-4 w-4 mr-2 text-primary" />
              <SelectValue placeholder="Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modes</SelectItem>
              <SelectItem value="physical">Physical</SelectItem>
              <SelectItem value="virtual">Virtual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table View */}
        <div className="border rounded-xl overflow-hidden bg-background shadow-md">
          <div className="max-h-[500px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-muted z-10">
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={handleSelectAll}
                      className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                    />
                  </TableHead>
                  <TableHead>Delegate Name</TableHead>
                  <TableHead>Organization / Position</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {delegates.map((delegate) => (
                  <TableRow
                    key={delegate._id}
                    className={`border transition-colors hover:bg-muted/40 ${
                      isSelected(delegate) ? "bg-muted" : ""
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
                        <Avatar className="h-9 w-9 border shadow-sm">
                          <AvatarImage src={delegate.profilePicture || "/placeholder.svg"} />
                          <AvatarFallback className="bg-accent text-accent-foreground font-bold text-xs uppercase">
                            {delegate.firstName ? delegate.firstName[0] : ""}
                            {delegate.lastName ? delegate.lastName[0] : ""}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-bold text-foreground text-sm truncate max-w-[170px]" title={`${delegate.title || ""} ${delegate.fullName || ""}`}>
                            {delegate.title} {delegate.fullName}
                          </div>
                          <div className="text-xs text-muted-foreground truncate max-w-[170px]" title={delegate.email}>{delegate.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-foreground text-sm truncate max-w-[180px]" title={delegate.organization}>{delegate.organization}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[180px]" title={delegate.position}>{delegate.position}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium text-foreground">{delegate.address?.city}</div>
                      <div className="text-xs text-muted-foreground">{delegate.address?.country}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`capitalize font-semibold ${getDelegateTypeColor(delegate.delegateType)}`}>
                        {delegate.delegateType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize text-xs">
                        {delegate.attendanceMode}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="capitalize font-medium text-xs">
                        {delegate.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1 text-sm font-medium">
                        {delegate.hasCheckedIn ? (
                          <Badge className="bg-green-600 text-white border-0 font-semibold">Yes</Badge>
                        ) : (
                          <Badge variant="outline" className="border-border text-muted-foreground">No</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50/50"
                          onClick={() => {
                            setBadgeTargets([delegate]);
                            setBadgeCategoryOverride("auto");
                            setBadgeLanguage("bilingual");
                            setBadgeModalOpen(true);
                          }}
                          title="Preview & Generate Badge"
                        >
                          <Award className="h-4.5 w-4.5" />
                        </Button>
                        <Link href={`/delegates/${delegate._id}`}>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                          </Button>
                        </Link>
                        <Link href={`/delegates/${delegate._id}/edit`}>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Edit2 className="h-4 w-4 text-muted-foreground hover:text-indigo-600" />
                          </Button>
                        </Link>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => handleOpenDeleteDialog(delegate)}>
                          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {delegates.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground/40" />
                      No delegate registrations found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Bottom Advanced Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border rounded-xl bg-muted/40">
            <span className="text-sm font-medium text-muted-foreground">
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({totalDelegates} total entries)
            </span>

            <div className="flex items-center space-x-1.5">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => updateUrlParams({ page: 1 })}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => updateUrlParams({ page: currentPage - 1 })}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pg = idx + 1;
                // Only show active page and neighbors
                if (pg === 1 || pg === totalPages || Math.abs(pg - currentPage) <= 1) {
                  return (
                    <Button
                      key={pg}
                      variant={pg === currentPage ? "default" : "outline"}
                      size="sm"
                      className="h-8 w-8 text-xs font-bold"
                      onClick={() => updateUrlParams({ page: pg })}
                    >
                      {pg}
                    </Button>
                  );
                }
                if (pg === 2 || pg === totalPages - 1) {
                  return <span key={pg} className="px-1.5 text-muted-foreground text-sm">...</span>;
                }
                return null;
              })}

              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => updateUrlParams({ page: currentPage + 1 })}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => updateUrlParams({ page: totalPages })}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

      </div>

      {/* Add Delegate Dialog Modal */}
      <Dialog open={crudDialogOpen} onOpenChange={setCrudDialogOpen}>
        <DialogContent className="max-w-2xl border bg-card max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Register New Event Delegate
            </DialogTitle>
            <DialogDescription>
              Provide event delegate credentials, registration year, and attendance details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-muted-foreground">Title</label>
                <Select
                  value={formData.title}
                  onValueChange={(val) => setFormData({ ...formData, title: val })}
                >
                  <SelectTrigger className="border bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mr.">Mr.</SelectItem>
                    <SelectItem value="Mrs.">Mrs.</SelectItem>
                    <SelectItem value="Ms.">Ms.</SelectItem>
                    <SelectItem value="Dr.">Dr.</SelectItem>
                    <SelectItem value="Prof.">Prof.</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-muted-foreground">First Name</label>
                <Input
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="border bg-background"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-muted-foreground">Last Name</label>
                <Input
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="border bg-background"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-muted-foreground">Email Address</label>
                <Input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border bg-background"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-muted-foreground">Phone Number</label>
                <Input
                  required
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="border bg-background"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-muted-foreground">Nationality</label>
                <Input
                  required
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  className="border bg-background"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-muted-foreground">Organization</label>
                <Input
                  required
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="border bg-background"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-muted-foreground">Position</label>
                <Input
                  required
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="border bg-background"
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-sm font-bold text-foreground mb-3 flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-primary" />
                Address Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">Street Address</label>
                  <Input
                    required
                    value={formData.address.street}
                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
                    className="border bg-background"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-muted-foreground">City</label>
                    <Input
                      required
                      value={formData.address.city}
                      onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                      className="border bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-muted-foreground">State</label>
                    <Input
                      required
                      value={formData.address.state}
                      onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })}
                      className="border bg-background"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">Country</label>
                  <Input
                    required
                    value={formData.address.country}
                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, country: e.target.value } })}
                    className="border bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">Postal Code</label>
                  <Input
                    required
                    value={formData.address.postalCode}
                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, postalCode: e.target.value } })}
                    className="border bg-background"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-muted-foreground">Delegate Type</label>
                <Select
                  value={formData.delegateType}
                  onValueChange={(val) => setFormData({ ...formData, delegateType: val })}
                >
                  <SelectTrigger className="border bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="government">Government Representative</SelectItem>
                    <SelectItem value="private">Private Partner</SelectItem>
                    <SelectItem value="ngo">NGO Observer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-muted-foreground">Attendance Mode</label>
                <Select
                  value={formData.attendanceMode}
                  onValueChange={(val) => setFormData({ ...formData, attendanceMode: val })}
                >
                  <SelectTrigger className="border bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="physical">Physical (In-Person)</SelectItem>
                    <SelectItem value="virtual">Virtual (Zoom Stream)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-muted-foreground">Status</label>
                <Select
                  value={formData.status}
                  onValueChange={(val) => setFormData({ ...formData, status: val })}
                >
                  <SelectTrigger className="border bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-muted-foreground">
                Delegate Password
              </label>
              <Input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="border bg-background"
              />
            </div>

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setCrudDialogOpen(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-medium" disabled={submitting}>
                {submitting ? "Submitting..." : "Register Delegate"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Delegate Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md border bg-card">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center text-red-600">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Revoke Delegate Access?
            </DialogTitle>
            <DialogDescription>
              This will permanently delete the registration record for <strong className="text-foreground">{selectedDelegate?.firstName} {selectedDelegate?.lastName}</strong> for Event {currentYear}. This action is irreversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={submitting}>
              Dismiss
            </Button>
            <Button type="button" className="bg-red-600 hover:bg-red-700 text-white font-medium" onClick={handleDeleteDelegate} disabled={submitting}>
              {submitting ? "Revoking..." : "Revoke Access"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dynamic Badge Operations & Print Center Modal */}
      <Dialog open={badgeModalOpen} onOpenChange={setBadgeModalOpen}>
        <DialogContent className="max-w-5xl border bg-card max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Award className="h-6 w-6 text-indigo-600 animate-pulse" />
              Morocco 45th AGM - Badge Operation Center
            </DialogTitle>
            <DialogDescription>
              Preview, filter, customize, and export high-fidelity bilingual credentials.
            </DialogDescription>
          </DialogHeader>

          {loadingBadgesData ? (
            <div className="flex flex-col items-center justify-center p-24 space-y-4">
              <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
              <p className="text-sm font-semibold text-muted-foreground">
                Fetching complete delegate list for Event {currentYear}...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-2">
              {/* Left side: Live Interactive Scrollable Previews */}
              <div className="lg:col-span-7 space-y-4">
                <div className="text-sm font-bold text-muted-foreground flex justify-between">
                  <span>Badge Preview Panel ({filteredBadgeTargets.length} Card{filteredBadgeTargets.length !== 1 ? "s" : ""})</span>
                  <span className="text-indigo-600">Morocco AGM Layout</span>
                </div>
                {filteredBadgeTargets.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-12 bg-muted/20 border border-dashed rounded-2xl h-[480px]">
                    <Award className="h-12 w-12 text-muted-foreground/30 mb-2" />
                    <p className="text-sm text-muted-foreground font-semibold">No matching delegates found.</p>
                    <p className="text-xs text-muted-foreground/80 mt-1">Try adjusting your filters on the right.</p>
                  </div>
                ) : (
                  <div className="max-h-[480px] overflow-y-auto p-6 flex flex-wrap gap-8 justify-center bg-muted/30 rounded-2xl border shadow-inner">
                    {filteredBadgeTargets.map((delegate) => (
                      <div
                        key={delegate._id}
                        className="scale-90 origin-top -mb-8 hover:scale-95 transition-transform duration-200"
                      >
                        <PremiumBadge
                          id={`badge-card-render-${delegate._id}`}
                          delegate={delegate}
                          language={badgeLanguage}
                          categoryOverride={badgeCategoryOverride === "auto" ? undefined : badgeCategoryOverride}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right side: Operations, Filters & Configurations Panel */}
              <div className="lg:col-span-5 space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Badge Properties
                  </h4>

                  {/* Scope selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase text-muted-foreground">Target Scope</label>
                    <Select
                      value={badgeScope}
                      onValueChange={(val: any) => setBadgeScope(val)}
                    >
                      <SelectTrigger className="border bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedDelegates.length > 0 && (
                          <SelectItem value="selected">Selected Checkboxes ({selectedDelegates.length})</SelectItem>
                        )}
                        <SelectItem value="all">All year registered delegates ({allYearDelegates.length})</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Language selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase text-muted-foreground">Credential Language</label>
                    <Select
                      value={badgeLanguage}
                      onValueChange={(val: any) => setBadgeLanguage(val)}
                    >
                      <SelectTrigger className="border bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bilingual">Bilingual (English & French)</SelectItem>
                        <SelectItem value="fr">French Only (Français)</SelectItem>
                        <SelectItem value="en">English Only (English)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Category Override selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase text-muted-foreground">Category Banner Override</label>
                    <Select
                      value={badgeCategoryOverride}
                      onValueChange={(val) => setBadgeCategoryOverride(val)}
                    >
                      <SelectTrigger className="border bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Automatic (Read Delegate Type)</SelectItem>
                        <SelectItem value="VIP">VIP (Rich Red)</SelectItem>
                        <SelectItem value="STAFF">STAFF (Forest Green)</SelectItem>
                        <SelectItem value="DELEGATE">DELEGATE (Emerald)</SelectItem>
                        <SelectItem value="OBSERVER">OBSERVER (Charcoal)</SelectItem>
                        <SelectItem value="PARTNER">PARTNER (Amber Gold)</SelectItem>
                        <SelectItem value="SPONSOR">SPONSOR (Amber Gold)</SelectItem>
                        <SelectItem value="GUEST">GUEST (Royal Purple)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Filters Section inside Dialog */}
                  <div className="space-y-3 pt-3 border-t">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Dynamic Filter Subset
                    </h4>

                    {/* Search Field */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Search by Name/Org</label>
                      <Input
                        placeholder="Search badges..."
                        value={modalSearch}
                        onChange={(e) => setModalSearch(e.target.value)}
                        className="border bg-background h-8 text-xs focus-visible:ring-indigo-500"
                      />
                    </div>

                    {/* Grid selects */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Type</label>
                        <select
                          value={modalTypeFilter}
                          onChange={(e) => setModalTypeFilter(e.target.value)}
                          className="w-full p-1 border rounded-lg bg-background text-xs focus:outline-none focus:border-indigo-500 h-8 font-semibold"
                        >
                          <option value="all">All Types</option>
                          <option value="government">Government</option>
                          <option value="private">Private Partner</option>
                          <option value="ngo">NGO Observer</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Mode</label>
                        <select
                          value={modalModeFilter}
                          onChange={(e) => setModalModeFilter(e.target.value)}
                          className="w-full p-1 border rounded-lg bg-background text-xs focus:outline-none focus:border-indigo-500 h-8 font-semibold"
                        >
                          <option value="all">All Modes</option>
                          <option value="physical">Physical</option>
                          <option value="virtual">Virtual</option>
                        </select>
                      </div>

                      <div className="space-y-1 col-span-2">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Check-in / Status</label>
                        <select
                          value={modalStatusFilter}
                          onChange={(e) => setModalStatusFilter(e.target.value)}
                          className="w-full p-1 border rounded-lg bg-background text-xs focus:outline-none focus:border-indigo-500 h-8 font-semibold"
                        >
                          <option value="all">All Status</option>
                          <option value="approved">Approved</option>
                          <option value="pending">Pending</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="space-y-3 pt-4 border-t">
                  {exportingBadges && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold text-indigo-700">
                        <span>Exporting PNG Badges...</span>
                        <span>{Math.round(badgeExportProgress)}%</span>
                      </div>
                      <div className="h-2 bg-indigo-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 transition-all duration-150"
                          style={{ width: `${badgeExportProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={handleExportBadges}
                      disabled={exportingBadges || filteredBadgeTargets.length === 0}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      {exportingBadges ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                      {filteredBadgeTargets.length > 1 ? "Bulk Download" : "Download PNG"}
                    </Button>

                    <Button
                      onClick={handlePrintBadges}
                      disabled={exportingBadges || filteredBadgeTargets.length === 0}
                      variant="outline"
                      className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-semibold flex items-center justify-center gap-1.5"
                    >
                      <Printer className="h-4 w-4" />
                      Print Badges
                    </Button>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full text-muted-foreground hover:bg-accent text-xs"
                    onClick={() => setBadgeModalOpen(false)}
                    disabled={exportingBadges}
                  >
                    Close Operations
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Hidden Bulk Print Container (rendered only during browser printing) */}
      <div className="hidden print:block fixed inset-0 z-[9999] bg-white print-section">
        {filteredBadgeTargets.map((delegate) => (
          <div
            key={delegate._id}
            className="page-break-after-always"
          >
            <PremiumBadge
              delegate={delegate}
              language={badgeLanguage}
              categoryOverride={badgeCategoryOverride === "auto" ? undefined : badgeCategoryOverride}
            />
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          /* Completely isolate printable badges, hiding dashboard wrapper entirely */
          body > *:not(.print-section) {
            display: none !important;
          }
          .print-section {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: flex-start !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: white !important;
          }
          .page-break-after-always {
            page-break-after: always !important;
            break-after: always !important;
            height: 100vh !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      `}} />

    </Card>
  );
}
