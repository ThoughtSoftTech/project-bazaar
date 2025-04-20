"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
    Home, Package, ClipboardList, Settings, LogOut,
    Users, BarChart3, FileText, Tag, ShieldAlert,
    Bell, ChevronLeft, ChevronRight, Menu, Cpu,
    Activity, LineChart, Layers, Database, Globe,
    AlertTriangle, UserPlus, Zap, CheckCircle2,
    Mail, MessageSquare, HelpCircle, BookOpen,
    CreditCard, LayoutGrid, Inbox, PanelRight,
    Rocket, FileBarChart, Ruler, Palette, Code,
    Calendar, Newspaper, BarChart2, ShoppingBag,
    PieChart, FileCog, Aperture, BookMarkedIcon
} from 'lucide-react';
import {
    Sidebar,
    SidebarMenu,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarTrigger,
    SidebarGroup,
    SidebarSeparator,
    SidebarProvider,
    SidebarMenuButton,
    SidebarMenuSubButton
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [notifications, setNotifications] = useState(3);
    const [currentTime, setCurrentTime] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);
    const [sidebarGroups, setSidebarGroups] = useState<string[]>([
        'main', 'content', 'users', 'analytics', 'system'
    ]);
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
        main: true,
        content: true,
        users: true,
        analytics: true,
        system: true
    });

    // Update current time
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }));
        };

        updateTime();
        const interval = setInterval(updateTime, 60000);

        return () => clearInterval(interval);
    }, []);

    // Redirect if not admin - client side
    useEffect(() => {
        if (!user?.isAdmin) {
            window.location.href = '/login';
        }
    }, [user]);

    if (!user?.isAdmin) {
        return null;
    }

    const toggleGroup = (group: string) => {
        setExpandedGroups(prev => ({
            ...prev,
            [group]: !prev[group]
        }));
    };

    // Menu items organized by category
    const menuGroups = {
        main: [
            {
                href: '/admin/dashboard',
                icon: <Home className="h-4 w-4" />,
                label: 'Dashboard',
                active: pathname === '/admin/dashboard'
            },
            {
                href: '/admin/activity',
                icon: <Activity className="h-4 w-4" />,
                label: 'Recent Activity',
                active: pathname.includes('/admin/activity')
            }
        ],
        content: [
            {
                href: '/admin/projects',
                icon: <FileText className="h-4 w-4" />,
                label: 'Projects',
                active: pathname.includes('/admin/projects'),
                submenu: [
                    {
                        href: '/admin/projects/all',
                        label: 'All Projects',
                        active: pathname === '/admin/projects/all'
                    },
                    {
                        href: '/admin/projects/categories',
                        label: 'Categories',
                        active: pathname === '/admin/projects/categories'
                    },
                    {
                        href: '/admin/projects/new',
                        label: 'Add New',
                        active: pathname === '/admin/projects/new'
                    },
                    {
                        href: '/admin/projects/featured',
                        label: 'Featured Projects',
                        active: pathname === '/admin/projects/featured'
                    }
                ]
            },
            {
                href: '/admin/orders',
                icon: <Package className="h-4 w-4" />,
                label: 'Orders',
                badge: '12',
                badgeClass: 'bg-primary text-primary-foreground',
                active: pathname.includes('/admin/orders'),
                submenu: [
                    {
                        href: '/admin/orders/all',
                        label: 'All Orders',
                        active: pathname === '/admin/orders/all'
                    },
                    {
                        href: '/admin/orders/pending',
                        label: 'Pending',
                        badge: '8',
                        active: pathname === '/admin/orders/pending'
                    },
                    {
                        href: '/admin/orders/completed',
                        label: 'Completed',
                        active: pathname === '/admin/orders/completed'
                    }
                ]
            },
            {
                href: '/admin/custom-requests',
                icon: <ClipboardList className="h-4 w-4" />,
                label: 'Custom Requests',
                badge: '5',
                badgeClass: 'bg-accent text-accent-foreground',
                active: pathname.includes('/admin/custom-requests')
            }
        ],
        users: [
            {
                href: '/admin/users',
                icon: <Users className="h-4 w-4" />,
                label: 'User Management',
                active: pathname.includes('/admin/users'),
                submenu: [
                    {
                        href: '/admin/users/all',
                        label: 'All Users',
                        active: pathname === '/admin/users/all'
                    },
                    {
                        href: '/admin/users/customers',
                        label: 'Customers',
                        active: pathname === '/admin/users/customers'
                    },
                    {
                        href: '/admin/users/admins',
                        label: 'Administrators',
                        active: pathname === '/admin/users/admins'
                    }
                ]
            },
            {
                href: '/admin/communications',
                icon: <MessageSquare className="h-4 w-4" />,
                label: 'Communications',
                active: pathname.includes('/admin/communications'),
                submenu: [
                    {
                        href: '/admin/communications/messages',
                        label: 'Messages',
                        badge: '3',
                        active: pathname === '/admin/communications/messages'
                    },
                    {
                        href: '/admin/communications/emails',
                        label: 'Email Campaigns',
                        active: pathname === '/admin/communications/emails'
                    },
                    {
                        href: '/admin/communications/notifications',
                        label: 'Notifications',
                        active: pathname === '/admin/communications/notifications'
                    }
                ]
            }
        ],
        analytics: [
            {
                href: '/admin/analytics',
                icon: <BarChart3 className="h-4 w-4" />,
                label: 'Analytics',
                active: pathname.includes('/admin/analytics'),
                submenu: [
                    {
                        href: '/admin/analytics/overview',
                        label: 'Overview',
                        active: pathname === '/admin/analytics/overview'
                    },
                    {
                        href: '/admin/analytics/sales',
                        label: 'Sales Metrics',
                        active: pathname === '/admin/analytics/sales'
                    },
                    {
                        href: '/admin/analytics/traffic',
                        label: 'Traffic Sources',
                        active: pathname === '/admin/analytics/traffic'
                    }
                ]
            },
            {
                href: '/admin/reports',
                icon: <FileBarChart className="h-4 w-4" />,
                label: 'Reports',
                active: pathname.includes('/admin/reports'),
                submenu: [
                    {
                        href: '/admin/reports/sales',
                        label: 'Sales Reports',
                        active: pathname === '/admin/reports/sales'
                    },
                    {
                        href: '/admin/reports/custom',
                        label: 'Custom Reports',
                        active: pathname === '/admin/reports/custom'
                    },
                    {
                        href: '/admin/reports/export',
                        label: 'Export Data',
                        active: pathname === '/admin/reports/export'
                    }
                ]
            },
            {
                href: '/admin/marketing',
                icon: <Tag className="h-4 w-4" />,
                label: 'Marketing',
                active: pathname.includes('/admin/marketing')
            }
        ],
        system: [
            {
                href: '/admin/settings',
                icon: <Settings className="h-4 w-4" />,
                label: 'Settings',
                active: pathname.includes('/admin/settings'),
                submenu: [
                    {
                        href: '/admin/settings/general',
                        label: 'General',
                        active: pathname === '/admin/settings/general'
                    },
                    {
                        href: '/admin/settings/appearance',
                        label: 'Appearance',
                        active: pathname === '/admin/settings/appearance'
                    },
                    {
                        href: '/admin/settings/payment',
                        label: 'Payment',
                        active: pathname === '/admin/settings/payment'
                    }
                ]
            },
            {
                href: '/admin/databases',
                icon: <Database className="h-4 w-4" />,
                label: 'Database',
                active: pathname.includes('/admin/databases')
            },
            {
                href: '/admin/security',
                icon: <ShieldAlert className="h-4 w-4" />,
                label: 'Security',
                badge: '!',
                badgeClass: 'bg-destructive text-destructive-foreground',
                active: pathname.includes('/admin/security')
            }
        ]
    };

    // Group labels for sidebar organization
    const groupLabels: Record<string, string> = {
        main: 'Overview',
        content: 'Content Management',
        users: 'User Management',
        analytics: 'Analytics & Reporting',
        system: 'System Settings'
    };

    // Mock notifications data
    const notificationItems = [
        {
            id: 'n1',
            title: 'New Order',
            message: 'New order #2025053 received',
            time: '5 min ago',
            read: false,
            icon: <Package className="h-4 w-4" />
        },
        {
            id: 'n2',
            title: 'System Alert',
            message: 'Server load is high (85%)',
            time: '15 min ago',
            read: false,
            icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />
        },
        {
            id: 'n3',
            title: 'New User',
            message: 'Rahul Singh just registered',
            time: '1 hour ago',
            read: true,
            icon: <UserPlus className="h-4 w-4 text-green-500" />
        }
    ];

    const getPageTitle = () => {
        // More specific routes first
        if (pathname.includes('/admin/orders/details')) return 'Order Details';
        if (pathname.includes('/admin/orders/pending')) return 'Pending Orders';
        if (pathname.includes('/admin/orders/completed')) return 'Completed Orders';
        if (pathname.includes('/admin/projects/categories')) return 'Project Categories';
        if (pathname.includes('/admin/projects/new')) return 'Add New Project';
        if (pathname.includes('/admin/projects/all')) return 'All Projects';

        // Then check for section routes
        if (pathname === '/admin/dashboard') return 'Dashboard';
        if (pathname.includes('/admin/orders')) return 'Orders Management';
        if (pathname.includes('/admin/custom-requests')) return 'Custom Project Requests';
        if (pathname.includes('/admin/users')) return 'Users Management';
        if (pathname.includes('/admin/projects')) return 'Projects Management';
        if (pathname.includes('/admin/settings')) return 'Admin Settings';
        if (pathname.includes('/admin/analytics')) return 'Analytics Dashboard';
        if (pathname.includes('/admin/marketing')) return 'Marketing Tools';
        if (pathname.includes('/admin/databases')) return 'Database Management';
        if (pathname.includes('/admin/security')) return 'Security Controls';

        return 'Admin Panel';
    };

    // Quick actions for the header
    const quickActions = [
        { label: 'New Project', icon: <FileText className="h-3 w-3" />, href: '/admin/projects/new' },
        { label: 'New User', icon: <UserPlus className="h-3 w-3" />, href: '/admin/users/new' },
        { label: 'View Site', icon: <Globe className="h-3 w-3" />, href: '/' }
    ];

    return (
        <SidebarProvider
            open={!collapsed}
            onOpenChange={(open) => setCollapsed(!open)}
        >
            <div className="min-h-screen bg-background">
                <div className="flex h-screen">
                    <Sidebar
                        className="border-r h-full shadow-sm bg-card/80 backdrop-blur-sm"
                        collapsible="icon"
                    >
                        <SidebarHeader className="py-3">
                            <div className="flex items-center gap-2 px-4">
                                <div className="relative">
                                    <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                                        <AvatarImage src="/logo.png" alt="Project Bazaar" />
                                        <AvatarFallback className="bg-primary text-primary-foreground">PB</AvatarFallback>
                                    </Avatar>
                                    <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-background"></span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-lg cyber-gradient">Admin</span>
                                    <span className="text-xs text-muted-foreground">Project Bazaar</span>
                                </div>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="ml-auto h-8 w-8 hover:bg-muted/50 transition-all duration-200"
                                    onClick={() => setCollapsed(!collapsed)}
                                >
                                    {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                                </Button>
                            </div>
                        </SidebarHeader>

                        <SidebarContent>
                            <ScrollArea className="h-[70vh] px-2">
                                {sidebarGroups.map((groupKey) => (
                                    <div key={groupKey} className="mb-2">
                                        <div
                                            className="flex items-center justify-between px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground"
                                            onClick={() => toggleGroup(groupKey)}
                                        >
                                            <span>{groupLabels[groupKey]}</span>
                                            <ChevronRight
                                                className={`h-4 w-4 transition-transform ${expandedGroups[groupKey] ? 'rotate-90' : ''}`}
                                            />
                                        </div>

                                        {expandedGroups[groupKey] && (
                                            <SidebarMenu>
                                                {menuGroups[groupKey as keyof typeof menuGroups].map((item) => (
                                                    <SidebarMenuItem key={item.href}>
                                                        {'submenu' in item && item.submenu ? (
                                                            <>
                                                                <SidebarMenuButton
                                                                    isActive={item.active}
                                                                    className="w-full justify-between rounded-md"
                                                                >
                                                                    <span className="flex items-center gap-2">
                                                                        <span className={cn("p-1.5 rounded-md", item.active ? "bg-primary/20" : "bg-muted/50")}>
                                                                            {item.icon}
                                                                        </span>
                                                                        <span>{item.label}</span>
                                                                    </span>
                                                                    {'badge' in item && item.badge && (
                                                                        <Badge className={`text-xs h-5 ${'badgeClass' in item ? item.badgeClass : ""}`}>
                                                                            {item.badge}
                                                                        </Badge>
                                                                    )}
                                                                </SidebarMenuButton>
                                                                <SidebarMenuSub>
                                                                    {item.submenu?.map((subItem) => (
                                                                        <SidebarMenuSubItem key={subItem.href}>
                                                                            <SidebarMenuSubButton
                                                                                onClick={() => window.location.href = subItem.href}
                                                                                isActive={subItem.active}
                                                                                className="rounded-md pl-9"
                                                                            >
                                                                                <div className="flex items-center justify-between w-full">
                                                                                    <span>{subItem.label}</span>
                                                                                    {'badge' in subItem && subItem.badge && (
                                                                                        <Badge variant="outline" className="ml-auto text-[10px] h-4">
                                                                                            {subItem.badge}
                                                                                        </Badge>
                                                                                    )}
                                                                                </div>
                                                                            </SidebarMenuSubButton>
                                                                        </SidebarMenuSubItem>
                                                                    ))}
                                                                </SidebarMenuSub>
                                                            </>
                                                        ) : (
                                                            <motion.div
                                                                whileHover={{ x: 2 }}
                                                                transition={{ type: 'spring', stiffness: 300 }}
                                                            >
                                                                <Link href={item.href}>
                                                                    <SidebarMenuButton
                                                                        isActive={item.active}
                                                                        className="w-full justify-between rounded-md"
                                                                    >
                                                                        <span className="flex items-center gap-2">
                                                                            <span className={cn("p-1.5 rounded-md", item.active ? "bg-primary/20" : "bg-muted/50")}>
                                                                                {item.icon}
                                                                            </span>
                                                                            <span>{item.label}</span>
                                                                        </span>
                                                                        {'badge' in item && item.badge && (
                                                                            <Badge className={`text-xs h-5 ${item.badgeClass || ""}`}>
                                                                                {item.badge}
                                                                            </Badge>
                                                                        )}
                                                                    </SidebarMenuButton>
                                                                </Link>
                                                            </motion.div>
                                                        )}
                                                    </SidebarMenuItem>
                                                ))}
                                            </SidebarMenu>
                                        )}
                                    </div>
                                ))}

                                <div className="mt-6 px-4">
                                    <div className="p-3 rounded-lg border border-dashed bg-muted/30 text-center space-y-2">
                                        <HelpCircle className="h-4 w-4 mx-auto text-muted-foreground" />
                                        <h4 className="text-xs font-medium">Need Help?</h4>
                                        <p className="text-xs text-muted-foreground">Check our documentation or contact support</p>
                                        <Button variant="outline" size="sm" className="w-full text-xs">
                                            <BookOpen className="h-3 w-3 mr-1" /> Documentation
                                        </Button>
                                    </div>
                                </div>
                            </ScrollArea>
                        </SidebarContent>

                        <SidebarSeparator />

                        <SidebarFooter>
                            <SidebarGroup>
                                <div className="p-3 flex items-center gap-3">
                                    <Avatar className="h-9 w-9 ring-2 ring-border">
                                        <AvatarImage src={undefined} />
                                        <AvatarFallback className="bg-secondary text-secondary-foreground">
                                            {user?.name?.charAt(0) || 'A'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">{user?.name || 'Admin User'}</span>
                                        <span className="text-xs text-muted-foreground">Administrator</span>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full flex items-center gap-2 cyber-button"
                                    onClick={logout}
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Logout</span>
                                </Button>
                            </SidebarGroup>
                        </SidebarFooter>
                    </Sidebar>

                    <main className="flex-1 flex flex-col overflow-auto">
                        <header className="border-b bg-card/80 backdrop-blur-md shadow-sm sticky top-0 z-10">
                            <div className="h-16 flex items-center gap-4 px-6">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="md:hidden"
                                    onClick={() => setCollapsed(!collapsed)}
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>

                                <motion.div
                                    className="hidden md:flex items-center gap-2 border-r pr-4"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="bg-primary/10 p-1.5 rounded-md">
                                        {pathname.includes('/admin/dashboard') ? <Home className="h-5 w-5 text-primary" /> :
                                            pathname.includes('/admin/orders') ? <Package className="h-5 w-5 text-primary" /> :
                                                pathname.includes('/admin/projects') ? <FileText className="h-5 w-5 text-primary" /> :
                                                    pathname.includes('/admin/users') ? <Users className="h-5 w-5 text-primary" /> :
                                                        pathname.includes('/admin/analytics') ? <BarChart3 className="h-5 w-5 text-primary" /> :
                                                            pathname.includes('/admin/settings') ? <Settings className="h-5 w-5 text-primary" /> :
                                                                pathname.includes('/admin/security') ? <ShieldAlert className="h-5 w-5 text-primary" /> :
                                                                    pathname.includes('/admin/custom-requests') ? <ClipboardList className="h-5 w-5 text-primary" /> :
                                                                        <Cpu className="h-5 w-5 text-primary" />}
                                    </div>
                                    <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
                                </motion.div>

                                <div className="flex items-center gap-2 ml-auto">
                                    {quickActions.map((action, index) => (
                                        <Link key={index} href={action.href}>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="hidden md:flex items-center gap-1 h-8 text-xs hover:bg-muted/50"
                                            >
                                                {action.icon}
                                                {action.label}
                                            </Button>
                                        </Link>
                                    ))}

                                    <div className="h-6 border-l mx-2 hidden md:block"></div>

                                    <div className="hidden md:block">
                                        <span className="text-sm text-muted-foreground">{currentTime}</span>
                                    </div>

                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="relative"
                                                    onClick={() => setShowNotifications(!showNotifications)}
                                                >
                                                    <Bell className="h-5 w-5" />
                                                    {notifications > 0 && (
                                                        <span className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full text-[10px] flex items-center justify-center text-white">{notifications}</span>
                                                    )}
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Notifications</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

                                    <div className="hidden md:flex items-center gap-2">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="outline" size="sm" className="glass-effect">
                                                        <Cpu className="h-4 w-4 mr-1" />
                                                        <span className="relative flex h-2 w-2">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                                        </span>
                                                        System Status
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>All systems operational</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>
                            </div>

                            {/* Breadcrumb navigation - optional */}
                            <div className="px-6 py-1 border-t flex items-center text-xs text-muted-foreground">
                                <Link href="/admin/dashboard" className="hover:text-primary">Admin</Link>
                                {pathname !== '/admin/dashboard' && pathname.split('/').slice(2).map((segment, i, arr) => (
                                    <React.Fragment key={i}>
                                        <span className="mx-1">/</span>
                                        {i === arr.length - 1 ? (
                                            <span className="text-foreground capitalize">
                                                {segment.replace(/-/g, ' ')}
                                            </span>
                                        ) : (
                                            <Link
                                                href={`/admin/${arr.slice(0, i + 1).join('/')}`}
                                                className="hover:text-primary capitalize"
                                            >
                                                {segment.replace(/-/g, ' ')}
                                            </Link>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>

                            {/* Notification dropdown */}
                            {showNotifications && (
                                <div className="absolute top-16 right-6 w-80 bg-card border rounded-lg shadow-lg overflow-hidden z-20">
                                    <div className="p-3 border-b bg-muted/30 flex justify-between items-center">
                                        <h3 className="font-medium">Notifications</h3>
                                        <Badge variant="outline">{notifications} new</Badge>
                                    </div>
                                    <ScrollArea className="h-64">
                                        <div className="p-2">
                                            {notificationItems.map(notification => (
                                                <div
                                                    key={notification.id}
                                                    className={`p-2 border-b last:border-b-0 ${notification.read ? '' : 'bg-muted/20'} hover:bg-muted/30 rounded-md mb-1 cursor-pointer`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                            {notification.icon}
                                                        </div>
                                                        <div>
                                                            <div className="flex justify-between">
                                                                <p className="text-sm font-medium">{notification.title}</p>
                                                                <span className="text-xs text-muted-foreground">{notification.time}</span>
                                                            </div>
                                                            <p className="text-xs mt-1">{notification.message}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                    <div className="p-2 border-t bg-muted/30">
                                        <Button variant="ghost" size="sm" className="w-full text-xs">View all notifications</Button>
                                    </div>
                                </div>
                            )}
                        </header>

                        <div className="flex-1 p-6 overflow-auto bg-muted/10">
                            {children}
                        </div>

                        <footer className="border-t py-3 px-6 text-center text-xs text-muted-foreground bg-card/50">
                            <div className="flex items-center justify-between">
                                <p>© {new Date().getFullYear()} Project Bazaar Admin Dashboard • All rights reserved</p>
                                <div className="flex items-center gap-4">
                                    <Link href="/admin/help" className="hover:text-primary">Help</Link>
                                    <Link href="/admin/support" className="hover:text-primary">Support</Link>
                                    <Link href="/admin/privacy" className="hover:text-primary">Privacy</Link>
                                </div>
                            </div>
                        </footer>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
};

export default AdminLayout;