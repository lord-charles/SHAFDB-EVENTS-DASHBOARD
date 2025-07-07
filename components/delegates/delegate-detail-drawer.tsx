"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
  Star,
  CheckCircle,
  Clock,
  XCircle,
  Edit,
  MessageSquare,
  Send,
} from "lucide-react";
import type { Delegate } from "@/types/delegate";

interface DelegateDetailDrawerProps {
  delegate: Delegate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DelegateDetailDrawer({
  delegate,
  open,
  onOpenChange,
}: DelegateDetailDrawerProps) {
  if (!delegate) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary-foreground";
      case "pending":
        return "bg-muted text-muted-foreground border-muted-foreground/20";
      case "rejected":
        return "bg-destructive/10 text-destructive border-destructive/20 dark:bg-destructive/20 dark:text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground border-muted-foreground/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
        <SheetHeader className="pb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
                <AvatarImage
                  src={delegate.profilePicture || "/placeholder.svg"}
                />
                <AvatarFallback className="bg-accent text-accent-foreground font-semibold text-2xl">
                  {delegate.firstName[0]}
                  {delegate.lastName[0]}
                </AvatarFallback>
              </Avatar>
              {delegate.isAdmin && (
                <div className="absolute -bottom-1 -right-1 h-8 w-8 bg-accent rounded-full flex items-center justify-center">
                  <Star className="h-4 w-4 text-accent-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <SheetTitle className="text-2xl font-bold text-foreground">
                {delegate.title} {delegate.fullName}
              </SheetTitle>
              <SheetDescription className="text-lg font-medium text-muted-foreground mt-1">
                {delegate.position} at {delegate.organization}
              </SheetDescription>
              <div className="flex items-center space-x-2 mt-3">
                <Badge variant={delegate.status as any}>
                  {getStatusIcon(delegate.status)}
                  <span className="ml-1 capitalize">{delegate.status}</span>
                </Badge>
                <Badge
                  variant="outline"
                  className={getDelegateTypeColor(delegate.delegateType)}
                >
                  {delegate.delegateType}
                </Badge>
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center">
              <User className="h-5 w-5 mr-2 text-primary" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 gap-4 pl-7">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{delegate.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{delegate.phoneNumber}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{delegate.nationality}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Organization Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center">
              <Building className="h-5 w-5 mr-2 text-primary" />
              Organization Details
            </h3>
            <div className="grid grid-cols-1 gap-4 pl-7">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Organization
                </label>
                <p className="text-foreground mt-1">{delegate.organization}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Position
                </label>
                <p className="text-foreground mt-1">{delegate.position}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-primary" />
              Address Information
            </h3>
            <div className="grid grid-cols-1 gap-4 pl-7">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Street Address
                </label>
                <p className="text-foreground mt-1">
                  {delegate.address.street}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    City
                  </label>
                  <p className="text-foreground mt-1">
                    {delegate.address.city}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    State/Province
                  </label>
                  <p className="text-foreground mt-1">
                    {delegate.address.state}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Country
                  </label>
                  <p className="text-foreground mt-1">
                    {delegate.address.country}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Postal Code
                  </label>
                  <p className="text-foreground mt-1">
                    {delegate.address.postalCode}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Event Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              Event Details
            </h3>
            <div className="grid grid-cols-1 gap-4 pl-7">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Attendance Mode
                  </label>
                  <Badge variant="outline">{delegate.attendanceMode}</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Check-in Status
                  </label>
                  <div className="flex items-center mt-1">
                    {delegate.hasCheckedIn ? (
                      <CheckCircle className="h-4 w-4 text-primary mr-1" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground mr-1" />
                    )}
                    <span className="text-sm font-medium">
                      {delegate.hasCheckedIn ? "Checked In" : "Not Checked In"}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Registration Date
                </label>
                <p className="text-foreground mt-1">
                  {new Date(delegate.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
