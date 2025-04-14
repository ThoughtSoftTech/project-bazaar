"use client";
import React, { useEffect, useState } from 'react';
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle,
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
    Check, CheckCircle, ChevronDown, Clock, Eye,
    Filter, Package, Search, SortAsc, SortDesc, User
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAPI } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Updated Order interface to match MongoDB Atlas structure
interface OrderItem {
    _id: string;
    projectId: string;
    title: string;
    price: number;
    quantity: number;
    customization?: string;
    category?: string;
    subcategory?: string;
    image?: string;
}

interface Order {
    _id: string;
    orderId: string;
    userId: string;
    items: OrderItem[];
    totalAmount: number;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    createdAt: string;
    paymentId?: string;

    // For UI display (will fetch separately)
    customerName?: string;
    customerEmail?: string;
}

// Customer interface
interface Customer {
    _id: string;
    name: string;
    email: string;
}

export default function AdminOrders() {
    const router = useRouter();
    const { user, token } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [customers, setCustomers] = useState<{ [key: string]: Customer }>({});
    const [isLoading, setIsLoading] = useState(true);
    const [sortField, setSortField] = useState<keyof Order>('createdAt');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    // Add state for tracking admin actions
    const [adminActions, setAdminActions] = useState<{ [key: string]: boolean }>({});
    const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const fetchOrders = async () => {
            if (user?.isAdmin) {
                try {
                    setIsLoading(true);
                    // Fetch orders from your MongoDB Atlas database
                    const orderData = await fetchAPI('/api/admin/orders', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    // If API call fails, use sample data for development
                    const fetchedOrders = orderData || getSampleOrders();
                    setOrders(fetchedOrders);

                    // Fetch customer details for all orders
                    await fetchCustomerDetails(fetchedOrders);

                    // Fetch admin action status for these orders
                    await fetchAdminActions(fetchedOrders);
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

    // New function to fetch admin actions for orders
    const fetchAdminActions = async (orders: Order[]) => {
        try {
            // Get all order IDs
            const orderIds = orders.map(order => order._id);

            // Fetch admin actions for these orders
            const actionsResponse = await fetchAPI(`/api/admin/actions?type=order&ids=${orderIds.join(',')}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (actionsResponse && actionsResponse.actions) {
                // Create a mapping of order ID to completion status
                const actionMap = actionsResponse.actions.reduce((acc: { [key: string]: boolean }, action: any) => {
                    acc[action.itemId] = action.isCompleted;
                    return acc;
                }, {});

                setAdminActions(actionMap);
            }
        } catch (error) {
            console.error('Error fetching admin actions:', error);
        }
    };

    // New function to toggle order completion
    const toggleOrderCompletion = async (orderId: string, currentStatus: boolean) => {
        if (!user?.isAdmin) return;

        // Set loading state for this specific order
        setActionLoading(prev => ({ ...prev, [orderId]: true }));

        try {
            // Call our new API endpoint to update the admin action
            const response = await fetchAPI(`/api/admin/orders/${orderId}/action`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: user._id,
                    isCompleted: !currentStatus
                })
            });

            if (response && response.action) {
                // Update the admin actions state
                setAdminActions(prev => ({
                    ...prev,
                    [orderId]: response.action.isCompleted
                }));

                // If marking as completed, also update the order status
                if (response.action.isCompleted) {
                    setOrders(orders.map(order =>
                        order._id === orderId
                            ? { ...order, status: 'completed' }
                            : order
                    ));
                }

                console.log(`Order ${orderId} action updated successfully`);
            }
        } catch (error) {
            console.error('Error updating order action:', error);
        } finally {
            // Clear loading state
            setActionLoading(prev => ({ ...prev, [orderId]: false }));
        }
    };

    const fetchCustomerDetails = async (orders: Order[]) => {
        // Extract unique user IDs
        const userIds = [...new Set(orders.map(order => order.userId))];

        try {
            // Use the new bulk API endpoint to fetch all customers at once
            const response = await fetchAPI(`/api/admin/users?ids=${userIds.join(',')}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response) {
                setCustomers(response);
            } else {
                // Fallback to sample data if API returns nothing
                const fallbackData: { [key: string]: Customer } = {};
                userIds.forEach(userId => {
                    fallbackData[userId] = getSampleCustomer(userId);
                });
                setCustomers(fallbackData);
            }
        } catch (error) {
            console.error('Error fetching customer details:', error);
            // Fallback to sample data on error
            const fallbackData: { [key: string]: Customer } = {};
            userIds.forEach(userId => {
                fallbackData[userId] = getSampleCustomer(userId);
            });
            setCustomers(fallbackData);
        }
    };

    const getSampleCustomer = (userId: string): Customer => {
        // Sample customer data based on userId
        const sampleCustomers: { [key: string]: Customer } = {
            'user1': { _id: 'user1', name: 'John Doe', email: 'john@example.com' },
            'user2': { _id: 'user2', name: 'Sarah Chen', email: 'sarah@example.com' },
            'user3': { _id: 'user3', name: 'Michael Brown', email: 'michael@example.com' },
            // Default for any other userId
            'default': { _id: userId, name: 'Customer', email: 'customer@example.com' }
        };

        return sampleCustomers[userId] || sampleCustomers['default'];
    };

    const getSampleOrders = (): Order[] => {
        return [
            {
                _id: '1',
                orderId: '487af7a9-41d3-4bea-b0fe-89b0a0bd1075',
                userId: 'user1',
                items: [
                    {
                        _id: '67fbf91e4bc64ada9707e13c',
                        projectId: 'eng-Drone-002-1744566513483',
                        title: 'Aerial Photography Drone',
                        price: 5249.99,
                        quantity: 1,
                        customization: 'Standard package',
                        category: 'Engineering',
                        subcategory: 'Drone',
                        image: '/projects/drone2.png'
                    }
                ],
                totalAmount: 5249.99,
                status: 'completed',
                createdAt: '2025-04-13T17:48:52.531+00:00',
                paymentId: 'pay_QId7amNKuAqSkp'
            },
            {
                _id: '2',
                orderId: 'ORD-2023041',
                userId: 'user2',
                items: [
                    {
                        _id: '67fbf91e4bc64ada9707e13d',
                        projectId: 'ai-AI-002',
                        title: 'AI Project',
                        price: 5500,
                        quantity: 1,
                        category: 'IT',
                        subcategory: 'AI',
                        image: '/projects/ai2.png'
                    }
                ],
                totalAmount: 5500,
                status: 'completed',
                createdAt: '2023-04-05T09:15:00Z',
                paymentId: 'pay_sample123'
            },
            {
                _id: '3',
                orderId: 'ORD-2023040',
                userId: 'user3',
                items: [
                    {
                        _id: '67fbf91e4bc64ada9707e13e',
                        projectId: 'game-Game-001',
                        title: 'Game Development Project',
                        price: 4200,
                        quantity: 1,
                        category: 'IT',
                        subcategory: 'Game',
                        image: '/projects/game1.png'
                    }
                ],
                totalAmount: 4200,
                status: 'processing',
                createdAt: '2023-04-02T16:45:00Z'
            },
        ];
    };

    const handleMarkAsCompleted = async (orderId: string) => {
        if (user?.isAdmin) {
            try {
                // Call our API endpoint to update the order status in MongoDB
                await fetchAPI(`/api/admin/orders/${orderId}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ status: 'completed' })
                });

                // Update local state
                setOrders(orders.map(order =>
                    order._id === orderId
                        ? { ...order, status: 'completed' }
                        : order
                ));

                // Show success toast or notification
                console.log('Order marked as completed successfully');
            } catch (error) {
                console.error('Error updating order status:', error);
                // For development, update the UI anyway
                setOrders(orders.map(order =>
                    order._id === orderId
                        ? { ...order, status: 'completed' }
                        : order
                ));
            }
        }
    };

    const handleViewOrderDetails = (order: Order) => {
        setSelectedOrder(order);
        setShowOrderDetails(true);
    };

    const handleSort = (field: keyof Order) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Get customer name for an order
    const getCustomerName = (order: Order): string => {
        const customer = customers[order.userId];
        return customer ? customer.name : 'Unknown Customer';
    };

    // Get customer email for an order
    const getCustomerEmail = (order: Order): string => {
        const customer = customers[order.userId];
        return customer ? customer.email : 'unknown@example.com';
    };

    // Sort and filter orders
    const filteredOrders = orders
        .filter(order => {
            // Apply search filter
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                const customerName = getCustomerName(order).toLowerCase();
                const customerEmail = getCustomerEmail(order).toLowerCase();

                return (
                    order.orderId.toLowerCase().includes(searchLower) ||
                    customerName.includes(searchLower) ||
                    customerEmail.includes(searchLower) ||
                    order.items.some(item =>
                        item.title.toLowerCase().includes(searchLower) ||
                        (item.category && item.category.toLowerCase().includes(searchLower))
                    )
                );
            }
            return true;
        })
        .filter(order => {
            // Apply status filter
            if (filterStatus) {
                return order.status === filterStatus;
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
            case 'pending':
                return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
            case 'processing':
                return <Badge variant="outline" className="bg-blue-100 text-blue-800">Processing</Badge>;
            case 'completed':
                return <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>;
            case 'failed':
                return <Badge variant="outline" className="bg-red-100 text-red-800">Failed</Badge>;
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
                            <DropdownMenuItem onClick={() => setFilterStatus('pending')}>
                                Pending
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterStatus('processing')}>
                                Processing
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterStatus('completed')}>
                                Completed
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterStatus('failed')}>
                                Failed
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
                                    <TableHead>Items</TableHead>
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
                                                <div className="font-medium">{getCustomerName(order)}</div>
                                                <div className="text-sm text-muted-foreground">{getCustomerEmail(order)}</div>
                                            </TableCell>
                                            <TableCell>
                                                {order.items && order.items.length > 0 ? (
                                                    <>
                                                        <div className="text-sm font-medium">
                                                            {order.items[0].title}
                                                        </div>
                                                        {order.items.length > 1 && (
                                                            <div className="text-xs text-muted-foreground">
                                                                +{order.items.length - 1} more items
                                                            </div>
                                                        )}
                                                    </>
                                                ) : (
                                                    <div className="text-sm text-muted-foreground">No items</div>
                                                )}
                                            </TableCell>
                                            <TableCell>₹{order.totalAmount.toLocaleString()}</TableCell>
                                            <TableCell>
                                                {getStatusBadge(order.status)}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(order.createdAt)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {/* Admin action buttons - toggle completion status */}
                                                    <Button
                                                        size="sm"
                                                        variant={adminActions[order._id] ? "outline" : "default"}
                                                        onClick={() => toggleOrderCompletion(order._id, !!adminActions[order._id])}
                                                        className="h-8 px-2"
                                                        disabled={actionLoading[order._id]}
                                                    >
                                                        {actionLoading[order._id] ? (
                                                            <span className="flex items-center">
                                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                                Processing
                                                            </span>
                                                        ) : adminActions[order._id] ? (
                                                            <span className="flex items-center">
                                                                <Check className="h-4 w-4 mr-1" />
                                                                Completed
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center">
                                                                <CheckCircle className="h-4 w-4 mr-1" />
                                                                Mark Complete
                                                            </span>
                                                        )}
                                                    </Button>

                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8"
                                                        onClick={() => handleViewOrderDetails(order)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>

                                                    <Button
                                                        size="sm"
                                                        variant="default"
                                                        onClick={() => router.push(`/admin/orders/details?id=${order._id}`)}
                                                        className="h-8"
                                                    >
                                                        Details
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

            {/* Order Details Dialog */}
            {selectedOrder && (
                <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Order Details</DialogTitle>
                            <DialogDescription>
                                Order ID: {selectedOrder.orderId}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 mt-4">
                            {/* Customer information */}
                            <div className="bg-slate-50 p-4 rounded-md">
                                <h3 className="font-medium flex items-center">
                                    <User className="h-4 w-4 mr-2" /> Customer Information
                                </h3>
                                <div className="mt-2 space-y-1">
                                    <p><span className="font-medium">Name:</span> {getCustomerName(selectedOrder)}</p>
                                    <p><span className="font-medium">Email:</span> {getCustomerEmail(selectedOrder)}</p>
                                    <p><span className="font-medium">Customer ID:</span> {selectedOrder.userId}</p>
                                </div>
                            </div>

                            {/* Order items */}
                            <div>
                                <h3 className="font-medium mb-2">Order Items</h3>
                                <div className="border rounded-md divide-y">
                                    {selectedOrder.items && selectedOrder.items.map((item) => (
                                        <div key={item._id} className="p-3 flex justify-between items-start">
                                            <div className="flex gap-3">
                                                {item.image && (
                                                    <div className="h-14 w-14 rounded-md overflow-hidden flex-shrink-0">
                                                        <img
                                                            src={item.image}
                                                            alt={item.title}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium">{item.title}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {item.category} • {item.subcategory}
                                                    </p>
                                                    {item.customization && (
                                                        <p className="text-xs mt-1">Customization: {item.customization}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">₹{item.price.toLocaleString()}</p>
                                                <p className="text-sm">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order summary */}
                            <div className="border-t pt-4 mt-4">
                                <div className="flex justify-between">
                                    <span className="font-medium">Total Amount:</span>
                                    <span className="font-bold">₹{selectedOrder.totalAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between mt-2">
                                    <span className="font-medium">Status:</span>
                                    <span>{getStatusBadge(selectedOrder.status)}</span>
                                </div>
                                <div className="flex justify-between mt-2">
                                    <span className="font-medium">Date:</span>
                                    <span>{formatDate(selectedOrder.createdAt)}</span>
                                </div>
                                {selectedOrder.paymentId && (
                                    <div className="flex justify-between mt-2">
                                        <span className="font-medium">Payment ID:</span>
                                        <span className="font-mono text-sm">{selectedOrder.paymentId}</span>
                                    </div>
                                )}
                            </div>

                            {/* Action buttons */}
                            <div className="flex justify-end gap-3 mt-6">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowOrderDetails(false)}
                                >
                                    Close
                                </Button>
                                <Button
                                    variant={adminActions[selectedOrder._id] ? "outline" : "default"}
                                    onClick={() => {
                                        toggleOrderCompletion(selectedOrder._id, !!adminActions[selectedOrder._id]);
                                        setShowOrderDetails(false);
                                    }}
                                    disabled={actionLoading[selectedOrder._id]}
                                >
                                    {actionLoading[selectedOrder._id] ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing
                                        </span>
                                    ) : adminActions[selectedOrder._id] ? (
                                        <span className="flex items-center">
                                            <Check className="h-4 w-4 mr-2" />
                                            Mark as Incomplete
                                        </span>
                                    ) : (
                                        <span className="flex items-center">
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Mark as Complete
                                        </span>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}