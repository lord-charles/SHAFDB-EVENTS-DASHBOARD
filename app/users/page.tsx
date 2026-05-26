"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  ShieldAlert,
  UserCheck,
  Building,
  Mail,
  UserPlus,
  RefreshCw,
  TrendingUp,
  User,
  Fingerprint,
} from "lucide-react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { useToast } from "@/hooks/use-toast";
import {
  getAllEmployees,
  registerEmployee,
  updateEmployee,
  deleteEmployee,
} from "@/services/employees.service";

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const { toast } = useToast();

  // Create & Edit User States
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    nationalId: "",
    employeeId: "",
    department: "",
    position: "",
    employmentType: "full-time",
    password: "",
    roles: ["employee"],
    status: "active",
  });

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllEmployees(1, 1000);
      if (response && response.users) {
        setUsers(response.users);
      } else if (Array.isArray(response)) {
        setUsers(response);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleOpenAddDialog = () => {
    setSelectedUser(null);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      nationalId: "",
      employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      department: "operations",
      position: "Associate",
      employmentType: "full-time",
      password: "",
      roles: ["employee"],
      status: "active",
    });
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (user: any) => {
    setSelectedUser(user);
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      nationalId: user.nationalId || "",
      employeeId: user.employeeId || "",
      department: user.department || "operations",
      position: user.position || "Associate",
      employmentType: user.employmentType || "full-time",
      password: "", // Never prefill passwords
      roles: user.roles || ["employee"],
      status: user.status || "active",
    });
    setDialogOpen(true);
  };

  const handleOpenDeleteDialog = (user: any) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (selectedUser) {
        // Edit User
        const editData: any = { ...formData };
        if (!editData.password) {
          delete editData.password; // Do not update password if left blank
        }
        await updateEmployee(selectedUser._id, editData);
        toast({
          title: "User Updated",
          description: `Successfully updated credentials for ${formData.firstName} ${formData.lastName}`,
        });
      } else {
        // Add User
        if (!formData.password) {
          toast({
            title: "Password Required",
            description: "Please specify a strong password for the new user.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        await registerEmployee(formData as any);
        toast({
          title: "User Registered",
          description: `Successfully onboarded ${formData.firstName} ${formData.lastName}`,
        });
      }
      setDialogOpen(false);
      loadUsers();
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Operation Failed",
        description: error?.message || "Failed to submit user details. Please check constraints.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setLoading(true);
    try {
      await deleteEmployee(selectedUser._id);
      toast({
        title: "User Terminated",
        description: `Successfully deleted account for ${selectedUser.firstName} ${selectedUser.lastName}`,
      });
      setDeleteDialogOpen(false);
      loadUsers();
    } catch (error: any) {
      toast({
        title: "Deletion Failed",
        description: error?.message || "Failed to remove user account.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filtering users
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
    const email = (user.email || "").toLowerCase();
    const position = (user.position || "").toLowerCase();
    const dept = (user.department || "").toLowerCase();
    
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase()) ||
      position.includes(searchTerm.toLowerCase()) ||
      dept.includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter === "all" || user.roles?.includes(roleFilter.toLowerCase());

    return matchesSearch && matchesRole;
  });

  const getRoleColor = (roles: string[]) => {
    if (roles.includes("admin")) return "bg-red-500/10 text-red-600 border-red-500/20";
    if (roles.includes("hr")) return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    return "bg-secondary text-secondary-foreground";
  };

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
          <div className="p-6 space-y-6">
            
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-green-500 to-indigo-600 bg-clip-text text-transparent">
                  User Management
                </h1>
                <p className="text-muted-foreground mt-1 text-sm">
                  Add, update, or revoke access for system administrators, HR managers, and employees.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" onClick={loadUsers} disabled={loading} className="h-9 border">
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                  Sync Users
                </Button>
                <Button onClick={handleOpenAddDialog} className="h-9 bg-green-600 hover:bg-green-700 text-white font-medium">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border shadow-lg bg-gradient-to-br from-card to-green-500/5">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold">Total Administrators</p>
                    <p className="text-3xl font-bold mt-1">
                      {users.filter(u => u.roles?.includes("admin")).length}
                    </p>
                  </div>
                  <ShieldAlert className="h-8 w-8 text-red-500/80" />
                </CardContent>
              </Card>

              <Card className="border shadow-lg bg-gradient-to-br from-card to-blue-500/5">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold">HR Representatives</p>
                    <p className="text-3xl font-bold mt-1">
                      {users.filter(u => u.roles?.includes("hr")).length}
                    </p>
                  </div>
                  <UserCheck className="h-8 w-8 text-blue-500/80" />
                </CardContent>
              </Card>

              <Card className="border shadow-lg bg-gradient-to-br from-card to-indigo-500/5">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold">Active Operators</p>
                    <p className="text-3xl font-bold mt-1">
                      {users.filter(u => u.status === "active").length}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-indigo-500/80" />
                </CardContent>
              </Card>
            </div>

            {/* Advanced Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by name, position, department, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border bg-background"
                />
              </div>

              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-44 border bg-background">
                  <Users className="h-4 w-4 mr-2 text-indigo-600" />
                  <SelectValue placeholder="Filter by Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="hr">HR Representative</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Users Table */}
            <Card className="border shadow-xl overflow-hidden bg-background">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead>System Operator</TableHead>
                    <TableHead>Emp ID</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-24 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user._id} className="hover:bg-muted/50 transition-colors">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="h-9 w-9 bg-accent rounded-full flex items-center justify-center font-bold text-accent-foreground text-sm uppercase">
                            {user.firstName ? user.firstName[0] : ""}{user.lastName ? user.lastName[0] : ""}
                          </div>
                          <div>
                            <div className="font-bold text-foreground">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center">
                              <Mail className="h-3 w-3 mr-1 text-muted-foreground" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{user.employeeId || "N/A"}</TableCell>
                      <TableCell className="capitalize text-sm">{user.department || "General"}</TableCell>
                      <TableCell className="text-sm font-medium">{user.position || "Staff"}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {(user.roles || ["employee"]).map((role: string) => (
                            <Badge key={role} variant="outline" className={`capitalize font-medium ${getRoleColor([role])}`}>
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={user.status === "active" ? "bg-green-600 text-white" : "bg-destructive text-white"}>
                          <span className="capitalize">{user.status || "Active"}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => handleOpenEditDialog(user)}>
                            <Edit2 className="h-4 w-4 text-muted-foreground hover:text-indigo-600" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => handleOpenDeleteDialog(user)}>
                            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredUsers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground/40" />
                        No employees found matching criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </div>
        </div>

        {/* Create/Edit User Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-md border bg-card">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                {selectedUser ? "Modify User Credentials" : "Register System Operator"}
              </DialogTitle>
              <DialogDescription>
                Fill in details to configure platform privileges and roles.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
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

              <div className="grid grid-cols-2 gap-4">
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
                    type="tel"
                    placeholder="254712345678"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="border bg-background"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">National ID</label>
                  <Input
                    required
                    value={formData.nationalId}
                    onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                    className="border bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">Employee ID</label>
                  <Input
                    required
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    className="border bg-background"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">Department</label>
                  <Input
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
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

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-muted-foreground">Employment Type</label>
                <Select
                  value={formData.employmentType}
                  onValueChange={(val) => setFormData({ ...formData, employmentType: val })}
                >
                  <SelectTrigger className="border bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-Time</SelectItem>
                    <SelectItem value="part-time">Part-Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="intern">Intern</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-muted-foreground">
                  Password {selectedUser && "(Leave blank to keep current)"}
                </label>
                <Input
                  type="password"
                  required={!selectedUser}
                  placeholder={selectedUser ? "••••••••" : ""}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="border bg-background"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">System Privilege</label>
                  <Select
                    value={formData.roles.includes("admin") ? "admin" : formData.roles.includes("hr") ? "hr" : "employee"}
                    onValueChange={(val) => setFormData({ ...formData, roles: [val] })}
                  >
                    <SelectTrigger className="border bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="hr">HR Representative</SelectItem>
                      <SelectItem value="employee">Employee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter className="pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-medium" disabled={loading}>
                  {loading ? "Processing..." : selectedUser ? "Save Updates" : "Add Operator"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="max-w-md border bg-card">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center text-red-600">
                <ShieldAlert className="h-5 w-5 mr-2" />
                Revoke Operator Access?
              </DialogTitle>
              <DialogDescription>
                This will permanently revoke system access for <strong className="text-foreground">{selectedUser?.firstName} {selectedUser?.lastName}</strong>. They will no longer be able to log in to SHAFDB. This action is irreversible.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={loading}>
                Dismiss
              </Button>
              <Button type="button" className="bg-red-600 hover:bg-red-700 text-white font-medium" onClick={handleDeleteUser} disabled={loading}>
                {loading ? "Revoking..." : "Revoke Access"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </SidebarInset>
    </SidebarProvider>
  );
}
