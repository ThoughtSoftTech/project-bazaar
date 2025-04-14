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
    Filter, FileText, Search, SortAsc, SortDesc
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAPI } from '@/lib/api';
import Link from 'next/link';

interface CustomRequest {
    _id: string;
    requestId: string;
    userId: string;
    userName: string;
    userEmail: string;
    projectType: string;
    description: string;
    budget: number;
    timeline: string;
    status: 'pending' | 'approved' | 'in-progress' | 'completed' | 'rejected';
    createdAt: string;
    updatedAt: string;
}

export default function AdminCustomRequests() {
    const { user, token } = useAuth();
    const [requests, setRequests] = useState<CustomRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortField, setSortField] = useState<keyof CustomRequest>('createdAt');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string | null>(null);

    useEffect(() => {
        const fetchRequests = async () => {
            if (user?.isAdmin) {
                try {
                    setIsLoading(true);
                    // In a real app, this would fetch from your backend
                    const requestData = await fetchAPI('/api/admin/custom-requests', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    // If API call fails, use sample data for development
                    setRequests(requestData || getSampleRequests());
                } catch (error) {
                    console.error('Error fetching custom requests:', error);
                    // Use sample data for development
                    setRequests(getSampleRequests());
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchRequests();
    }, [user, token]);

    const getSampleRequests = (): CustomRequest[] => {
        return [
            {
                _id: '1',
                requestId: 'REQ-1034',
                userId: 'user1',
                userName: 'Sarah Chen',
                userEmail: 'sarah@example.com',
                projectType: 'Mobile App Development',
                description: 'I need a mobile app for my small business that allows customers to book appointments and view our services.',
                budget: 30000,
                timeline: '2-3 months',
                status: 'pending',
                createdAt: '2023-04-10T10:30:00Z',
                updatedAt: '2023-04-10T10:30:00Z'
            },
            {
                _id: '2',
                requestId: 'REQ-1033',
                userId: 'user2',
                userName: 'John Doe',
                userEmail: 'john@example.com',
                projectType: 'Custom Web Portal',
                description: 'Looking for a custom web portal for employee management and task tracking system.',
                budget: 45000,
                timeline: '3-4 months',
                status: 'in-progress',
                createdAt: '2023-04-05T09:15:00Z',
                updatedAt: '2023-04-08T14:20:00Z'
            },
            {
                _id: '3',
                requestId: 'REQ-1032',
                userId: 'user3',
                userName: 'Michael Brown',
                userEmail: 'michael@example.com',
                projectType: 'IoT Home Automation',
                description: 'Need a custom IoT solution to automate home devices including lights, thermostat, and security.',
                budget: 60000,
                timeline: '4-5 months',
                status: 'completed',
                createdAt: '2023-04-02T16:45:00Z',
                updatedAt: '2023-04-15T11:30:00Z'
            },
        ];
    };

    const handleMarkAsCompleted = async (requestId: string) => {
        if (user?.isAdmin) {
            try {
                // In a real app, this would update your backend
                await fetchAPI(`/api/admin/custom-requests/${requestId}/complete`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                // Update local state
                setRequests(requests.map(request =>
                    request._id === requestId
                        ? { ...request, status: 'completed', updatedAt: new Date().toISOString() }
                        : request
                ));
            } catch (error) {
                console.error('Error updating request status:', error);
                // For development, update the UI anyway
                setRequests(requests.map(request =>
                    request._id === requestId
                        ? { ...request, status: 'completed', updatedAt: new Date().toISOString() }
                        : request
                ));
            }
        }
    };

    const handleSort = (field: keyof CustomRequest) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Sort and filter requests
    const filteredRequests = requests
        .filter(request => {
            // Apply search filter
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                return (
                    request.requestId.toLowerCase().includes(searchLower) ||
                    request.userName.toLowerCase().includes(searchLower) ||
                    request.userEmail.toLowerCase().includes(searchLower) ||
                    request.projectType.toLowerCase().includes(searchLower)
                );
            }
            return true;
        })
        .filter(request => {
            // Apply status filter
            if (filterStatus) {
                return request.status === filterStatus;
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
            case 'approved':
                return <Badge variant="outline" className="bg-blue-100 text-blue-800">Approved</Badge>;
            case 'in-progress':
                return <Badge variant="outline" className="bg-indigo-100 text-indigo-800">In Progress</Badge>;
            case 'completed':
                return <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>;
            case 'rejected':
                return <Badge variant="outline" className="bg-red-100 text-red-800">Rejected</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    // If loading
    if (isLoading) {
        return <div className="p-8 text-center">Loading custom requests...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold">Custom Project Requests</h1>

                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search input */}
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search requests..."
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
                            <DropdownMenuItem onClick={() => setFilterStatus('approved')}>
                                Approved
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterStatus('in-progress')}>
                                In Progress
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterStatus('completed')}>
                                Completed
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterStatus('rejected')}>
                                Rejected
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Custom Project Requests</CardTitle>
                    <CardDescription>
                        Manage and track all custom project requests from customers.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead
                                        className="cursor-pointer"
                                        onClick={() => handleSort('requestId')}
                                    >
                                        <div className="flex items-center">
                                            Request ID
                                            {sortField === 'requestId' && (
                                                sortDirection === 'asc' ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
                                            )}
                                        </div>
                                    </TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Project Type</TableHead>
                                    <TableHead
                                        className="cursor-pointer"
                                        onClick={() => handleSort('budget')}
                                    >
                                        <div className="flex items-center">
                                            Budget
                                            {sortField === 'budget' && (
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
                                {filteredRequests.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                                            No custom requests found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredRequests.map((request) => (
                                        <TableRow key={request._id}>
                                            <TableCell className="font-medium">
                                                {request.requestId}
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">{request.userName}</div>
                                                <div className="text-sm text-muted-foreground">{request.userEmail}</div>
                                            </TableCell>
                                            <TableCell>
                                                {request.projectType}
                                            </TableCell>
                                            <TableCell>₹{request.budget.toLocaleString()}</TableCell>
                                            <TableCell>
                                                {getStatusBadge(request.status)}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(request.createdAt)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {request.status !== 'completed' ? (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleMarkAsCompleted(request._id)}
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