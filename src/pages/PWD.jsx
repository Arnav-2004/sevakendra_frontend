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
  Accessibility,
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
import { pwdAPI } from "../services/api";
import Sidebar from "../components/Sidebar";

const PWD = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pwd, setPwd] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    gender: "",
    disabilityType: "",
    disabilitySeverity: "",
    wardNo: "",
    habitation: "",
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
    nameOfPwd: "",
    uniqueId: "",
    gender: "",
    age: "",
    contactNo: "",
    headOfHousehold: "",
    wardNo: "",
    habitation: "",
    projectResponsible: "",
    disabilityType: "",
    disabilitySeverity: "",
    disabilityCertificate: "",
    dateOfReporting: "",
    reportedBy: "",
    medicalAssessment: "",
    functionalAssessment: "",
    psychosocialAssessment: "",
    rehabilitationNeeds: "",
    assistiveDevicesProvided: "",
    servicesProvided: "",
    referralsGiven: "",
    progressReporting: {},
  });

  // Fetch PWD records
  const fetchPwd = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        ...filters,
      };

      const response = await pwdAPI.getAll(params);
      setPwd(response.data.pwd);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error("Failed to fetch PWD records");
      console.error("Error fetching PWD records:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPwd();
  }, [pagination.page, pagination.limit, searchTerm, filters]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedRecord) {
        await pwdAPI.update(selectedRecord._id, formData);
        toast.success("PWD record updated successfully");
        setIsEditModalOpen(false);
      } else {
        await pwdAPI.create(formData);
        toast.success("PWD record created successfully");
        setIsCreateModalOpen(false);
      }
      fetchPwd();
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
      await pwdAPI.delete(id);
      toast.success("PWD record deleted successfully");
      fetchPwd();
    } catch (error) {
      toast.error("Failed to delete record");
      console.error("Error deleting record:", error);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      householdCode: "",
      nameOfPwd: "",
      uniqueId: "",
      gender: "",
      age: "",
      contactNo: "",
      headOfHousehold: "",
      wardNo: "",
      habitation: "",
      projectResponsible: "",
      disabilityType: "",
      disabilitySeverity: "",
      disabilityCertificate: "",
      dateOfReporting: "",
      reportedBy: "",
      medicalAssessment: "",
      functionalAssessment: "",
      psychosocialAssessment: "",
      rehabilitationNeeds: "",
      assistiveDevicesProvided: "",
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
      nameOfPwd: record.nameOfPwd || "",
      uniqueId: record.uniqueId || "",
      gender: record.gender || "",
      age: record.age || "",
      contactNo: record.contactNo || "",
      headOfHousehold: record.headOfHousehold || "",
      wardNo: record.wardNo || "",
      habitation: record.habitation || "",
      projectResponsible: record.projectResponsible || "",
      disabilityType: record.disabilityType || "",
      disabilitySeverity: record.disabilitySeverity || "",
      disabilityCertificate: record.disabilityCertificate || "",
      dateOfReporting: record.dateOfReporting
        ? new Date(record.dateOfReporting).toISOString().split("T")[0]
        : "",
      reportedBy: record.reportedBy || "",
      medicalAssessment: record.medicalAssessment || "",
      functionalAssessment: record.functionalAssessment || "",
      psychosocialAssessment: record.psychosocialAssessment || "",
      rehabilitationNeeds: record.rehabilitationNeeds || "",
      assistiveDevicesProvided: record.assistiveDevicesProvided || "",
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
      disabilityType: "",
      disabilitySeverity: "",
      wardNo: "",
      habitation: "",
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
                <Accessibility className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">
                  Persons with Disabilities
                </h1>
              </div>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add PWD Record
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
                  {/* <Label htmlFor="disabilityType">Disability Type</Label>
                  <Select value={filters.disabilityType} onValueChange={(value) => handleFilterChange("disabilityType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Physical">Physical</SelectItem>
                      <SelectItem value="Visual">Visual</SelectItem>
                      <SelectItem value="Hearing">Hearing</SelectItem>
                      <SelectItem value="Speech">Speech</SelectItem>
                      <SelectItem value="Intellectual">Intellectual</SelectItem>
                      <SelectItem value="Mental">Mental</SelectItem>
                      <SelectItem value="Multiple">Multiple</SelectItem>
                    </SelectContent>
                  </Select> */}
                </div>
                <div>
                  {/* <Label htmlFor="disabilitySeverity">Severity</Label>
                  <Select value={filters.disabilitySeverity} onValueChange={(value) => handleFilterChange("disabilitySeverity", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Severities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severities</SelectItem>
                      <SelectItem value="Mild">Mild</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="Severe">Severe</SelectItem>
                      <SelectItem value="Profound">Profound</SelectItem>
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
                  PWD Records ({pagination.totalItems || 0})
                </CardTitle>
                <Button variant="outline" onClick={fetchPwd} disabled={loading}>
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
                      <TableHead>Disability Type</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Ward/Habitation</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Certificate</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4">
                          <RefreshCw className="h-4 w-4 animate-spin mx-auto" />
                        </TableCell>
                      </TableRow>
                    ) : pwd.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center py-4 text-gray-500"
                        >
                          No PWD records found
                        </TableCell>
                      </TableRow>
                    ) : (
                      pwd.map((record) => (
                        <TableRow key={record._id}>
                          <TableCell className="font-medium">
                            {record.nameOfPwd}
                          </TableCell>
                          <TableCell>
                            {record.age}, {record.gender}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {record.disabilityType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                record.disabilitySeverity === "Mild"
                                  ? "default"
                                  : record.disabilitySeverity === "Moderate"
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {record.disabilitySeverity}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            Ward {record.wardNo}, {record.habitation}
                          </TableCell>
                          <TableCell>{record.contactNo}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                record.disabilityCertificate
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {record.disabilityCertificate ? "Yes" : "No"}
                            </Badge>
                          </TableCell>
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
            <DialogTitle>Add New PWD Record</DialogTitle>
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
                <Label htmlFor="nameOfPwd">Name *</Label>
                <Input
                  id="nameOfPwd"
                  name="nameOfPwd"
                  value={formData.nameOfPwd}
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
                  min="0"
                  max="120"
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
                <Label htmlFor="disabilityType">Disability Type *</Label>
                <Select
                  value={formData.disabilityType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, disabilityType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Physical">Physical</SelectItem>
                    <SelectItem value="Visual">Visual</SelectItem>
                    <SelectItem value="Hearing">Hearing</SelectItem>
                    <SelectItem value="Speech">Speech</SelectItem>
                    <SelectItem value="Intellectual">Intellectual</SelectItem>
                    <SelectItem value="Mental">Mental</SelectItem>
                    <SelectItem value="Multiple">Multiple</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="disabilitySeverity">Severity *</Label>
                <Select
                  value={formData.disabilitySeverity}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      disabilitySeverity: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mild">Mild</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Severe">Severe</SelectItem>
                    <SelectItem value="Profound">Profound</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="disabilityCertificate">
                  Disability Certificate
                </Label>
                <Select
                  value={formData.disabilityCertificate}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      disabilityCertificate: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Certificate status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Applied">Applied</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dateOfReporting">Date of Reporting</Label>
                <Input
                  id="dateOfReporting"
                  name="dateOfReporting"
                  type="date"
                  value={formData.dateOfReporting}
                  onChange={handleInputChange}
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
              <Button type="submit">Create Record</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit and View modals similar to create */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit PWD Record</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsEditModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>PWD Record Details</DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Name</Label>
                  <p>{selectedRecord.nameOfPwd}</p>
                </div>
                <div>
                  <Label className="font-semibold">Age/Gender</Label>
                  <p>
                    {selectedRecord.age}, {selectedRecord.gender}
                  </p>
                </div>
                <div>
                  <Label className="font-semibold">Disability Type</Label>
                  <Badge>{selectedRecord.disabilityType}</Badge>
                </div>
                <div>
                  <Label className="font-semibold">Severity</Label>
                  <Badge>{selectedRecord.disabilitySeverity}</Badge>
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

export default PWD;
