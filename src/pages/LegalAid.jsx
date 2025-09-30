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
  Scale,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  Menu,
  Calendar,
  User,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Phone,
} from "lucide-react";
import { legalAidServiceAPI } from "../services/api";
import Sidebar from "../components/Sidebar";

const LegalAid = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [legalAidServices, setLegalAidServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    caseType: "all",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [selectedService, setSelectedService] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    caseId: "",
    clientName: "",
    age: "",
    gender: "",
    contactNumber: "",
    address: "",
    wardNo: "",
    habitation: "",
    caseType: "",
    caseDescription: "",
    dateRegistered: "",
    lawyerAssigned: "",
    lawyerContact: "",
    courtName: "",
    caseNumber: "",
    nextHearingDate: "",
    caseStatus: "Open",
    documentsRequired: "",
    documentsSubmitted: "",
    legalAdviceGiven: "",
    serviceCharges: "",
    paymentStatus: "Pending",
    outcome: "",
    remarks: "",
    followUpRequired: false,
    nextFollowUpDate: "",
  });

  const caseTypes = [
    "Civil Case",
    "Criminal Case",
    "Family Dispute",
    "Property Dispute",
    "Consumer Case",
    "Labor Dispute",
    "Domestic Violence",
    "Child Custody",
    "Divorce Proceedings",
    "Maintenance Case",
    "Adoption",
    "Legal Documentation",
    "RTI Application",
    "Compensation Claim",
    "Other",
  ];

  const statusOptions = [
    "Open",
    "In Progress",
    "Hearing Scheduled",
    "Under Review",
    "Resolved",
    "Closed",
    "Dismissed",
    "Settled",
  ];

  const paymentStatuses = [
    "Pending",
    "Partial Payment",
    "Paid",
    "Waived",
    "Pro Bono",
  ];

  const genderOptions = ["Male", "Female", "Other"];

  // Fetch legal aid services
  const fetchLegalAidServices = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        ...filters,
      };

      const response = await legalAidServiceAPI.getAll(params);

      // Handle different possible response structures
      const servicesData =
        response.data.legalAidServices ||
        response.data.data ||
        response.data ||
        [];
      const paginationData = response.data.pagination || {
        page: 1,
        limit: 10,
        total: Array.isArray(servicesData) ? servicesData.length : 0,
        pages: 1,
      };

      setLegalAidServices(Array.isArray(servicesData) ? servicesData : []);
      setPagination(paginationData);
    } catch (error) {
      toast.error("Failed to fetch legal aid services");
      console.error("Error fetching legal aid services:", error);
      setLegalAidServices([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchLegalAidServices();
  }, []);

  // Handle page changes and search/filter changes
  useEffect(() => {
    if (pagination.page !== 1) {
      fetchLegalAidServices();
    }
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPagination((prev) => ({ ...prev, page: 1 }));
      fetchLegalAidServices();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filters.status, filters.caseType]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedService) {
        await legalAidServiceAPI.update(selectedService._id, formData);
        toast.success("Legal aid service updated successfully");
        setIsEditModalOpen(false);
      } else {
        await legalAidServiceAPI.create(formData);
        toast.success("Legal aid service created successfully");
        setIsCreateModalOpen(false);
      }
      fetchLegalAidServices();
      resetForm();
    } catch (error) {
      toast.error(
        selectedService
          ? "Failed to update legal aid service"
          : "Failed to create legal aid service"
      );
      console.error("Error submitting form:", error);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      caseId: "",
      clientName: "",
      age: "",
      gender: "",
      contactNumber: "",
      address: "",
      wardNo: "",
      habitation: "",
      caseType: "",
      caseDescription: "",
      dateRegistered: "",
      lawyerAssigned: "",
      lawyerContact: "",
      courtName: "",
      caseNumber: "",
      nextHearingDate: "",
      caseStatus: "Open",
      documentsRequired: "",
      documentsSubmitted: "",
      legalAdviceGiven: "",
      serviceCharges: "",
      paymentStatus: "Pending",
      outcome: "",
      remarks: "",
      followUpRequired: false,
      nextFollowUpDate: "",
    });
    setSelectedService(null);
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await legalAidServiceAPI.delete(id);
      toast.success("Legal aid service deleted successfully");
      fetchLegalAidServices();
    } catch (error) {
      toast.error("Failed to delete legal aid service");
      console.error("Error deleting legal aid service:", error);
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Closed":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Settled":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "Hearing Scheduled":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "Open":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "Dismissed":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "Under Review":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "Resolved":
        return <CheckCircle className="h-3 w-3" />;
      case "Closed":
        return <CheckCircle className="h-3 w-3" />;
      case "Settled":
        return <CheckCircle className="h-3 w-3" />;
      case "In Progress":
        return <Clock className="h-3 w-3" />;
      case "Hearing Scheduled":
        return <Calendar className="h-3 w-3" />;
      case "Open":
        return <FileText className="h-3 w-3" />;
      case "Dismissed":
        return <XCircle className="h-3 w-3" />;
      case "Under Review":
        return <AlertCircle className="h-3 w-3" />;
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
        activeItem="legalaid"
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
          <h1 className="text-lg font-semibold">Legal Aid Services</h1>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Legal Aid Services
                </h1>
                <p className="text-gray-600">
                  Manage legal assistance and case tracking for beneficiaries
                </p>
              </div>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Legal Case
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
                      placeholder="Search cases..."
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
                    value={filters.caseType}
                    onValueChange={(value) =>
                      setFilters({ ...filters, caseType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by case type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Case Types</SelectItem>
                      {caseTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select> */}
                </div>
              </CardContent>
            </Card>

            {/* Legal Aid Services Table */}
            <Card>
              <CardHeader>
                <CardTitle>Legal Aid Cases ({pagination.total})</CardTitle>
                <CardDescription>
                  Track and manage legal assistance cases and services
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
                        <TableHead>Case ID</TableHead>
                        <TableHead>Client Name</TableHead>
                        <TableHead>Case Type</TableHead>
                        <TableHead>Registration Date</TableHead>
                        <TableHead>Next Hearing</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.isArray(legalAidServices) &&
                      legalAidServices.length > 0 ? (
                        legalAidServices.map((service) => (
                          <TableRow key={service._id}>
                            <TableCell className="font-medium">
                              {service.caseId}
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {service.clientName}
                                </div>
                                <div className="text-sm text-muted-foreground flex items-center">
                                  <Phone className="mr-1 h-3 w-3" />
                                  {service.contactNumber}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {service.caseType}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center text-sm">
                                <Calendar className="mr-1 h-3 w-3" />
                                {service.dateRegistered
                                  ? new Date(
                                      service.dateRegistered
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center text-sm">
                                <Calendar className="mr-1 h-3 w-3" />
                                {service.nextHearingDate
                                  ? new Date(
                                      service.nextHearingDate
                                    ).toLocaleDateString()
                                  : "Not scheduled"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={getStatusColor(service.caseStatus)}
                              >
                                {getStatusIcon(service.caseStatus)}
                                <span className="ml-1">
                                  {service.caseStatus}
                                </span>
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedService(service);
                                    setIsViewModalOpen(true);
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedService(service);
                                    setFormData({
                                      caseId: service.caseId || "",
                                      clientName: service.clientName || "",
                                      age: service.age || "",
                                      gender: service.gender || "",
                                      contactNumber:
                                        service.contactNumber || "",
                                      address: service.address || "",
                                      wardNo: service.wardNo || "",
                                      habitation: service.habitation || "",
                                      caseType: service.caseType || "",
                                      caseDescription:
                                        service.caseDescription || "",
                                      dateRegistered: service.dateRegistered
                                        ? service.dateRegistered.split("T")[0]
                                        : "",
                                      lawyerAssigned:
                                        service.lawyerAssigned || "",
                                      lawyerContact:
                                        service.lawyerContact || "",
                                      courtName: service.courtName || "",
                                      caseNumber: service.caseNumber || "",
                                      nextHearingDate: service.nextHearingDate
                                        ? service.nextHearingDate.split("T")[0]
                                        : "",
                                      caseStatus: service.caseStatus || "Open",
                                      documentsRequired:
                                        service.documentsRequired || "",
                                      documentsSubmitted:
                                        service.documentsSubmitted || "",
                                      legalAdviceGiven:
                                        service.legalAdviceGiven || "",
                                      serviceCharges:
                                        service.serviceCharges || "",
                                      paymentStatus:
                                        service.paymentStatus || "Pending",
                                      outcome: service.outcome || "",
                                      remarks: service.remarks || "",
                                      followUpRequired:
                                        service.followUpRequired || false,
                                      nextFollowUpDate: service.nextFollowUpDate
                                        ? service.nextFollowUpDate.split("T")[0]
                                        : "",
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
                                        permanently delete the legal aid case.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() =>
                                          handleDelete(service._id)
                                        }
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
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                              <Scale className="h-8 w-8 mb-2" />
                              <p>No legal aid cases found</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
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
                  <DialogTitle>Add New Legal Case</DialogTitle>
                  <DialogDescription>
                    Fill in the details to create a new legal aid case
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="caseId">Case ID *</Label>
                      <Input
                        id="caseId"
                        value={formData.caseId}
                        onChange={(e) =>
                          setFormData({ ...formData, caseId: e.target.value })
                        }
                        placeholder="Enter case ID"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientName">Client Name *</Label>
                      <Input
                        id="clientName"
                        value={formData.clientName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            clientName: e.target.value,
                          })
                        }
                        placeholder="Enter client name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="caseType">Case Type *</Label>
                      <Select
                        value={formData.caseType}
                        onValueChange={(value) =>
                          setFormData({ ...formData, caseType: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select case type" />
                        </SelectTrigger>
                        <SelectContent>
                          {caseTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="dateRegistered">Registration Date</Label>
                      <Input
                        id="dateRegistered"
                        type="date"
                        value={formData.dateRegistered}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dateRegistered: e.target.value,
                          })
                        }
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
                    <Button type="submit">Create Case</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Legal Case</DialogTitle>
                  <DialogDescription>
                    Update the case information
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-caseId">Case ID *</Label>
                      <Input
                        id="edit-caseId"
                        value={formData.caseId}
                        onChange={(e) =>
                          setFormData({ ...formData, caseId: e.target.value })
                        }
                        placeholder="Enter case ID"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-caseStatus">Case Status</Label>
                      <Select
                        value={formData.caseStatus}
                        onValueChange={(value) =>
                          setFormData({ ...formData, caseStatus: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select case status" />
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
                    <Button type="submit">Update Case</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* View Modal */}
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Legal Case Details</DialogTitle>
                  <DialogDescription>
                    View detailed information about this legal case
                  </DialogDescription>
                </DialogHeader>
                {selectedService && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Case ID</Label>
                        <p className="text-sm font-medium">
                          {selectedService.caseId}
                        </p>
                      </div>
                      <div>
                        <Label>Client Name</Label>
                        <p className="text-sm font-medium">
                          {selectedService.clientName}
                        </p>
                      </div>
                      <div>
                        <Label>Case Type</Label>
                        <p className="text-sm font-medium">
                          {selectedService.caseType}
                        </p>
                      </div>
                      <div>
                        <Label>Case Status</Label>
                        <Badge
                          className={getStatusColor(selectedService.caseStatus)}
                        >
                          {getStatusIcon(selectedService.caseStatus)}
                          <span className="ml-1">
                            {selectedService.caseStatus}
                          </span>
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

export default LegalAid;
