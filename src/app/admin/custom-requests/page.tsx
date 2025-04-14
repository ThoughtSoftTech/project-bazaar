"use client";
import React, { useEffect, useState } from 'react';
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle,
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
    Check, CheckCircle, ChevronDown, Eye,
    Filter, FileText, Search, SortAsc, SortDesc
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAPI } from '@/lib/api';

// Custom Request interface
interface CustomRequest {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    projectType: string;
    projectCategory: string;
    description: string;
    budget?: number;
    timeline?: string;
    requirements?: string;
    status: 'pending' | 'reviewing' | 'accepted' | 'rejected' | 'completed';
    createdAt: string;
}

export default function AdminCustomRequests() {
    const { user, token } = useAuth();
    const [requests, setRequests] = useState<CustomRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortField, setSortField] = useState<keyof CustomRequest>('createdAt');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string | null>(null);
    const [selectedRequest, setSelectedRequest] = useState<CustomRequest | null>(null);
    const [showRequestDetails, setShowRequestDetails] = useState(false);
    // Admin action states
    const [adminActions, setAdminActions] = useState<{ [key: string]: boolean }>({});
    const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const fetchCustomRequests = async () => {
            if (user?.isAdmin) {
                try {
                    setIsLoading(true);
                    // Fetch custom requests from MongoDB
                    const requestsData = await fetchAPI('/api/admin/custom-requests', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    // If API call fails, use sample data for development
                    const fetchedRequests = requestsData || getSampleCustomRequests();
                    setRequests(fetchedRequests);

                    // Fetch admin action status for these requests
                    await fetchAdminActions(fetchedRequests);
                } catch (error) {
                    console.error('Error fetching custom requests:', error);
                    // Use sample data for development
                    setRequests(getSampleCustomRequests());
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchCustomRequests();
    }, [user, token]);

    // Function to fetch admin actions for custom requests
    const fetchAdminActions = async (requests: CustomRequest[]) => {
        try {
            // Get all request IDs
            const requestIds = requests.map(request => request._id);

            // Fetch admin actions for these requests
            const actionsResponse = await fetchAPI(`/api/admin/actions?type=custom&ids=${requestIds.join(',')}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (actionsResponse && actionsResponse.actions) {
                // Create a mapping of request ID to completion status
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

    // Function to toggle custom request completion
    const toggleRequestCompletion = async (requestId: string, currentStatus: boolean) => {
        if (!user?.isAdmin) return;

        // Set loading state for this specific request
        setActionLoading(prev => ({ ...prev, [requestId]: true }));

        try {
            // Call our API endpoint to update the admin action
            const response = await fetchAPI(`/api/admin/custom/${requestId}/action`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    isCompleted: !currentStatus
                })
            });

            if (response && response.action) {
                // Update the admin actions state
                setAdminActions(prev => ({
                    ...prev,
                    [requestId]: response.action.isCompleted
                }));

                // If the status changed, update the request status in UI
                const newStatus = response.action.isCompleted ? 'completed' : 'pending';
                setRequests(requests.map(request =>
                    request._id === requestId
                        ? { ...request, status: newStatus }
                        : request
                ));

                console.log(`Custom request ${requestId} action updated successfully`);
            }
        } catch (error) {
            console.error('Error updating custom request action:', error);
        } finally {
            // Clear loading state
            setActionLoading(prev => ({ ...prev, [requestId]: false }));
        }
    };

    // Sample data for development
    const getSampleCustomRequests = (): CustomRequest[] => {
        return [
            {
                _id: '1',
                name: 'John Smith',
                email: 'john.smith@example.com',
                phone: '+91 9876543210',
                projectType: 'Mobile App',
                projectCategory: 'E-commerce',
                description: 'I need a mobile app for my online store with integrated payment system and inventory management.',
                budget: 75000,
                timeline: '3 months',
                requirements: 'Must work on both iOS and Android, include user authentication, and product search functionality.',
                status: 'pending',
                createdAt: '2025-04-10T09:15:00Z'
            },
            {
                _id: '2',
                name: 'Sarah Johnson',
                email: 'sarah.j@example.com',
                phone: '+91 8765432109',
                projectType: 'Web Application',
                projectCategory: 'Education',
                description: 'I want to create an online learning platform for my tutoring business.',
                budget: 120000,
                timeline: '4 months',
                requirements: 'Video streaming capabilities, quiz system, and student progress tracking.',
                status: 'reviewing',
                createdAt: '2025-04-08T14:30:00Z'
            },
            {
                _id: '3',
                name: 'Raj Patel',
                email: 'raj.patel@example.com',
                phone: '+91 7654321098',
                projectType: 'Hardware Project',
                projectCategory: 'IoT',
                description: 'I need an IoT solution for smart irrigation system for my farm.',
                budget: 85000,
                timeline: '2 months',
                requirements: 'Must include soil moisture sensors, weather forecasting integration, and mobile app control.',
                status: 'completed',
                createdAt: '2025-04-05T10:45:00Z'
            }
        ];
    };

    const handleViewRequestDetails = (request: CustomRequest) => {
        setSelectedRequest(request);
        setShowRequestDetails(true);
    };

    const handleSort = (field: keyof CustomRequest) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

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

    // Format currency
    const formatCurrency = (amount?: number) => {
        if (!amount) return 'Not specified';
        return `₹${amount.toLocaleString()}`;
    };

    // Get status badge
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
            case 'reviewing':
                return <Badge variant="outline" className="bg-blue-100 text-blue-800">Reviewing</Badge>;
            case 'accepted':
                return <Badge variant="outline" className="bg-green-100 text-green-800">Accepted</Badge>;
            case 'rejected':
                return <Badge variant="outline" className="bg-red-100 text-red-800">Rejected</Badge>;
            case 'completed':
                return <Badge variant="outline" className="bg-purple-100 text-purple-800">Completed</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    // Sort and filter requests
    const filteredRequests = requests
        .filter(request => {
            // Apply search filter
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                return (
                    request.name.toLowerCase().includes(searchLower) ||
                    request.email.toLowerCase().includes(searchLower) ||
                    request.projectType.toLowerCase().includes(searchLower) ||
                    request.projectCategory.toLowerCase().includes(searchLower) ||
                    request.description.toLowerCase().includes(searchLower)
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
                            <DropdownMenuItem onClick={() => setFilterStatus('reviewing')}>
                                Reviewing
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterStatus('accepted')}>
                                Accepted
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterStatus('rejected')}>
                                Rejected
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
                    <CardTitle>All Custom Requests</CardTitle>
                    <CardDescription>
                        Manage and track all custom project requests from clients.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead
                                        className="cursor-pointer"
                                        onClick={() => handleSort('name')}
                                    >
                                        <div className="flex items-center">
                                            Client
                                            {sortField === 'name' && (
                                                sortDirection === 'asc' ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
                                            )}
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer"
                                        onClick={() => handleSort('projectType')}
                                    >
                                        <div className="flex items-center">
                                            Project Type
                                            {sortField === 'projectType' && (
                                                sortDirection === 'asc' ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
                                            )}
                                        </div>
                                    </TableHead>
                                    <TableHead>Budget</TableHead>
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
                                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                                            No custom requests found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredRequests.map((request) => (
                                        <TableRow key={request._id}>
                                            <TableCell>
                                                <div className="font-medium">{request.name}</div>
                                                <div className="text-sm text-muted-foreground">{request.email}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">{request.projectType}</div>
                                                <div className="text-sm text-muted-foreground">{request.projectCategory}</div>
                                            </TableCell>
                                            <TableCell>{formatCurrency(request.budget)}</TableCell>
                                            <TableCell>
                                                {getStatusBadge(request.status)}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(request.createdAt)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {/* Admin action buttons - toggle completion status */}
                                                    <Button
                                                        size="sm"
                                                        variant={adminActions[request._id] ? "outline" : "default"}
                                                        onClick={() => toggleRequestCompletion(request._id, !!adminActions[request._id])}
                                                        className="h-8 px-2"
                                                        disabled={actionLoading[request._id]}
                                                    >
                                                        {actionLoading[request._id] ? (
                                                            <span className="flex items-center">
                                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                                Processing
                                                            </span>
                                                        ) : adminActions[request._id] ? (
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
                                                        onClick={() => handleViewRequestDetails(request)}
                                                    >
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

            {/* Request Details Dialog */}
            {selectedRequest && (
                <Dialog open={showRequestDetails} onOpenChange={setShowRequestDetails}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Custom Project Request Details</DialogTitle>
                            <DialogDescription>
                                {selectedRequest.projectType} • {selectedRequest.projectCategory}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 mt-4">
                            {/* Client information */}
                            <div className="bg-slate-50 p-4 rounded-md">
                                <h3 className="font-medium">Client Information</h3>
                                <div className="mt-2 space-y-1">
                                    <p><span className="font-medium">Name:</span> {selectedRequest.name}</p>
                                    <p><span className="font-medium">Email:</span> {selectedRequest.email}</p>
                                    {selectedRequest.phone && (
                                        <p><span className="font-medium">Phone:</span> {selectedRequest.phone}</p>
                                    )}
                                </div>
                            </div>

                            {/* Project details */}
                            <div className="space-y-3">
                                <div>
                                    <h3 className="font-medium">Project Description</h3>
                                    <p className="mt-1 text-sm">{selectedRequest.description}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-sm font-medium">Budget</h4>
                                        <p>{formatCurrency(selectedRequest.budget)}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium">Timeline</h4>
                                        <p>{selectedRequest.timeline || 'Not specified'}</p>
                                    </div>
                                </div>

                                {selectedRequest.requirements && (
                                    <div>
                                        <h3 className="font-medium">Requirements</h3>
                                        <p className="mt-1 text-sm">{selectedRequest.requirements}</p>
                                    </div>
                                )}
                            </div>

                            {/* Request summary */}
                            <div className="border-t pt-4 mt-4">
                                <div className="flex justify-between mt-2">
                                    <span className="font-medium">Status:</span>
                                    <span>{getStatusBadge(selectedRequest.status)}</span>
                                </div>
                                <div className="flex justify-between mt-2">
                                    <span className="font-medium">Date Submitted:</span>
                                    <span>{formatDate(selectedRequest.createdAt)}</span>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex justify-end gap-3 mt-6">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowRequestDetails(false)}
                                >
                                    Close
                                </Button>
                                <Button
                                    variant={adminActions[selectedRequest._id] ? "outline" : "default"}
                                    onClick={() => {
                                        toggleRequestCompletion(selectedRequest._id, !!adminActions[selectedRequest._id]);
                                        setShowRequestDetails(false);
                                    }}
                                    disabled={actionLoading[selectedRequest._id]}
                                >
                                    {actionLoading[selectedRequest._id] ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing
                                        </span>
                                    ) : adminActions[selectedRequest._id] ? (
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