import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AdminSidebar } from "@/components/AdminSidebar";
import {
    Users,
    Droplet,
    Heart,
    TrendingUp,
    Clock,
    CheckCircle2,
    XCircle,
    LogOut,
    Shield,
    Activity,
} from "lucide-react";
import type { Donor, BloodRequest, AdminStats } from "@/types";
import { ApprovalStatus, UrgencyLevel, UserRole } from "@/types";
import { bloodGroupDisplay, urgencyDisplay } from "@/lib/enum-utils";

export default function AdminPanel() {
    const [, setLocation] = useLocation();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState("overview");

    // Check if user is admin
    const { data: currentUser, isLoading: userLoading } = useQuery<{ role: UserRole; name: string } | null>({
        queryKey: ["/api/auth/me"],
        retry: false,
    });

    // Get admin stats
    const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
        queryKey: ["/api/stats/admin"],
        enabled: currentUser?.role === UserRole.ADMIN,
    });

    // Get pending donors
    const { data: donors } = useQuery<Donor[]>({
        queryKey: ["/api/donors"],
        enabled: currentUser?.role === UserRole.ADMIN,
    });

    // Get pending blood requests
    const { data: requests } = useQuery<BloodRequest[]>({
        queryKey: ["/api/blood-requests"],
        enabled: currentUser?.role === UserRole.ADMIN,
    });

    // Approve/Reject donor mutation
    const approveDonorMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: ApprovalStatus }) => {
            const response = await fetch(`/api/donors/${id}/approval`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ approvalStatus: status }),
            });
            if (!response.ok) throw new Error("Failed to update donor status");
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/donors"] });
            queryClient.invalidateQueries({ queryKey: ["/api/stats/admin"] });
        },
    });

    // Approve/Reject request mutation
    const approveRequestMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: ApprovalStatus }) => {
            const response = await fetch(`/api/blood-requests/${id}/approval`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ approvalStatus: status }),
            });
            if (!response.ok) throw new Error("Failed to update request status");
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/blood-requests"] });
            queryClient.invalidateQueries({ queryKey: ["/api/stats/admin"] });
        },
    });

    // Logout mutation
    const logoutMutation = useMutation({
        mutationFn: async () => {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });
            if (!response.ok) throw new Error("Logout failed");
            return response.json();
        },
        onSuccess: () => {
            localStorage.removeItem("user");
            setLocation("/login");
        },
    });

    if (userLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    // Redirect if not admin
    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4">
                <Alert variant="destructive" className="max-w-md">
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                        Access denied. You don't have permission to view this page.
                        <Button
                            variant="ghost"
                            className="ml-2"
                            onClick={() => setLocation("/login")}
                        >
                            Go to Login
                        </Button>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    const pendingDonors = donors?.filter((d) => d.approvalStatus === ApprovalStatus.PENDING) || [];
    const pendingRequests = requests?.filter((r) => r.approvalStatus === ApprovalStatus.PENDING) || [];

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />

            <div className="flex-1 p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
                        <p className="text-gray-600 mt-1">Manage blood donation operations</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                            <Badge variant="outline" className="mt-1">
                                <Shield className="w-3 h-3 mr-1" />
                                Admin
                            </Badge>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => logoutMutation.mutate()}
                            disabled={logoutMutation.isPending}
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="overview">
                            <Activity className="w-4 h-4 mr-2" />
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="donors">
                            <Users className="w-4 h-4 mr-2" />
                            Donors
                            {pendingDonors.length > 0 && (
                                <Badge variant="destructive" className="ml-2">
                                    {pendingDonors.length}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="requests">
                            <Heart className="w-4 h-4 mr-2" />
                            Requests
                            {pendingRequests.length > 0 && (
                                <Badge variant="destructive" className="ml-2">
                                    {pendingRequests.length}
                                </Badge>
                            )}
                        </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        Total Donors
                                    </CardTitle>
                                    <Users className="w-4 h-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">{stats?.totalDonors || 0}</div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {stats?.approvedDonors || 0} approved
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        Pending Approvals
                                    </CardTitle>
                                    <Clock className="w-4 h-4 text-amber-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-amber-600">
                                        {stats?.pendingDonors || 0}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">Donors awaiting approval</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        Active Requests
                                    </CardTitle>
                                    <Heart className="w-4 h-4 text-red-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-red-600">
                                        {stats?.activeRequests || 0}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {stats?.totalRequests || 0} total requests
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        Total Donations
                                    </CardTitle>
                                    <Droplet className="w-4 h-4 text-blue-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-blue-600">
                                        {stats?.totalDonations || 0}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {stats?.todayDonations || 0} today
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Donors Tab */}
                    <TabsContent value="donors" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Pending Donor Approvals</CardTitle>
                                <CardDescription>Review and approve new donor registrations</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {pendingDonors.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">
                                        No pending donor approvals
                                    </p>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>Blood Group</TableHead>
                                                <TableHead>City</TableHead>
                                                <TableHead>Phone</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {pendingDonors.map((donor) => (
                                                <TableRow key={donor.id}>
                                                    <TableCell className="font-medium">{donor.name}</TableCell>
                                                    <TableCell>{donor.email}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">{donor.bloodGroup}</Badge>
                                                    </TableCell>
                                                    <TableCell>{donor.city}</TableCell>
                                                    <TableCell>{donor.phone}</TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="default"
                                                                onClick={() =>
                                                                    approveDonorMutation.mutate({
                                                                        id: donor.id,
                                                                        status: ApprovalStatus.APPROVED,
                                                                    })
                                                                }
                                                                disabled={approveDonorMutation.isPending}
                                                            >
                                                                <CheckCircle2 className="w-4 h-4 mr-1" />
                                                                Approve
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={() =>
                                                                    approveDonorMutation.mutate({
                                                                        id: donor.id,
                                                                        status: ApprovalStatus.REJECTED,
                                                                    })
                                                                }
                                                                disabled={approveDonorMutation.isPending}
                                                            >
                                                                <XCircle className="w-4 h-4 mr-1" />
                                                                Reject
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Requests Tab */}
                    <TabsContent value="requests" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Pending Request Approvals</CardTitle>
                                <CardDescription>Review and approve blood requests</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {pendingRequests.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">
                                        No pending request approvals
                                    </p>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Patient</TableHead>
                                                <TableHead>Blood Group</TableHead>
                                                <TableHead>Units</TableHead>
                                                <TableHead>Hospital</TableHead>
                                                <TableHead>Location</TableHead>
                                                <TableHead>Urgency</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {pendingRequests.map((request) => (
                                                <TableRow key={request.id}>
                                                    <TableCell className="font-medium">{request.patientName}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">{request.bloodGroup}</Badge>
                                                    </TableCell>
                                                    <TableCell>{request.unitsNeeded}</TableCell>
                                                    <TableCell>{request.hospitalName}</TableCell>
                                                    <TableCell>{request.location}</TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={
                                                                request.urgencyLevel === UrgencyLevel.CRITICAL
                                                                    ? "destructive"
                                                                    : request.urgencyLevel === UrgencyLevel.HIGH || request.urgencyLevel === UrgencyLevel.MEDIUM
                                                                        ? "default"
                                                                        : "secondary"
                                                            }
                                                        >
                                                            {urgencyDisplay[request.urgencyLevel] || request.urgencyLevel}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="default"
                                                                onClick={() =>
                                                                    approveRequestMutation.mutate({
                                                                        id: request.id,
                                                                        status: ApprovalStatus.APPROVED,
                                                                    })
                                                                }
                                                                disabled={approveRequestMutation.isPending}
                                                            >
                                                                <CheckCircle2 className="w-4 h-4 mr-1" />
                                                                Approve
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={() =>
                                                                    approveRequestMutation.mutate({
                                                                        id: request.id,
                                                                        status: ApprovalStatus.REJECTED,
                                                                    })
                                                                }
                                                                disabled={approveRequestMutation.isPending}
                                                            >
                                                                <XCircle className="w-4 h-4 mr-1" />
                                                                Reject
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
