"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowUpRight, 
  Users, 
  ShoppingCart, 
  CreditCard, 
  Package, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  BarChart4, 
  PieChart,
  CircleDollarSign,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Mock data for dashboard stats
const stats = [
  {
    title: "Total Users",
    value: "12,348",
    change: "+14%",
    trend: "up",
    description: "vs. last month",
    icon: Users
  },
  {
    title: "Total Orders",
    value: "3,592",
    change: "+7.3%",
    trend: "up",
    description: "vs. last month",
    icon: ShoppingCart
  },
  {
    title: "Revenue",
    value: "₹9,25,780",
    change: "+11.2%",
    trend: "up",
    description: "vs. last month",
    icon: CircleDollarSign
  },
  {
    title: "Active Projects",
    value: "256",
    change: "-2.4%",
    trend: "down",
    description: "vs. last month",
    icon: Package
  }
];

// Mock recent activities
const recentActivities = [
  {
    id: 1,
    action: "New order placed",
    details: "Order #12345 - AI Development Kit",
    time: "10 minutes ago",
    status: "success"
  },
  {
    id: 2,
    action: "Payment received",
    details: "₹4,500 for Order #12342",
    time: "45 minutes ago",
    status: "success"
  },
  {
    id: 3,
    action: "New user registered",
    details: "Vikram Mehta (vikram@example.com)",
    time: "1 hour ago",
    status: "success"
  },
  {
    id: 4,
    action: "Custom project request",
    details: "IoT Home Automation Kit",
    time: "2 hours ago",
    status: "warning"
  },
  {
    id: 5,
    action: "Payment failed",
    details: "Order #12340 - Robotics Kit",
    time: "3 hours ago",
    status: "error"
  }
];

// Mock recent orders
const recentOrders = [
  {
    id: "ORD-12345",
    date: "Apr 20, 2025",
    customer: "Rahul Singh",
    product: "AI Development Kit",
    status: "Delivered",
    amount: "₹5,999"
  },
  {
    id: "ORD-12344",
    date: "Apr 19, 2025",
    customer: "Priya Sharma",
    product: "Web Development Course",
    status: "Processing",
    amount: "₹2,499"
  },
  {
    id: "ORD-12343",
    date: "Apr 19, 2025",
    customer: "Ajay Kumar",
    product: "Arduino Ultimate Kit",
    status: "Shipped",
    amount: "₹3,999"
  },
  {
    id: "ORD-12342",
    date: "Apr 18, 2025",
    customer: "Neha Gupta",
    product: "Game Development Course",
    status: "Delivered",
    amount: "₹4,500"
  },
  {
    id: "ORD-12341",
    date: "Apr 17, 2025",
    customer: "Vikram Mehta",
    product: "Robotics Starter Kit",
    status: "Cancelled",
    amount: "₹7,999"
  }
];

// Mock top selling products
const topSellingProducts = [
  {
    id: 1,
    name: "AI Development Kit",
    category: "AI & ML",
    sales: 142,
    revenue: "₹8,51,858",
    trend: "+12%"
  },
  {
    id: 2,
    name: "Web Development Course",
    category: "Courses",
    sales: 128,
    revenue: "₹3,19,872",
    trend: "+8%"
  },
  {
    id: 3,
    name: "Arduino Ultimate Kit",
    category: "Arduino",
    sales: 104,
    revenue: "₹4,15,896",
    trend: "+5%"
  },
  {
    id: 4,
    name: "Robotics Starter Kit",
    category: "Robotics",
    sales: 89,
    revenue: "₹7,11,911",
    trend: "-2%"
  },
  {
    id: 5,
    name: "Game Development Course",
    category: "Courses",
    sales: 78,
    revenue: "₹3,51,000",
    trend: "+15%"
  }
];

export default function AdminDashboard() {
  // Function to render the status badge
  const getStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case 'success':
        return <Badge className="bg-green-500 hover:bg-green-600">Success</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
      case 'error':
        return <Badge className="bg-red-500 hover:bg-red-600">Failed</Badge>;
      case 'delivered':
        return <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500 hover:bg-blue-600">{status}</Badge>;
      case 'shipped':
        return <Badge className="bg-indigo-500 hover:bg-indigo-600">{status}</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="text-red-500 border-red-500">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the Project Bazaar admin dashboard.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.trend === 'up' ? 'bg-green-100' : 'bg-red-100'}`}>
                <stat.icon className={`h-4 w-4 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs mt-1">
                <span className={`flex items-center ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {stat.change}
                </span>
                <span className="text-muted-foreground ml-1">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        {/* Recent Activities */}
        <Card className="lg:col-span-1 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs">
                View All
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
            <CardDescription>Latest activities on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className={`p-1.5 rounded-full mt-0.5 ${
                    activity.status === 'success' ? 'bg-green-100' : 
                    activity.status === 'warning' ? 'bg-yellow-100' : 'bg-red-100'
                  }`}>
                    {activity.status === 'success' ? 
                      <Users className="h-3.5 w-3.5 text-green-600" /> : 
                      activity.status === 'warning' ? 
                      <Clock className="h-3.5 w-3.5 text-yellow-600" /> :
                      <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
                    }
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.details}</p>
                    <div className="flex items-center pt-1">
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                      <div className="ml-2">
                        {getStatusBadge(activity.status)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Charts and Analytics Tab Section */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Analytics Overview</CardTitle>
            <CardDescription>Visualize your platform performance</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="revenue">
              <TabsList className="mb-4">
                <TabsTrigger value="revenue">Revenue</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
              </TabsList>
              <TabsContent value="revenue" className="space-y-4">
                <div className="h-[250px] flex items-center justify-center border rounded-lg bg-muted/50">
                  <div className="text-center">
                    <BarChart4 className="h-10 w-10 mx-auto text-muted-foreground/60" />
                    <p className="text-sm text-muted-foreground mt-2">Revenue chart visualization placeholder</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Card>
                    <CardContent className="p-3">
                      <div className="text-xs text-muted-foreground">Total Revenue</div>
                      <div className="text-lg font-bold mt-1">₹9,25,780</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3">
                      <div className="text-xs text-muted-foreground">Avg. Order Value</div>
                      <div className="text-lg font-bold mt-1">₹2,577</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3">
                      <div className="text-xs text-muted-foreground">Conversion Rate</div>
                      <div className="text-lg font-bold mt-1">3.2%</div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="users" className="h-[330px] flex items-center justify-center border rounded-lg bg-muted/50">
                <div className="text-center">
                  <Users className="h-10 w-10 mx-auto text-muted-foreground/60" />
                  <p className="text-sm text-muted-foreground mt-2">User analytics visualization placeholder</p>
                </div>
              </TabsContent>
              <TabsContent value="orders" className="h-[330px] flex items-center justify-center border rounded-lg bg-muted/50">
                <div className="text-center">
                  <ShoppingCart className="h-10 w-10 mx-auto text-muted-foreground/60" />
                  <p className="text-sm text-muted-foreground mt-2">Orders analytics visualization placeholder</p>
                </div>
              </TabsContent>
              <TabsContent value="products" className="h-[330px] flex items-center justify-center border rounded-lg bg-muted/50">
                <div className="text-center">
                  <Package className="h-10 w-10 mx-auto text-muted-foreground/60" />
                  <p className="text-sm text-muted-foreground mt-2">Products analytics visualization placeholder</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        {/* Recent Orders */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recent Orders</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs">
                View All
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
            <CardDescription>Latest customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-muted-foreground border-b">
                    <th className="text-left pb-3 pl-4">Order ID</th>
                    <th className="text-left pb-3">Product</th>
                    <th className="text-left pb-3">Status</th>
                    <th className="text-right pb-3 pr-4">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b last:border-0">
                      <td className="py-3 pl-4">
                        <div className="font-medium">{order.id}</div>
                        <div className="text-xs text-muted-foreground">{order.date}</div>
                      </td>
                      <td className="py-3">
                        <div>{order.product}</div>
                        <div className="text-xs text-muted-foreground">{order.customer}</div>
                      </td>
                      <td className="py-3">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="py-3 text-right pr-4 font-medium">{order.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Top Selling Products */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Top Selling Products</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs">
                View All
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
            <CardDescription>Best performing products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-muted-foreground border-b">
                    <th className="text-left pb-3 pl-4">Product</th>
                    <th className="text-left pb-3">Sales</th>
                    <th className="text-left pb-3">Trend</th>
                    <th className="text-right pb-3 pr-4">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topSellingProducts.map((product) => (
                    <tr key={product.id} className="border-b last:border-0">
                      <td className="py-3 pl-4">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-muted-foreground">{product.category}</div>
                      </td>
                      <td className="py-3">{product.sales}</td>
                      <td className="py-3">
                        <div className={`flex items-center ${
                          product.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {product.trend.startsWith('+') ? 
                            <TrendingUp className="h-3.5 w-3.5 mr-1" /> : 
                            <TrendingDown className="h-3.5 w-3.5 mr-1" />
                          }
                          {product.trend}
                        </div>
                      </td>
                      <td className="py-3 text-right pr-4 font-medium">{product.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar - Coming soon placeholder */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Upcoming Events & Deadlines</CardTitle>
          <CardDescription>View your calendar and schedule</CardDescription>
        </CardHeader>
        <CardContent className="h-[200px] flex items-center justify-center">
          <div className="text-center">
            <Calendar className="h-10 w-10 mx-auto text-muted-foreground/60" />
            <p className="text-sm font-medium mt-2">Calendar coming soon</p>
            <p className="text-xs text-muted-foreground mt-1">Track events, deadlines, and important dates</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}