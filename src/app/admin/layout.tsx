"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Package, ClipboardList, Settings, LogOut } from 'lucide-react';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    // Redirect if not admin - client side
    React.useEffect(() => {
        if (!user?.isAdmin) {
            window.location.href = '/login';
        }
    }, [user]);

    if (!user?.isAdmin) {
        return null;
    }

    return (
        <div className="min-h-screen bg-muted/20">
            <header className="bg-primary text-white p-4 shadow-md">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold">Project Bazaar Admin</h1>
                    <div className="flex items-center gap-4">
                        <span>Welcome, Admin</span>
                        <Button variant="outline" size="sm" onClick={logout} className="text-white hover:text-primary">
                            <LogOut className="h-4 w-4 mr-2" /> Logout
                        </Button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-4 md:col-span-1 h-fit">
                    <Tabs defaultValue="dashboard" orientation="vertical" className="w-full">
                        <TabsList className="flex flex-col h-full w-full bg-transparent gap-2">
                            <Link href="/admin/dashboard" className="w-full">
                                <TabsTrigger
                                    value="dashboard"
                                    className={`w-full justify-start ${pathname === '/admin/dashboard' ? 'bg-primary text-white' : ''}`}
                                >
                                    <Home className="mr-2 h-4 w-4" /> Dashboard
                                </TabsTrigger>
                            </Link>
                            <Link href="/admin/orders" className="w-full">
                                <TabsTrigger
                                    value="orders"
                                    className={`w-full justify-start ${pathname === '/admin/orders' ? 'bg-primary text-white' : ''}`}
                                >
                                    <Package className="mr-2 h-4 w-4" /> Orders
                                </TabsTrigger>
                            </Link>
                            <Link href="/admin/custom-requests" className="w-full">
                                <TabsTrigger
                                    value="custom"
                                    className={`w-full justify-start ${pathname === '/admin/custom-requests' ? 'bg-primary text-white' : ''}`}
                                >
                                    <ClipboardList className="mr-2 h-4 w-4" /> Custom Requests
                                </TabsTrigger>
                            </Link>
                            <Link href="/admin/settings" className="w-full">
                                <TabsTrigger
                                    value="settings"
                                    className={`w-full justify-start ${pathname === '/admin/settings' ? 'bg-primary text-white' : ''}`}
                                >
                                    <Settings className="mr-2 h-4 w-4" /> Settings
                                </TabsTrigger>
                            </Link>
                        </TabsList>
                    </Tabs>
                </Card>

                <div className="md:col-span-3">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;