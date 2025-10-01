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
import { Checkbox } from "@/components/ui/checkbox";
import {
  UserMinus,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  Menu,
} from "lucide-react";
import { dropoutAPI } from "../services/api";
import Sidebar from "../components/Sidebar";

const Dropouts = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropouts, setDropouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    wardNo: "",
    gender: "",
    enrollmentStatus: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [selectedDropout, setSelectedDropout] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    householdCode: "",
    name: "",
    gender: "",
    age: "",
    contactNo: "",
    headOfHousehold: "",
    wardNo: "",
    habitation: "",
    projectResponsible: "",
    dateOfReporting: "",
    reportedBy: "",
    yearOfDropout: "",
    educationLevelWhenDropout: "",
    schoolNameWhenDropout: "",
    reasonForDropout: "",
    documentsCheck: {
      birthCertificate: false,
      polioCard: false,
      adharCard: false,
      transferCertificate: false,
    },
    dateOfEducationalAssessment: "",
    educationalScreeningResults: "",
    careerCounselling: "",
    counselingReport: "",
    individualCarePlan: "",
    enrollmentStatus: "Pending",
    dateOfReAdmission: "",
    educationLevelWhenReAdmission: "",
    schoolNameWhenReAdmission: "",
    progressReporting: {},
    photoDocumentation: {},
  });

  // Fetch dropouts
  const fetchDropouts = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        ...filters,
      };

      const response = await dropoutAPI.getAll(params);
      setDropouts(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error("Failed to fetch dropouts");
      console.error("Error fetching dropouts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDropouts();
  }, [pagination.page, pagination.limit, searchTerm, filters]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedDropout) {
        await dropoutAPI.update(selectedDropout._id, formData);
        toast.success("Dropout record updated successfully");
        setIsEditModalOpen(false);
      } else {
        await dropoutAPI.create(formData);
        toast.success("Dropout record created successfully");
        setIsCreateModalOpen(false);
      }

      fetchDropouts();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await dropoutAPI.delete(id);
      toast.success("Dropout record deleted successfully");
      fetchDropouts();
    } catch (error) {
      toast.error("Failed to delete dropout record");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      householdCode: "",
      name: "",
      gender: "",
      age: "",
      contactNo: "",
      headOfHousehold: "",
      wardNo: "",
      habitation: "",
      projectResponsible: "",
      dateOfReporting: "",
      reportedBy: "",
      yearOfDropout: "",
      educationLevelWhenDropout: "",
      schoolNameWhenDropout: "",
      reasonForDropout: "",
      documentsCheck: {
        birthCertificate: false,
        polioCard: false,
        adharCard: false,
        transferCertificate: false,
      },
      dateOfEducationalAssessment: "",
      educationalScreeningResults: "",
      careerCounselling: "",
      counselingReport: "",
      individualCarePlan: "",
      enrollmentStatus: "Pending",
      dateOfReAdmission: "",
      educationLevelWhenReAdmission: "",
      schoolNameWhenReAdmission: "",
      progressReporting: {},
      photoDocumentation: {},
    });
    setSelectedDropout(null);
  };

  // Open edit modal
  const openEditModal = (dropout) => {
    setSelectedDropout(dropout);
    setFormData({
      ...dropout,
      dateOfReporting: dropout.dateOfReporting
        ? new Date(dropout.dateOfReporting).toISOString().split("T")[0]
        : "",
      dateOfEducationalAssessment: dropout.dateOfEducationalAssessment
        ? new Date(dropout.dateOfEducationalAssessment)
            .toISOString()
            .split("T")[0]
        : "",
      dateOfReAdmission: dropout.dateOfReAdmission
        ? new Date(dropout.dateOfReAdmission).toISOString().split("T")[0]
        : "",
    });
    setIsEditModalOpen(true);
  };

  // Open view modal
  const openViewModal = (dropout) => {
    setSelectedDropout(dropout);
    setIsViewModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeItem="dropouts"
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
          <h1 className="text-lg font-semibold">Dropouts</h1>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dropouts</h1>
                <p className="text-gray-600">Manage dropout records</p>
              </div>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Dropout Record
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search dropouts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dropouts Table */}
            <Card>
              <CardHeader>
                <CardTitle>Dropouts ({pagination.total})</CardTitle>
                <CardDescription>
                  Manage and track all dropout records
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
                        <TableHead>Household Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Year of Dropout</TableHead>
                        <TableHead>Enrollment Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dropouts.map((dropout) => (
                        <TableRow key={dropout._id}>
                          <TableCell className="font-medium">
                            {dropout.householdCode}
                          </TableCell>
                          <TableCell>{dropout.name}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{dropout.gender}</Badge>
                          </TableCell>
                          <TableCell>{dropout.age}</TableCell>
                          <TableCell>{dropout.yearOfDropout}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                dropout.enrollmentStatus === "Enrolled"
                                  ? "default"
                                  : dropout.enrollmentStatus === "Pending"
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {dropout.enrollmentStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openViewModal(dropout)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditModal(dropout)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Are you absolutely sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will
                                      permanently delete the dropout record.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(dropout._id)}
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
                <div className="flex items-center justify-between space-x-2 py-4">
                  <div className="text-sm text-gray-700">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}{" "}
                    of {pagination.total} entries
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPagination({
                          ...pagination,
                          page: pagination.page - 1,
                        })
                      }
                      disabled={pagination.page <= 1}
                    >
                      Previous
                    </Button>
                    <div className="text-sm">
                      Page {pagination.page} of {pagination.pages}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPagination({
                          ...pagination,
                          page: pagination.page + 1,
                        })
                      }
                      disabled={pagination.page >= pagination.pages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Create Modal */}
            <Dialog
              open={isCreateModalOpen}
              onOpenChange={setIsCreateModalOpen}
            >
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Dropout Record</DialogTitle>
                  <DialogDescription>
                    Create a new dropout record with all required information.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="householdCode">Household Code *</Label>
                      <Input
                        id="householdCode"
                        value={formData.householdCode}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            householdCode: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender *</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) =>
                          setFormData({ ...formData, gender: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="age">Age *</Label>
                      <Input
                        id="age"
                        type="number"
                        value={formData.age}
                        onChange={(e) =>
                          setFormData({ ...formData, age: e.target.value })
                        }
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
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="headOfHousehold">
                        Head of Household *
                      </Label>
                      <Input
                        id="headOfHousehold"
                        value={formData.headOfHousehold}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            headOfHousehold: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="wardNo">Ward Number *</Label>
                      <Input
                        id="wardNo"
                        value={formData.wardNo}
                        onChange={(e) =>
                          setFormData({ ...formData, wardNo: e.target.value })
                        }
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
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="dateOfReporting">
                        Date of Reporting *
                      </Label>
                      <Input
                        id="dateOfReporting"
                        type="date"
                        value={formData.dateOfReporting}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dateOfReporting: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="reportedBy">Reported By *</Label>
                      <Input
                        id="reportedBy"
                        value={formData.reportedBy}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            reportedBy: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="yearOfDropout">Year of Dropout *</Label>
                      <Input
                        id="yearOfDropout"
                        type="number"
                        min={1990}
                        value={formData.yearOfDropout}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            yearOfDropout: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="educationLevelWhenDropout">
                        Education Level When Dropout *
                      </Label>
                      <Input
                        id="educationLevelWhenDropout"
                        value={formData.educationLevelWhenDropout}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            educationLevelWhenDropout: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="schoolNameWhenDropout">
                        School Name When Dropout *
                      </Label>
                      <Input
                        id="schoolNameWhenDropout"
                        value={formData.schoolNameWhenDropout}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            schoolNameWhenDropout: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="enrollmentStatus">
                        Enrollment Status
                      </Label>
                      <Select
                        value={formData.enrollmentStatus}
                        onValueChange={(value) =>
                          setFormData({ ...formData, enrollmentStatus: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Enrolled">Enrolled</SelectItem>
                          <SelectItem value="Not Enrolled">
                            Not Enrolled
                          </SelectItem>
                          <SelectItem value="In Progress">
                            In Progress
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="reasonForDropout">
                        Reason for Dropout *
                      </Label>
                      <Textarea
                        id="reasonForDropout"
                        value={formData.reasonForDropout}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            reasonForDropout: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Dropout Record</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* Edit and View Modals - Similar structure to create modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Dropout Record</DialogTitle>
                  <DialogDescription>
                    Update the dropout record information.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="editHouseholdCode">
                        Household Code *
                      </Label>
                      <Input
                        id="editHouseholdCode"
                        value={formData.householdCode}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            householdCode: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="editName">Name *</Label>
                      <Input
                        id="editName"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button type="submit">Update Dropout Record</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* View Modal */}
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Dropout Record Details</DialogTitle>
                  <DialogDescription>
                    View complete information about this dropout record.
                  </DialogDescription>
                </DialogHeader>
                {selectedDropout && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Household Code</Label>
                        <p className="text-sm font-medium">
                          {selectedDropout.householdCode}
                        </p>
                      </div>
                      <div>
                        <Label>Name</Label>
                        <p className="text-sm font-medium">
                          {selectedDropout.name}
                        </p>
                      </div>
                      <div>
                        <Label>Gender</Label>
                        <p className="text-sm font-medium">
                          {selectedDropout.gender}
                        </p>
                      </div>
                      <div>
                        <Label>Age</Label>
                        <p className="text-sm font-medium">
                          {selectedDropout.age}
                        </p>
                      </div>
                      <div>
                        <Label>Year of Dropout</Label>
                        <p className="text-sm font-medium">
                          {selectedDropout.yearOfDropout}
                        </p>
                      </div>
                      <div>
                        <Label>Enrollment Status</Label>
                        <p className="text-sm font-medium">
                          {selectedDropout.enrollmentStatus}
                        </p>
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

export default Dropouts;
