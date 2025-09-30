import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  Menu,
  Calendar,
  MapPin,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  BookOpen,
  Target,
} from "lucide-react";
import { workshopAndAwarenessAPI } from "../services/api";
import Sidebar from "../components/Sidebar";

const Workshops = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    category: "all",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    workshopTitle: "",
    description: "",
    category: "",
    facilitator: "",
    facilitatorContact: "",
    venue: "",
    wardNo: "",
    habitation: "",
    dateScheduled: "",
    timeScheduled: "",
    duration: "",
    maxParticipants: "",
    targetAudience: "",
    objectives: "",
    materialsRequired: "",
    totalParticipants: "",
    maleParticipants: "",
    femaleParticipants: "",
    childrenParticipants: "",
    adultParticipants: "",
    seniorParticipants: "",
    status: "Scheduled",
    feedback: "",
    outcome: "",
    followUpRequired: false,
    followUpDate: "",
    cost: "",
    fundingSource: "",
    certificates: false,
    photos: "",
    resources: "",
    remarks: "",
  });

  const workshopCategories = [
    "Health Awareness",
    "Education",
    "Legal Rights",
    "Women Empowerment",
    "Child Protection",
    "Skill Development",
    "Digital Literacy",
    "Financial Literacy",
    "Environmental Awareness",
    "Social Justice",
    "Community Development",
    "Government Schemes",
    "Hygiene & Sanitation",
    "Nutrition",
    "Other",
  ];

  const statusOptions = [
    "Scheduled",
    "Ongoing",
    "Completed",
    "Cancelled",
    "Postponed",
  ];

  const targetAudienceOptions = [
    "Women",
    "Children",
    "Youth",
    "Adults",
    "Senior Citizens",
    "Adolescents",
    "Students",
    "Community Leaders",
    "Self Help Groups",
    "General Public",
  ];

  // Fetch workshops
  const fetchWorkshops = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        ...filters,
      };

      const response = await workshopAndAwarenessAPI.getAll(params);
      setWorkshops(response.data.workshops || []);

      // Handle pagination data - if not provided by API, create default pagination
      if (response.data.pagination) {
        setPagination(response.data.pagination);
      } else {
        // Create default pagination based on workshops data
        const workshopsData = response.data.workshops || [];
        setPagination({
          page: 1,
          limit: 10,
          total: workshopsData.length,
          pages: Math.ceil(workshopsData.length / 10),
        });
      }
    } catch (error) {
      toast.error("Failed to fetch workshops");
      console.error("Error fetching workshops:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchWorkshops();
  }, []);

  // Refetch when search or filters change
  useEffect(() => {
    fetchWorkshops();
  }, [searchTerm, filters]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedWorkshop) {
        await workshopAndAwarenessAPI.update(selectedWorkshop._id, formData);
        toast.success("Workshop updated successfully");
        setIsEditModalOpen(false);
      } else {
        await workshopAndAwarenessAPI.create(formData);
        toast.success("Workshop created successfully");
        setIsCreateModalOpen(false);
      }
      fetchWorkshops();
      resetForm();
    } catch (error) {
      toast.error(
        selectedWorkshop
          ? "Failed to update workshop"
          : "Failed to create workshop"
      );
      console.error("Error submitting form:", error);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      workshopTitle: "",
      description: "",
      category: "",
      facilitator: "",
      facilitatorContact: "",
      venue: "",
      wardNo: "",
      habitation: "",
      dateScheduled: "",
      timeScheduled: "",
      duration: "",
      maxParticipants: "",
      targetAudience: "",
      objectives: "",
      materialsRequired: "",
      totalParticipants: "",
      maleParticipants: "",
      femaleParticipants: "",
      childrenParticipants: "",
      adultParticipants: "",
      seniorParticipants: "",
      status: "Scheduled",
      feedback: "",
      outcome: "",
      followUpRequired: false,
      followUpDate: "",
      cost: "",
      fundingSource: "",
      certificates: false,
      photos: "",
      resources: "",
      remarks: "",
    });
    setSelectedWorkshop(null);
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await workshopAndAwarenessAPI.delete(id);
      toast.success("Workshop deleted successfully");
      fetchWorkshops();
    } catch (error) {
      toast.error("Failed to delete workshop");
      console.error("Error deleting workshop:", error);
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Ongoing":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "Scheduled":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "Postponed":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-3 w-3" />;
      case "Ongoing":
        return <Clock className="h-3 w-3" />;
      case "Scheduled":
        return <Calendar className="h-3 w-3" />;
      case "Cancelled":
        return <AlertCircle className="h-3 w-3" />;
      case "Postponed":
        return <Clock className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeItem="workshops"
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm p-4 flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="mr-2"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Workshops & Awareness</h1>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Workshops & Awareness
                </h1>
                <p className="text-gray-600">
                  Manage workshops and awareness programs for community
                  development
                </p>
              </div>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Workshop
              </Button>
            </div>

            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Search & Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search workshops..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {/* <Select
                    value={filters.status}
                    onValueChange={(value) =>
                      setFilters({ ...filters, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={filters.category}
                    onValueChange={(value) =>
                      setFilters({ ...filters, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {workshopCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select> */}
                </div>
              </CardContent>
            </Card>

            {/* Workshops Table */}
            <Card>
              <CardHeader>
                <CardTitle>Workshops ({pagination.total})</CardTitle>
                <CardDescription>
                  Track and manage community workshops and awareness programs
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <RefreshCw className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Workshop Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Facilitator</TableHead>
                        <TableHead>Participants</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {workshops.map((workshop) => (
                        <TableRow key={workshop._id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {workshop.workshopTitle}
                              </div>
                              <div className="text-sm text-muted-foreground flex items-center">
                                <MapPin className="mr-1 h-3 w-3" />
                                {workshop.venue}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{workshop.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-sm">
                              <Calendar className="mr-1 h-3 w-3" />
                              {workshop.dateScheduled
                                ? new Date(
                                    workshop.dateScheduled
                                  ).toLocaleDateString()
                                : "TBD"}
                            </div>
                            {workshop.timeScheduled && (
                              <div className="text-sm text-muted-foreground">
                                {workshop.timeScheduled}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-sm">
                              <User className="mr-1 h-3 w-3" />
                              {workshop.facilitator || "TBA"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-sm">
                              <Users className="mr-1 h-3 w-3" />
                              {workshop.totalParticipants || 0} /{" "}
                              {workshop.maxParticipants || "∞"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(workshop.status)}>
                              {getStatusIcon(workshop.status)}
                              <span className="ml-1">{workshop.status}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedWorkshop(workshop);
                                  setIsViewModalOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedWorkshop(workshop);
                                  setFormData({
                                    workshopTitle: workshop.workshopTitle || "",
                                    description: workshop.description || "",
                                    category: workshop.category || "",
                                    facilitator: workshop.facilitator || "",
                                    facilitatorContact:
                                      workshop.facilitatorContact || "",
                                    venue: workshop.venue || "",
                                    wardNo: workshop.wardNo || "",
                                    habitation: workshop.habitation || "",
                                    dateScheduled: workshop.dateScheduled
                                      ? workshop.dateScheduled.split("T")[0]
                                      : "",
                                    timeScheduled: workshop.timeScheduled || "",
                                    duration: workshop.duration || "",
                                    maxParticipants:
                                      workshop.maxParticipants || "",
                                    targetAudience:
                                      workshop.targetAudience || "",
                                    objectives: workshop.objectives || "",
                                    materialsRequired:
                                      workshop.materialsRequired || "",
                                    totalParticipants:
                                      workshop.totalParticipants || "",
                                    maleParticipants:
                                      workshop.maleParticipants || "",
                                    femaleParticipants:
                                      workshop.femaleParticipants || "",
                                    childrenParticipants:
                                      workshop.childrenParticipants || "",
                                    adultParticipants:
                                      workshop.adultParticipants || "",
                                    seniorParticipants:
                                      workshop.seniorParticipants || "",
                                    status: workshop.status || "Scheduled",
                                    feedback: workshop.feedback || "",
                                    outcome: workshop.outcome || "",
                                    followUpRequired:
                                      workshop.followUpRequired || false,
                                    followUpDate: workshop.followUpDate
                                      ? workshop.followUpDate.split("T")[0]
                                      : "",
                                    cost: workshop.cost || "",
                                    fundingSource: workshop.fundingSource || "",
                                    certificates:
                                      workshop.certificates || false,
                                    photos: workshop.photos || "",
                                    resources: workshop.resources || "",
                                    remarks: workshop.remarks || "",
                                  });
                                  setIsEditModalOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Are you sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will
                                      permanently delete the workshop.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(workshop._id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex items-center justify-between space-x-2 py-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          page: Math.max(prev.page - 1, 1),
                        }))
                      }
                      disabled={pagination.page === 1}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        Page {pagination.page} of {pagination.pages}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          page: Math.min(prev.page + 1, prev.pages),
                        }))
                      }
                      disabled={pagination.page === pagination.pages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Create Modal */}
            <Dialog
              open={isCreateModalOpen}
              onOpenChange={setIsCreateModalOpen}
            >
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Workshop</DialogTitle>
                  <DialogDescription>
                    Fill in the details to schedule a new workshop or awareness
                    program
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="workshopTitle">Workshop Title *</Label>
                      <Input
                        id="workshopTitle"
                        value={formData.workshopTitle}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            workshopTitle: e.target.value,
                          })
                        }
                        placeholder="Enter workshop title"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          setFormData({ ...formData, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {workshopCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="facilitator">Facilitator *</Label>
                      <Input
                        id="facilitator"
                        value={formData.facilitator}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            facilitator: e.target.value,
                          })
                        }
                        placeholder="Enter facilitator name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="venue">Venue *</Label>
                      <Input
                        id="venue"
                        value={formData.venue}
                        onChange={(e) =>
                          setFormData({ ...formData, venue: e.target.value })
                        }
                        placeholder="Enter venue"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="dateScheduled">Date Scheduled</Label>
                      <Input
                        id="dateScheduled"
                        type="date"
                        value={formData.dateScheduled}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dateScheduled: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="timeScheduled">Time Scheduled</Label>
                      <Input
                        id="timeScheduled"
                        type="time"
                        value={formData.timeScheduled}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            timeScheduled: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Enter workshop description"
                      rows={3}
                    />
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Create Workshop</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Workshop</DialogTitle>
                  <DialogDescription>
                    Update the workshop information
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-workshopTitle">
                        Workshop Title *
                      </Label>
                      <Input
                        id="edit-workshopTitle"
                        value={formData.workshopTitle}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            workshopTitle: e.target.value,
                          })
                        }
                        placeholder="Enter workshop title"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          setFormData({ ...formData, status: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Update Workshop</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* View Modal */}
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Workshop Details</DialogTitle>
                  <DialogDescription>
                    View detailed information about this workshop
                  </DialogDescription>
                </DialogHeader>
                {selectedWorkshop && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Workshop Title</Label>
                        <p className="text-sm font-medium">
                          {selectedWorkshop.workshopTitle}
                        </p>
                      </div>
                      <div>
                        <Label>Category</Label>
                        <p className="text-sm font-medium">
                          {selectedWorkshop.category}
                        </p>
                      </div>
                      <div>
                        <Label>Facilitator</Label>
                        <p className="text-sm font-medium">
                          {selectedWorkshop.facilitator}
                        </p>
                      </div>
                      <div>
                        <Label>Status</Label>
                        <Badge
                          className={getStatusColor(selectedWorkshop.status)}
                        >
                          {getStatusIcon(selectedWorkshop.status)}
                          <span className="ml-1">
                            {selectedWorkshop.status}
                          </span>
                        </Badge>
                      </div>
                    </div>
                    {selectedWorkshop.description && (
                      <div>
                        <Label>Description</Label>
                        <p className="text-sm mt-1">
                          {selectedWorkshop.description}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                <DialogFooter>
                  <Button onClick={() => setIsViewModalOpen(false)}>
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workshops;
