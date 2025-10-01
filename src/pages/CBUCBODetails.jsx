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
  Building2,
  Phone,
  MapPin,
} from "lucide-react";
import { cbucboDetailsAPI } from "../services/api";
import Sidebar from "../components/Sidebar";

const CBUCBODetails = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cbucboDetails, setCbucboDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    groupType: "all",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    groupId: "",
    groupName: "",
    groupType: "",
    functionalArea: "",
    wardNo: "",
    habitation: "",
    projectResponsible: "",
    dateOfFormation: "",
    totalMembers: "",
    groupLeader: "",
    contactNo: "",
    president: {
      name: "",
      contactNo: "",
      education: "",
      occupation: "",
      experience: "",
    },
    secretary: {
      name: "",
      contactNo: "",
      education: "",
      occupation: "",
      experience: "",
    },
    treasurer: {
      name: "",
      contactNo: "",
      education: "",
      occupation: "",
      experience: "",
    },
    meetingFrequency: "",
    lastMeetingDate: "",
    bankAccountDetails: "",
    savingsAmount: "",
    loanAmount: "",
    status: "Active",
    achievements: "",
    challenges: "",
    remarks: "",
  });

  const groupTypes = [
    "CBUCBO",
    "SHG",
    "Youth Group",
    "Women Group",
    "Farmer Producer Group",
    "Other",
  ];

  const statusOptions = ["Active", "Inactive", "Dissolved", "Merged"];

  const meetingFrequencies = ["Weekly", "Bi-weekly", "Monthly", "Quarterly"];

  // Fetch CBUCBO details
  const fetchCBUCBODetails = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        ...filters,
      };

      const response = await cbucboDetailsAPI.getAll(params);

      // Handle response data with fallbacks
      const cbucboData =
        response.data.cbucboDetails ||
        response.data.data ||
        response.data ||
        [];
      setCbucboDetails(Array.isArray(cbucboData) ? cbucboData : []);

      // Handle pagination data - if not provided by API, create default pagination
      if (response.data.pagination) {
        setPagination(response.data.pagination);
      } else {
        // Create default pagination based on data length
        setPagination({
          page: 1,
          limit: 10,
          total: cbucboData.length,
          pages: Math.ceil(cbucboData.length / 10),
        });
      }
    } catch (error) {
      toast.error("Failed to fetch CBUCBO details");
      console.error("Error fetching CBUCBO details:", error);
      // Set empty array on error to prevent undefined errors
      setCbucboDetails([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchCBUCBODetails();
  }, []);

  // Refetch when search or filters change
  useEffect(() => {
    fetchCBUCBODetails();
  }, [searchTerm, filters]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedGroup) {
        await cbucboDetailsAPI.update(selectedGroup._id, formData);
        toast.success("CBUCBO group updated successfully");
        setIsEditModalOpen(false);
      } else {
        await cbucboDetailsAPI.create(formData);
        toast.success("CBUCBO group created successfully");
        setIsCreateModalOpen(false);
      }
      fetchCBUCBODetails();
      resetForm();
    } catch (error) {
      toast.error(
        selectedGroup
          ? "Failed to update CBUCBO group"
          : "Failed to create CBUCBO group"
      );
      console.error("Error submitting form:", error);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      groupId: "",
      groupName: "",
      groupType: "",
      functionalArea: "",
      wardNo: "",
      habitation: "",
      projectResponsible: "",
      dateOfFormation: "",
      totalMembers: "",
      groupLeader: "",
      contactNo: "",
      president: {
        name: "",
        contactNo: "",
        education: "",
        occupation: "",
        experience: "",
      },
      secretary: {
        name: "",
        contactNo: "",
        education: "",
        occupation: "",
        experience: "",
      },
      treasurer: {
        name: "",
        contactNo: "",
        education: "",
        occupation: "",
        experience: "",
      },
      meetingFrequency: "",
      lastMeetingDate: "",
      bankAccountDetails: "",
      savingsAmount: "",
      loanAmount: "",
      status: "Active",
      achievements: "",
      challenges: "",
      remarks: "",
    });
    setSelectedGroup(null);
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await cbucboDetailsAPI.delete(id);
      toast.success("CBUCBO group deleted successfully");
      fetchCBUCBODetails();
    } catch (error) {
      toast.error("Failed to delete CBUCBO group");
      console.error("Error deleting CBUCBO group:", error);
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Inactive":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "Dissolved":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "Merged":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeItem="cbucbo"
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
          <h1 className="text-lg font-semibold">CBUCBO Details</h1>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  CBUCBO Details
                </h1>
                <p className="text-gray-600">
                  Manage Community Based Urban Cluster Community Based
                  Organizations
                </p>
              </div>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add CBUCBO Group
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
                      placeholder="Search groups..."
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
                    value={filters.groupType}
                    onValueChange={(value) =>
                      setFilters({ ...filters, groupType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {groupTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select> */}
                </div>
              </CardContent>
            </Card>

            {/* CBUCBO Groups Table */}
            <Card>
              <CardHeader>
                <CardTitle>CBUCBO Groups ({pagination.total})</CardTitle>
                <CardDescription>
                  Manage and track all Community Based Urban Cluster
                  Organizations
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
                        <TableHead>Group ID</TableHead>
                        <TableHead>Group Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Members</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cbucboDetails.map((group) => (
                        <TableRow key={group._id}>
                          <TableCell className="font-medium">
                            {group.groupId}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {group.groupName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Ward: {group.wardNo}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{group.groupType}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-sm">
                              <MapPin className="mr-1 h-3 w-3" />
                              {group.habitation}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-sm">
                              <Users className="mr-1 h-3 w-3" />
                              {group.totalMembers || 0}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(group.status)}>
                              {group.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedGroup(group);
                                  setIsViewModalOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedGroup(group);
                                  setFormData({
                                    groupId: group.groupId || "",
                                    groupName: group.groupName || "",
                                    groupType: group.groupType || "",
                                    functionalArea: group.functionalArea || "",
                                    wardNo: group.wardNo || "",
                                    habitation: group.habitation || "",
                                    projectResponsible:
                                      group.projectResponsible || "",
                                    dateOfFormation: group.dateOfFormation
                                      ? group.dateOfFormation.split("T")[0]
                                      : "",
                                    totalMembers: group.totalMembers || "",
                                    groupLeader: group.groupLeader || "",
                                    contactNo: group.contactNo || "",
                                    president: group.president || {
                                      name: "",
                                      contactNo: "",
                                      education: "",
                                      occupation: "",
                                      experience: "",
                                    },
                                    secretary: group.secretary || {
                                      name: "",
                                      contactNo: "",
                                      education: "",
                                      occupation: "",
                                      experience: "",
                                    },
                                    treasurer: group.treasurer || {
                                      name: "",
                                      contactNo: "",
                                      education: "",
                                      occupation: "",
                                      experience: "",
                                    },
                                    meetingFrequency:
                                      group.meetingFrequency || "",
                                    lastMeetingDate: group.lastMeetingDate
                                      ? group.lastMeetingDate.split("T")[0]
                                      : "",
                                    bankAccountDetails:
                                      group.bankAccountDetails || "",
                                    savingsAmount: group.savingsAmount || "",
                                    loanAmount: group.loanAmount || "",
                                    status: group.status || "Active",
                                    achievements: group.achievements || "",
                                    challenges: group.challenges || "",
                                    remarks: group.remarks || "",
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
                                      permanently delete the CBUCBO group.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(group._id)}
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
                  <DialogTitle>Add New CBUCBO Group</DialogTitle>
                  <DialogDescription>
                    Fill in the details to create a new CBUCBO group
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="groupId">Group ID *</Label>
                      <Input
                        id="groupId"
                        value={formData.groupId}
                        onChange={(e) =>
                          setFormData({ ...formData, groupId: e.target.value })
                        }
                        placeholder="Enter group ID"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="groupName">Group Name *</Label>
                      <Input
                        id="groupName"
                        value={formData.groupName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            groupName: e.target.value,
                          })
                        }
                        placeholder="Enter group name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="groupType">Group Type *</Label>
                      <Select
                        value={formData.groupType}
                        onValueChange={(value) =>
                          setFormData({ ...formData, groupType: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select group type" />
                        </SelectTrigger>
                        <SelectContent>
                          {groupTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="functionalArea">Functional Area *</Label>
                      <Input
                        id="functionalArea"
                        value={formData.functionalArea}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            functionalArea: e.target.value,
                          })
                        }
                        placeholder="Enter functional area"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="wardNo">Ward No *</Label>
                      <Input
                        id="wardNo"
                        value={formData.wardNo}
                        onChange={(e) =>
                          setFormData({ ...formData, wardNo: e.target.value })
                        }
                        placeholder="Enter ward number"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="habitation">Habitation *</Label>
                      <Input
                        id="habitation"
                        value={formData.habitation}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            habitation: e.target.value,
                          })
                        }
                        placeholder="Enter habitation"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="projectResponsible">
                        Project Responsible *
                      </Label>
                      <Input
                        id="projectResponsible"
                        value={formData.projectResponsible}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            projectResponsible: e.target.value,
                          })
                        }
                        placeholder="Enter project responsible"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="dateOfFormation">
                        Date of Formation *
                      </Label>
                      <Input
                        id="dateOfFormation"
                        type="date"
                        value={formData.dateOfFormation}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dateOfFormation: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="totalMembers">Total Members *</Label>
                      <Input
                        id="totalMembers"
                        type="number"
                        min="1"
                        value={formData.totalMembers}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            totalMembers: e.target.value,
                          })
                        }
                        placeholder="Enter total members"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="groupLeader">Group Leader *</Label>
                      <Input
                        id="groupLeader"
                        value={formData.groupLeader}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            groupLeader: e.target.value,
                          })
                        }
                        placeholder="Enter group leader name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactNo">Contact Number *</Label>
                      <Input
                        id="contactNo"
                        value={formData.contactNo}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactNo: e.target.value,
                          })
                        }
                        placeholder="Enter contact number"
                        pattern="[6-9][0-9]{9}"
                        required
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Create Group</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit CBUCBO Group</DialogTitle>
                  <DialogDescription>
                    Update the group information
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-groupId">Group ID *</Label>
                      <Input
                        id="edit-groupId"
                        value={formData.groupId}
                        onChange={(e) =>
                          setFormData({ ...formData, groupId: e.target.value })
                        }
                        placeholder="Enter group ID"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-groupName">Group Name *</Label>
                      <Input
                        id="edit-groupName"
                        value={formData.groupName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            groupName: e.target.value,
                          })
                        }
                        placeholder="Enter group name"
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
                    <Button type="submit">Update Group</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* View Modal */}
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>CBUCBO Group Details</DialogTitle>
                  <DialogDescription>
                    View detailed information about this group
                  </DialogDescription>
                </DialogHeader>
                {selectedGroup && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Group ID</Label>
                        <p className="text-sm font-medium">
                          {selectedGroup.groupId}
                        </p>
                      </div>
                      <div>
                        <Label>Group Name</Label>
                        <p className="text-sm font-medium">
                          {selectedGroup.groupName}
                        </p>
                      </div>
                      <div>
                        <Label>Group Type</Label>
                        <p className="text-sm font-medium">
                          {selectedGroup.groupType}
                        </p>
                      </div>
                      <div>
                        <Label>Status</Label>
                        <Badge className={getStatusColor(selectedGroup.status)}>
                          {selectedGroup.status}
                        </Badge>
                      </div>
                    </div>
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

export default CBUCBODetails;
