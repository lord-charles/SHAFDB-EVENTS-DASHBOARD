"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Building,
  MapPin,
  Calendar,
  ShieldCheck,
  ArrowLeft,
  Save,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { updateDelegate } from "@/services/delegates.service";
import type { Delegate } from "@/types/delegate";
import { Separator } from "@/components/ui/separator";

interface EditFormProps {
  delegate: Delegate;
}

export default function EditForm({ delegate }: EditFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
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
    eventYear: delegate.eventYear || 2025,
    address: {
      street: delegate.address?.street || "",
      city: delegate.address?.city || "",
      state: delegate.address?.state || "",
      country: delegate.address?.country || "",
      postalCode: delegate.address?.postalCode || "",
    },
    password: "", // Leave blank to keep existing
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload: any = { ...formData };
      if (!payload.password) {
        delete payload.password;
      }
      await updateDelegate(delegate._id, payload);
      toast({
        title: "Delegate Profile Updated",
        description: `Successfully saved changes for ${formData.firstName} ${formData.lastName}`,
      });
      router.push(`/delegates/${delegate._id}`);
      router.refresh();
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Update Failed",
        description: error?.message || "Failed to update delegate profile.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Actions */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/delegates/${delegate._id}`)}
          className="hover:bg-accent text-sm"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border shadow-xl">
          <CardHeader>
            <CardTitle>Edit Credentials</CardTitle>
            <CardDescription>
              Modify personal details, organization, and registration fields.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Personal Details */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-foreground flex items-center">
                <User className="h-4 w-4 mr-2 text-emerald-600" />
                Personal Profile
              </h4>
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
            </div>

            <Separator />

            {/* Address Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-foreground flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-orange-600" />
                Location & Address Details
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <Separator />

            {/* Privileges & Roles */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-foreground flex items-center">
                <ShieldCheck className="h-4 w-4 mr-2 text-indigo-600" />
                Privilege & Registration
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    onValueChange={(val: any) => setFormData({ ...formData, attendanceMode: val })}
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
                    onValueChange={(val: any) => setFormData({ ...formData, status: val })}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">Event Year</label>
                  <Input
                    required
                    type="number"
                    value={formData.eventYear}
                    onChange={(e) => setFormData({ ...formData, eventYear: Number.parseInt(e.target.value) || 2025 })}
                    className="border bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">
                    Reset Password <span className="text-muted-foreground/60">(Leave empty to keep existing)</span>
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="border bg-background"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t pt-4 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/delegates/${delegate._id}`)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-medium shadow-sm"
                disabled={submitting}
              >
                <Save className="h-4 w-4 mr-2" />
                {submitting ? "Saving..." : "Save Modifications"}
              </Button>
            </div>

          </CardContent>
        </Card>
      </form>
    </div>
  );
}
