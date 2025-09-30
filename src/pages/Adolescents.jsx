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
  DialogTrigger,
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
  Download,
  RefreshCw,
  Menu,
} from "lucide-react";
import { adolescentsAPI } from "../services/api";
import Sidebar from "../components/Sidebar";

const Adolescents = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adolescents, setAdolescents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    gender: "",
    ageGroup: "",
    wardNo: "",
    habitation: "",
    educationStatus: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    householdCode: "",
    nameOfAdolescent: "",
    uniqueId: "",
    gender: "",
    age: "",
    contactNo: "",
    headOfHousehold: "",
    wardNo: "",
    habitation: "",
    projectResponsible: "",
    dateOfReporting: "",
    reportedBy: "",
    educationStatus: "",
    schoolName: "",
    class: "",
    healthStatus: "",
    nutritionalStatus: "",
    mentalHealthStatus: "",
    riskBehaviors: "",
    socialSkillsAssessment: "",
    vocationalInterests: "",
    servicesProvided: "",
    referralsGiven: "",
    progressReporting: {},
  });

  // Fetch adolescents records
  const fetchAdolescents = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        ...filters,
      };

      const response = await adolescentsAPI.getAll(params);
      setAdolescents(response.data.adolescents);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error("Failed to fetch adolescents records");
      console.error("Error fetching adolescents records:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdolescents();
  }, [pagination.page, pagination.limit, searchTerm, filters]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedRecord) {
        await adolescentsAPI.update(selectedRecord._id, formData);
        toast.success("Adolescent record updated successfully");
        setIsEditModalOpen(false);
      } else {
        await adolescentsAPI.create(formData);
        toast.success("Adolescent record created successfully");
        setIsCreateModalOpen(false);
      }
      fetchAdolescents();
      resetForm();
    } catch (error) {
      toast.error(
        selectedRecord ? "Failed to update record" : "Failed to create record"
      );
      console.error("Error submitting form:", error);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await adolescentsAPI.delete(id);
      toast.success("Adolescent record deleted successfully");
      fetchAdolescents();
    } catch (error) {
      toast.error("Failed to delete record");
      console.error("Error deleting record:", error);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      householdCode: "",
      nameOfAdolescent: "",
      uniqueId: "",
      gender: "",
      age: "",
      contactNo: "",
      headOfHousehold: "",
      wardNo: "",
      habitation: "",
      projectResponsible: "",
      dateOfReporting: "",
      reportedBy: "",
      educationStatus: "",
      schoolName: "",
      class: "",
      healthStatus: "",
      nutritionalStatus: "",
      mentalHealthStatus: "",
      riskBehaviors: "",
      socialSkillsAssessment: "",
      vocationalInterests: "",
      servicesProvided: "",
      referralsGiven: "",
      progressReporting: {},
    });
    setSelectedRecord(null);
  };

  // Handle edit
  const handleEdit = (record) => {
    setSelectedRecord(record);
    setFormData({
      householdCode: record.householdCode || "",
      nameOfAdolescent: record.nameOfAdolescent || "",
      uniqueId: record.uniqueId || "",
      gender: record.gender || "",
      age: record.age || "",
      contactNo: record.contactNo || "",
      headOfHousehold: record.headOfHousehold || "",
      wardNo: record.wardNo || "",
      habitation: record.habitation || "",
      projectResponsible: record.projectResponsible || "",
      dateOfReporting: record.dateOfReporting
        ? new Date(record.dateOfReporting).toISOString().split("T")[0]
        : "",
      reportedBy: record.reportedBy || "",
      educationStatus: record.educationStatus || "",
      schoolName: record.schoolName || "",
      class: record.class || "",
      healthStatus: record.healthStatus || "",
      nutritionalStatus: record.nutritionalStatus || "",
      mentalHealthStatus: record.mentalHealthStatus || "",
      riskBehaviors: record.riskBehaviors || "",
      socialSkillsAssessment: record.socialSkillsAssessment || "",
      vocationalInterests: record.vocationalInterests || "",
      servicesProvided: record.servicesProvided || "",
      referralsGiven: record.referralsGiven || "",
      progressReporting: record.progressReporting || {},
    });
    setIsEditModalOpen(true);
  };

  // Handle view
  const handleView = (record) => {
    setSelectedRecord(record);
    setIsViewModalOpen(true);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle filter change
  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      gender: "",
      ageGroup: "",
      wardNo: "",
      habitation: "",
      educationStatus: "",
    });
    setSearchTerm("");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </Button>
              <div className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-purple-600" />
                <h1 className="text-2xl font-bold text-gray-900">
                  Adolescents
                </h1>
              </div>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Adolescent Record
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <div>
                  <Label htmlFor="search">Search</Label>
                  <Input
                    id="search"
                    placeholder="Search records..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  {/* <Label htmlFor="gender">Gender</Label>
                  <Select value={filters.gender} onValueChange={(value) => handleFilterChange("gender", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Genders" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Genders</SelectItem>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select> */}
                </div>
                <div>
                  {/* <Label htmlFor="ageGroup">Age Group</Label>
                  <Select value={filters.ageGroup} onValueChange={(value) => handleFilterChange("ageGroup", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Ages" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ages</SelectItem>
                      <SelectItem value="10-12">10-12 years</SelectItem>
                      <SelectItem value="13-15">13-15 years</SelectItem>
                      <SelectItem value="16-19">16-19 years</SelectItem>
                    </SelectContent>
                  </Select> */}
                </div>
                <div>
                  {/* <Label htmlFor="educationStatus">Education Status</Label>
                  <Select value={filters.educationStatus} onValueChange={(value) => handleFilterChange("educationStatus", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="In School">In School</SelectItem>
                      <SelectItem value="Dropped Out">Dropped Out</SelectItem>
                      <SelectItem value="Never Enrolled">Never Enrolled</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select> */}
                </div>
                <div>
                  {/* <Label htmlFor="wardNo">Ward No</Label>
                  <Input
                    id="wardNo"
                    placeholder="Filter by ward"
                    value={filters.wardNo}
                    onChange={(e) => handleFilterChange("wardNo", e.target.value)}
                  /> */}
                </div>
                <div className="flex items-end">
                  {/* <Button variant="outline" onClick={clearFilters} className="w-full">
                    Clear Filters
                  </Button> */}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Records Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  Adolescent Records ({pagination.totalItems || 0})
                </CardTitle>
                <Button
                  variant="outline"
                  onClick={fetchAdolescents}
                  disabled={loading}
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Age/Gender</TableHead>
                      <TableHead>Education</TableHead>
                      <TableHead>Health Status</TableHead>
                      <TableHead>Ward/Habitation</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          <RefreshCw className="h-4 w-4 animate-spin mx-auto" />
                        </TableCell>
                      </TableRow>
                    ) : adolescents.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center py-4 text-gray-500"
                        >
                          No adolescent records found
                        </TableCell>
                      </TableRow>
                    ) : (
                      adolescents.map((record) => (
                        <TableRow key={record._id}>
                          <TableCell className="font-medium">
                            {record.nameOfAdolescent}
                          </TableCell>
                          <TableCell>
                            {record.age}, {record.gender}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                record.educationStatus === "In School"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {record.educationStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                record.healthStatus === "Healthy"
                                  ? "default"
                                  : record.healthStatus === "At Risk"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {record.healthStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            Ward {record.wardNo}, {record.habitation}
                          </TableCell>
                          <TableCell>{record.contactNo}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleView(record)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(record)}
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
                                      Delete Record
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure? This action cannot be
                                      undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(record._id)}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500">
                    Showing{" "}
                    {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}{" "}
                    to{" "}
                    {Math.min(
                      pagination.currentPage * pagination.itemsPerPage,
                      pagination.totalItems
                    )}{" "}
                    of {pagination.totalItems} entries
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          page: prev.page - 1,
                        }))
                      }
                      disabled={!pagination.hasPrevPage}
                    >
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          page: prev.page + 1,
                        }))
                      }
                      disabled={!pagination.hasNextPage}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Adolescent Record</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="householdCode">Household Code *</Label>
                <Input
                  id="householdCode"
                  name="householdCode"
                  value={formData.householdCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="nameOfAdolescent">Name *</Label>
                <Input
                  id="nameOfAdolescent"
                  name="nameOfAdolescent"
                  value={formData.nameOfAdolescent}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="uniqueId">Unique ID</Label>
                <Input
                  id="uniqueId"
                  name="uniqueId"
                  value={formData.uniqueId}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, gender: value }))
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
                  name="age"
                  type="number"
                  min="10"
                  max="19"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="contactNo">Contact Number *</Label>
                <Input
                  id="contactNo"
                  name="contactNo"
                  value={formData.contactNo}
                  onChange={handleInputChange}
                  pattern="[6-9][0-9]{9}"
                  required
                />
              </div>
              <div>
                <Label htmlFor="wardNo">Ward No *</Label>
                <Input
                  id="wardNo"
                  name="wardNo"
                  value={formData.wardNo}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="habitation">Habitation *</Label>
                <Input
                  id="habitation"
                  name="habitation"
                  value={formData.habitation}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="educationStatus">Education Status</Label>
                <Select
                  value={formData.educationStatus}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, educationStatus: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="In School">In School</SelectItem>
                    <SelectItem value="Dropped Out">Dropped Out</SelectItem>
                    <SelectItem value="Never Enrolled">
                      Never Enrolled
                    </SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="schoolName">School Name</Label>
                <Input
                  id="schoolName"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="class">Class</Label>
                <Input
                  id="class"
                  name="class"
                  value={formData.class}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="healthStatus">Health Status</Label>
                <Select
                  value={formData.healthStatus}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, healthStatus: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Healthy">Healthy</SelectItem>
                    <SelectItem value="At Risk">At Risk</SelectItem>
                    <SelectItem value="Needs Attention">
                      Needs Attention
                    </SelectItem>
                  </SelectContent>
                </Select>
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
              <Button type="submit">Create Record</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit and View modals similar to create */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Adolescent Record</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsEditModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Adolescent Record Details</DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Name</Label>
                  <p>{selectedRecord.nameOfAdolescent}</p>
                </div>
                <div>
                  <Label className="font-semibold">Age/Gender</Label>
                  <p>
                    {selectedRecord.age}, {selectedRecord.gender}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Adolescents;
