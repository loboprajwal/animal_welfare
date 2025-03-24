import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Report, User, Adoption, Donation } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Users,
  Dog,
  Home,
  Heart,
  MessageSquare,
  Search,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  Download,
} from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Check if user is admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin dashboard.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [user, navigate, toast]);

  useEffect(() => {
    document.title = "Admin Dashboard - AnimalSOS";
  }, []);

  // Fetch data
  const { data: reports } = useQuery<Report[]>({
    queryKey: ["/api/reports"],
  });

  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const { data: adoptions } = useQuery<Adoption[]>({
    queryKey: ["/api/adoptions"],
  });

  const { data: donations } = useQuery<Donation[]>({
    queryKey: ["/api/donations"],
  });

  // Loading state
  const isLoading = !reports || !users || !adoptions || !donations;

  // Calculate stats
  const totalReports = reports?.length || 0;
  const pendingReports = reports?.filter(report => report.status === "pending").length || 0;
  const rescuedAnimals = reports?.filter(report => report.status === "rescued").length || 0;
  
  const totalUsers = users?.length || 0;
  const totalAdoptions = adoptions?.length || 0;
  const availablePets = adoptions?.filter(adoption => adoption.status === "available").length || 0;
  
  const totalDonations = donations?.reduce((acc, donation) => acc + donation.raisedAmount, 0) || 0;
  const donationGoals = donations?.reduce((acc, donation) => acc + donation.goalAmount, 0) || 0;
  const donationProgress = donationGoals ? Math.round((totalDonations / donationGoals) * 100) : 0;

  // Chart data
  const reportStatusData = [
    { name: "Pending", value: reports?.filter(r => r.status === "pending").length || 0 },
    { name: "Assigned", value: reports?.filter(r => r.status === "assigned").length || 0 },
    { name: "In Progress", value: reports?.filter(r => r.status === "in_progress").length || 0 },
    { name: "Rescued", value: reports?.filter(r => r.status === "rescued").length || 0 },
    { name: "Closed", value: reports?.filter(r => r.status === "closed").length || 0 },
  ];

  const adoptionStatusData = [
    { name: "Available", value: adoptions?.filter(a => a.status === "available").length || 0 },
    { name: "Pending", value: adoptions?.filter(a => a.status === "pending").length || 0 },
    { name: "Adopted", value: adoptions?.filter(a => a.status === "adopted").length || 0 },
  ];

  const COLORS = ["#4C9885", "#F99E4C", "#E45B5B", "#8884d8", "#82ca9d"];

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case "assigned":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Assigned</Badge>;
      case "in_progress":
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 hover:bg-orange-100">In Progress</Badge>;
      case "rescued":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Rescued</Badge>;
      case "closed":
        return <Badge variant="outline" className="bg-neutral-100 text-neutral-800 hover:bg-neutral-100">Closed</Badge>;
      case "available":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Available</Badge>;
      case "adopted":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Adopted</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (user?.role !== "admin") {
    return null; // Prevent rendering if not admin
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Admin Dashboard</h1>
          <p className="text-neutral-600">
            Manage animal reports, adoptions, users, and more
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline" className="flex items-center">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button className="bg-primary hover:bg-primary-dark flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <ArrowUpRight className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="adoptions" className="flex items-center gap-1">
            <Home className="h-4 w-4" />
            Adoptions
          </TabsTrigger>
          <TabsTrigger value="donations" className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            Donations
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-neutral-500">Total Reports</p>
                        <h3 className="text-3xl font-bold mt-1">{totalReports}</h3>
                      </div>
                      <div className="p-2 bg-primary bg-opacity-10 rounded-full">
                        <Dog className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <span className="text-green-600 flex items-center font-medium">
                        <ChevronUp className="h-4 w-4 mr-1" />
                        {rescuedAnimals}
                      </span>
                      <span className="ml-1 text-neutral-600">animals rescued</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-neutral-500">Registered Users</p>
                        <h3 className="text-3xl font-bold mt-1">{totalUsers}</h3>
                      </div>
                      <div className="p-2 bg-secondary bg-opacity-10 rounded-full">
                        <Users className="h-6 w-6 text-secondary" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <span className="text-green-600 flex items-center font-medium">
                        <ChevronUp className="h-4 w-4 mr-1" />
                        12%
                      </span>
                      <span className="ml-1 text-neutral-600">increase this month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-neutral-500">Adoptions</p>
                        <h3 className="text-3xl font-bold mt-1">{totalAdoptions}</h3>
                      </div>
                      <div className="p-2 bg-accent bg-opacity-10 rounded-full">
                        <Home className="h-6 w-6 text-accent" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <span className="text-blue-600 flex items-center font-medium">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {availablePets}
                      </span>
                      <span className="ml-1 text-neutral-600">pets available</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-neutral-500">Total Donations</p>
                        <h3 className="text-3xl font-bold mt-1">{formatCurrency(totalDonations)}</h3>
                      </div>
                      <div className="p-2 bg-blue-500 bg-opacity-10 rounded-full">
                        <Heart className="h-6 w-6 text-blue-500" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <span className="text-green-600 flex items-center font-medium">
                        <ChevronUp className="h-4 w-4 mr-1" />
                        {donationProgress}%
                      </span>
                      <span className="ml-1 text-neutral-600">of goal reached</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Report Status Distribution</CardTitle>
                    <CardDescription>Overall status of animal reports</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={reportStatusData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => 
                              `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                          >
                            {reportStatusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Legend />
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Adoption Status</CardTitle>
                    <CardDescription>Current status of pets for adoption</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={adoptionStatusData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#4C9885" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Reports</CardTitle>
                  <CardDescription>Latest animal reports that need attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Animal Type</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Reported</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reports?.slice(0, 5).map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.id}</TableCell>
                          <TableCell className="capitalize">{report.animalType}</TableCell>
                          <TableCell>{report.location}</TableCell>
                          <TableCell>{getStatusBadge(report.status)}</TableCell>
                          <TableCell>
                            {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports">
          <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reports</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="rescued">Rescued</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                <Input
                  placeholder="Search reports..."
                  className="pl-10 w-[200px] md:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Button className="bg-primary hover:bg-primary-dark">
              <Plus className="mr-2 h-4 w-4" />
              Add Report
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Animal Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Urgency</TableHead>
                      <TableHead>Reported</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports?.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.id}</TableCell>
                        <TableCell className="capitalize">{report.animalType}</TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate">{report.description}</div>
                        </TableCell>
                        <TableCell>{report.location}</TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell>
                          {report.urgency === "urgent" ? (
                            <Badge className="bg-accent text-white hover:bg-accent">Urgent</Badge>
                          ) : (
                            <Badge variant="outline">Normal</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="user">Regular Users</SelectItem>
                  <SelectItem value="ngo">NGO</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                <Input
                  placeholder="Search users..."
                  className="pl-10 w-[200px] md:w-[300px]"
                />
              </div>
            </div>
            <Button className="bg-primary hover:bg-primary-dark">
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users?.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="capitalize">
                          <Badge variant="outline" className={
                            user.role === "admin" 
                              ? "bg-purple-100 text-purple-800 hover:bg-purple-100" 
                              : user.role === "ngo"
                              ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                              : "bg-neutral-100 text-neutral-800 hover:bg-neutral-100"
                          }>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.createdAt && formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Adoptions Tab */}
        <TabsContent value="adoptions">
          <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pets</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="adopted">Adopted</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                <Input
                  placeholder="Search pets..."
                  className="pl-10 w-[200px] md:w-[300px]"
                />
              </div>
            </div>
            <Button className="bg-primary hover:bg-primary-dark">
              <Plus className="mr-2 h-4 w-4" />
              Add Pet
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Breed</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adoptions?.map((pet) => (
                      <TableRow key={pet.id}>
                        <TableCell className="font-medium">{pet.id}</TableCell>
                        <TableCell>{pet.name}</TableCell>
                        <TableCell className="capitalize">{pet.type}</TableCell>
                        <TableCell>{pet.breed || "-"}</TableCell>
                        <TableCell>{pet.age}</TableCell>
                        <TableCell className="capitalize">{pet.gender}</TableCell>
                        <TableCell>{getStatusBadge(pet.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Donations Tab */}
        <TabsContent value="donations">
          <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <Input
                placeholder="Search campaigns..."
                className="pl-10 w-[200px] md:w-[300px]"
              />
            </div>
            <Button className="bg-primary hover:bg-primary-dark">
              <Plus className="mr-2 h-4 w-4" />
              New Campaign
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Campaign Title</TableHead>
                      <TableHead>Goal</TableHead>
                      <TableHead>Raised</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {donations?.map((donation) => {
                      const progress = Math.round((donation.raisedAmount / donation.goalAmount) * 100);
                      return (
                        <TableRow key={donation.id}>
                          <TableCell className="font-medium">{donation.id}</TableCell>
                          <TableCell>{donation.title}</TableCell>
                          <TableCell>{formatCurrency(donation.goalAmount)}</TableCell>
                          <TableCell>{formatCurrency(donation.raisedAmount)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-neutral-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-primary rounded-full" 
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                              <span className="text-sm">{progress}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {formatDistanceToNow(new Date(donation.createdAt), { addSuffix: true })}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
