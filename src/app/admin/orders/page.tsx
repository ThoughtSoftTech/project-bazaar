"use client";
import React, { useEffect, useState } from 'react';
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle,
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
    Check, CheckCircle, ChevronDown, Clock, Eye,
    Filter, Package, Search, SortAsc, SortDesc
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAPI } from '@/lib/api';
import Link from 'next/link';

interface Order {
    _id: string;
    orderId: string;
    userId: string;
    userName: string;
    userEmail: string;
    products: Array<{
        id: string;
        name: string;
        price: number;
        quantity: number;
    }>;
    totalAmount: number;
    paymentStatus: 'paid' | 'pending' | 'failed';
    orderStatus: 'processing' | 'shipped' | 'delivered' | 'completed';
    createdAt: string;
    updatedAt: string;
}

export default function AdminOrders() {
    const { user, token } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortField, setSortField] = useState<keyof Order>('createdAt');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            if (user?.isAdmin) {
                try {
                    setIsLoading(true);
                    // In a real app, this would fetch from your backend
                    const orderData = await fetchAPI('/api/admin/orders', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    // If API call fails, use sample data for development
                    setOrders(orderData || getSampleOrders());
                } catch (error) {
                    console.error('Error fetching orders:', error);
                    // Use sample data for development
                    setOrders(getSampleOrders());
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchOrders();
    }, [user, token]);

    const getSampleOrders = (): Order[] => {
        return [
            {
                _id: '1',
                orderId: 'ORD-2023042',
                userId: 'user1',
                userName: 'John Doe',
                userEmail: 'john@example.com',
                products: [
                    {
                        id: 'web-Web-001',
                        name: 'Web Development Project',
                        price: 3500,
                        quantity: 1
                    }
                ],
                totalAmount: 3500,
                paymentStatus: 'paid',
                orderStatus: 'processing',
                createdAt: '2023-04-10T10:30:00Z',
                updatedAt: '2023-04-10T10:30:00Z'
            },
            {
                _id: '2',
                orderId: 'ORD-2023041',
                userId: 'user2',
                userName: 'Sarah Chen',
                userEmail: 'sarah@example.com',
                products: [
                    {
                        id: 'ai-AI-002',
                        name: 'AI Project',
                        price: 5500,
                        quantity: 1
                    }
                ],
                totalAmount: 5500,
                paymentStatus: 'paid',
                orderStatus: 'completed',
                createdAt: '2023-04-05T09:15:00Z',
                updatedAt: '2023-04-08T14:20:00Z'
            },
            {
                _id: '3',
                orderId: 'ORD-2023040',
                userId: 'user3',
                userName: 'Michael Brown',
                userEmail: 'michael@example.com',
                products: [
                    {
                        id: 'game-Game-001',
                        name: 'Game Development Project',
                        price: 4200,
                        quantity: 1
                    }
                ],
                totalAmount: 4200,
                paymentStatus: 'paid',
                orderStatus: 'shipped',
                createdAt: '2023-04-02T16:45:00Z',
                updatedAt: '2023-04-04T11:30:00Z'
            },
        ];
    };

    const handleMarkAsCompleted = async (orderId: string) => {
        if (user?.isAdmin) {
            try {
                // In a real app, this would update your backend
                await fetchAPI(`/api/admin/orders/${orderId}/complete`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                // Update local state
                setOrders(orders.map(order =>
                    order._id === orderId
                        ? { ...order, orderStatus: 'completed', updatedAt: new Date().toISOString() }
                        : order
                ));
            } catch (error) {
                console.error('Error updating order status:', error);
                // For development, update the UI anyway
                setOrders(orders.map(order =>
                    order._id === orderId
                        ? { ...order, orderStatus: 'completed', updatedAt: new Date().toISOString() }
                        : order
                ));
            }
        }
    };

    const handleSort = (field: keyof Order) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Sort and filter orders
    const filteredOrders = orders
        .filter(order => {
            // Apply search filter
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                return (
                    order.orderId.toLowerCase().includes(searchLower) ||
                    order.userName.toLowerCase().includes(searchLower) ||
                    order.userEmail.toLowerCase().includes(searchLower)
                );
            }
            return true;
        })
        .filter(order => {
            // Apply status filter
            if (filterStatus) {
                return order.orderStatus === filterStatus;
            }
            return true;
        })
        .sort((a, b) => {
            // Apply sorting
            const fieldA = a[sortField];
            const fieldB = b[sortField];

            if (typeof fieldA === 'string' && typeof fieldB === 'string') {
                return sortDirection === 'asc'
                    ? fieldA.localeCompare(fieldB)
                    : fieldB.localeCompare(fieldA);
            }

            if (typeof fieldA === 'number' && typeof fieldB === 'number') {
                return sortDirection === 'asc'
                    ? fieldA - fieldB
                    : fieldB - fieldA;
            }

            return 0;
        });

    // Format date to readable string
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get status badge
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'processing':
                return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Processing</Badge>;
            case 'shipped':
                return <Badge variant="outline" className="bg-blue-100 text-blue-800">Shipped</Badge>;
            case 'delivered':
                return <Badge variant="outline" className="bg-indigo-100 text-indigo-800">Delivered</Badge>;
            case 'completed':
                return <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    // If loading
    if (isLoading) {
        return <div className="p-8 text-center">Loading orders...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold">Orders Management</h1>

                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search input */}
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search orders..."
                            className="pl-8 w-full md:w-[250px]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Filter dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-10">
                                <Filter className="h-4 w-4 mr-2" />
                                Filter
                                <ChevronDown className="h-4 w-4 ml-2" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setFilterStatus(null)}>
                                All Statuses
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterStatus('processing')}>
                                Processing
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterStatus('shipped')}>
                                Shipped
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterStatus('delivered')}>
                                Delivered
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterStatus('completed')}>
                                Completed
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Orders</CardTitle>
                    <CardDescription>
                        Manage and track all customer orders.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead
                                        className="cursor-pointer"
                                        onClick={() => handleSort('orderId')}
                                    >
                                        <div className="flex items-center">
                                            Order ID
                                            {sortField === 'orderId' && (
                                                sortDirection === 'asc' ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
                                            )}
                                        </div>
                                    </TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Products</TableHead>
                                    <TableHead
                                        className="cursor-pointer"
                                        onClick={() => handleSort('totalAmount')}
                                    >
                                        <div className="flex items-center">
                                            Amount
                                            {sortField === 'totalAmount' && (
                                                sortDirection === 'asc' ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
                                            )}
                                        </div>
                                    </TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead
                                        className="cursor-pointer"
                                        onClick={() => handleSort('createdAt')}
                                    >
                                        <div className="flex items-center">
                                            Date
                                            {sortField === 'createdAt' && (
                                                sortDirection === 'asc' ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
                                            )}
                                        </div>
                                    </TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredOrders.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                                            No orders found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredOrders.map((order) => (
                                        <TableRow key={order._id}>
                                            <TableCell className="font-medium">
                                                {order.orderId}
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">{order.userName}</div>
                                                <div className="text-sm text-muted-foreground">{order.userEmail}</div>
                                            </TableCell>
                                            <TableCell>
                                                {order.products.map(product => (
                                                    <div key={product.id} className="text-sm">
                                                        {product.name} × {product.quantity}
                                                    </div>
                                                ))}
                                            </TableCell>
                                            <TableCell>₹{order.totalAmount.toLocaleString()}</TableCell>
                                            <TableCell>
                                                {getStatusBadge(order.orderStatus)}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(order.createdAt)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {order.orderStatus !== 'completed' ? (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleMarkAsCompleted(order._id)}
                                                            className="h-8 px-2"
                                                        >
                                                            <CheckCircle className="h-4 w-4 mr-1" />
                                                            Mark Completed
                                                        </Button>
                                                    ) : (
                                                        <Badge variant="outline" className="bg-green-50 text-green-600">
                                                            <Check className="h-3 w-3 mr-1" /> Completed
                                                        </Badge>
                                                    )}

                                                    <Button size="icon" variant="ghost" className="h-8 w-8">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}