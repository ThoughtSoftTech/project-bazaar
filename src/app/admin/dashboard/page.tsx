"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Users, FileText, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAPI } from '@/lib/api';

interface DashboardStats {
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalCustomRequests: number;
    pendingCustomRequests: number;
    totalRevenue: number;
}

export default function AdminDashboard() {
    const { user, token } = useAuth();
    const [stats, setStats] = useState<DashboardStats>({
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        totalCustomRequests: 0,
        pendingCustomRequests: 0,
        totalRevenue: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (user?.isAdmin) {
                try {
                    setIsLoading(true);
                    // In a real app, these would come from your API
                    // For now, we'll simulate some stats
                    const orderData = await fetchAPI('/api/admin/stats', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    setStats(orderData || {
                        totalOrders: 24,
                        pendingOrders: 8,
                        completedOrders: 16,
                        totalCustomRequests: 12,
                        pendingCustomRequests: 5,
                        totalRevenue: 78500
                    });
                } catch (error) {
                    console.error('Error fetching admin stats:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchStats();
    }, [user, token]);

    // If loading or not admin
    if (isLoading) {
        return <div className="p-8 text-center">Loading dashboard data...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalOrders}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.pendingOrders} pending, {stats.completedOrders} completed
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Custom Requests</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalCustomRequests}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.pendingCustomRequests} pending requests
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            From all completed orders
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>
                            Latest orders and custom project requests
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="border rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                    <div className="font-medium">New order #ORD-2023042</div>
                                    <div className="text-sm text-muted-foreground">2 hours ago</div>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Web Development Project ordered by John Doe
                                </p>
                            </div>

                            <div className="border rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                    <div className="font-medium">Custom request #REQ-1034</div>
                                    <div className="text-sm text-muted-foreground">Yesterday</div>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Mobile App Development requested by Sarah Chen
                                </p>
                            </div>

                            <div className="border rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                    <div className="font-medium">Order completed #ORD-2023039</div>
                                    <div className="text-sm text-muted-foreground">3 days ago</div>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                    AI Project marked as completed
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}