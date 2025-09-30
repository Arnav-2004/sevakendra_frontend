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
  Building2,
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
import { studyCenterAPI } from "../services/api";
import Sidebar from "../components/Sidebar";

const StudyCenters = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [studyCenters, setStudyCenters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    wardNo: "",
    projectResponsible: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [filterOptions, setFilterOptions] = useState({
    wardNumbers: [],
    projectResponsibles: [],
    fundingSources: [],
  });
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    centreName: "",
    sourceOfFunding: "",
    infrastructure: "",
    timing: "",
    studentsLevelOfEducation: "",
    wardNo: "",
    habitation: "",
    projectResponsible: "",
    dateOfEstablishment: "",
    totalStudents: "",
    groupLeader: "",
    groupLeaderContact: "",
    teacherNames: [""],
    teacherContacts: [""],
    progressReporting: {},
  });

  // Fetch study centers
  const fetchStudyCenters = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        ...filters,
      };

      const response = await studyCenterAPI.getAll(params);
      setStudyCenters(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error("Failed to fetch study centers");
      console.error("Error fetching study centers:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch filter options
  const fetchFilterOptions = async () => {
    try {
      const response = await studyCenterAPI.getFilterOptions();
      setFilterOptions(response.data);
    } catch (error) {
      console.error("Error fetching filter options:", error);
    }
  };

  useEffect(() => {
    fetchStudyCenters();
  }, [pagination.page, pagination.limit, searchTerm, filters]);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCenter) {
        await studyCenterAPI.update(selectedCenter._id, formData);
        toast.success("Study center updated successfully");
        setIsEditModalOpen(false);
      } else {
        await studyCenterAPI.create(formData);
        toast.success("Study center created successfully");
        setIsCreateModalOpen(false);
      }

      fetchStudyCenters();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await studyCenterAPI.delete(id);
      toast.success("Study center deleted successfully");
      fetchStudyCenters();
    } catch (error) {
      toast.error("Failed to delete study center");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      centreName: "",
      sourceOfFunding: "",
      infrastructure: "",
      timing: "",
      studentsLevelOfEducation: "",
      wardNo: "",
      habitation: "",
      projectResponsible: "",
      dateOfEstablishment: "",
      totalStudents: "",
      groupLeader: "",
      groupLeaderContact: "",
      teacherNames: [""],
      teacherContacts: [""],
      progressReporting: {},
    });
    setSelectedCenter(null);
  };

  // Open edit modal
  const openEditModal = (center) => {
    setSelectedCenter(center);
    setFormData({
      ...center,
      dateOfEstablishment: center.dateOfEstablishment
        ? new Date(center.dateOfEstablishment).toISOString().split("T")[0]
        : "",
    });
    setIsEditModalOpen(true);
  };

  // Open view modal
  const openViewModal = (center) => {
    setSelectedCenter(center);
    setIsViewModalOpen(true);
  };

  // Add teacher field
  const addTeacherField = () => {
    setFormData({
      ...formData,
      teacherNames: [...formData.teacherNames, ""],
      teacherContacts: [...formData.teacherContacts, ""],
    });
  };

  // Remove teacher field
  const removeTeacherField = (index) => {
    if (formData.teacherNames.length > 1) {
      const newTeacherNames = formData.teacherNames.filter(
        (_, i) => i !== index
      );
      const newTeacherContacts = formData.teacherContacts.filter(
        (_, i) => i !== index
      );
      setFormData({
        ...formData,
        teacherNames: newTeacherNames,
        teacherContacts: newTeacherContacts,
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeItem="study-centers"
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
          <h1 className="text-lg font-semibold">Study Centers</h1>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Study Centers
                </h1>
                <p className="text-gray-600">Manage education study centers</p>
              </div>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Study Center
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
                      placeholder="Search study centers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {/* <Select
              value={filters.wardNo || "all"}
              onValueChange={(value) =>
                setFilters({ ...filters, wardNo: value === "all" ? "" : value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Ward" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Wards</SelectItem>
                {filterOptions.wardNumbers.map((ward) => (
                  <SelectItem key={ward} value={ward}>
                    Ward {ward}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}
                  {/* <Select
              value={filters.projectResponsible || "all"}
              onValueChange={(value) =>
                setFilters({
                  ...filters,
                  projectResponsible: value === "all" ? "" : value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Project Responsible" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {filterOptions.projectResponsibles.map((person) => (
                  <SelectItem key={person} value={person}>
                    {person}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}
                  {/* <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setFilters({ wardNo: "", projectResponsible: "" });
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button> */}
                </div>
              </CardContent>
            </Card>

            {/* Study Centers Table */}
            <Card>
              <CardHeader>
                <CardTitle>Study Centers ({pagination.total})</CardTitle>
                <CardDescription>
                  Manage and track all study center information
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
                        <TableHead>Center Name</TableHead>
                        <TableHead>Ward No</TableHead>
                        <TableHead>Habitation</TableHead>
                        <TableHead>Total Students</TableHead>
                        <TableHead>Group Leader</TableHead>
                        <TableHead>Project Responsible</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studyCenters.map((center) => (
                        <TableRow key={center._id}>
                          <TableCell className="font-medium">
                            {center.centreName}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{center.wardNo}</Badge>
                          </TableCell>
                          <TableCell>{center.habitation}</TableCell>
                          <TableCell>{center.totalStudents}</TableCell>
                          <TableCell>{center.groupLeader}</TableCell>
                          <TableCell>{center.projectResponsible}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openViewModal(center)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditModal(center)}
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
                                      permanently delete the study center
                                      record.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(center._id)}
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
                  <DialogTitle>Add New Study Center</DialogTitle>
                  <DialogDescription>
                    Create a new study center record with all required
                    information.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="centreName">Center Name *</Label>
                      <Input
                        id="centreName"
                        value={formData.centreName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            centreName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="sourceOfFunding">
                        Source of Funding *
                      </Label>
                      <Input
                        id="sourceOfFunding"
                        value={formData.sourceOfFunding}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sourceOfFunding: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="infrastructure">Infrastructure *</Label>
                      <Textarea
                        id="infrastructure"
                        value={formData.infrastructure}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            infrastructure: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="timing">Timing *</Label>
                      <Input
                        id="timing"
                        value={formData.timing}
                        onChange={(e) =>
                          setFormData({ ...formData, timing: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="studentsLevelOfEducation">
                        Students Level of Education *
                      </Label>
                      <Input
                        id="studentsLevelOfEducation"
                        value={formData.studentsLevelOfEducation}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            studentsLevelOfEducation: e.target.value,
                          })
                        }
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
                      <Label htmlFor="dateOfEstablishment">
                        Date of Establishment *
                      </Label>
                      <Input
                        id="dateOfEstablishment"
                        type="date"
                        value={formData.dateOfEstablishment}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dateOfEstablishment: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="totalStudents">Total Students *</Label>
                      <Input
                        id="totalStudents"
                        type="number"
                        value={formData.totalStudents}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            totalStudents: e.target.value,
                          })
                        }
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
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="groupLeaderContact">
                        Group Leader Contact *
                      </Label>
                      <Input
                        id="groupLeaderContact"
                        value={formData.groupLeaderContact}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            groupLeaderContact: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  {/* Teachers Section */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>Teachers *</Label>
                      <Button type="button" onClick={addTeacherField} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Teacher
                      </Button>
                    </div>
                    {formData.teacherNames.map((name, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
                      >
                        <div>
                          <Label htmlFor={`teacherName-${index}`}>
                            Teacher Name
                          </Label>
                          <Input
                            id={`teacherName-${index}`}
                            value={name}
                            onChange={(e) => {
                              const newNames = [...formData.teacherNames];
                              newNames[index] = e.target.value;
                              setFormData({
                                ...formData,
                                teacherNames: newNames,
                              });
                            }}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor={`teacherContact-${index}`}>
                            Teacher Contact
                          </Label>
                          <Input
                            id={`teacherContact-${index}`}
                            value={formData.teacherContacts[index]}
                            onChange={(e) => {
                              const newContacts = [...formData.teacherContacts];
                              newContacts[index] = e.target.value;
                              setFormData({
                                ...formData,
                                teacherContacts: newContacts,
                              });
                            }}
                            required
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeTeacherField(index)}
                          disabled={formData.teacherNames.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Study Center</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Study Center</DialogTitle>
                  <DialogDescription>
                    Update the study center information.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Same form fields as create modal */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="editCentreName">Center Name *</Label>
                      <Input
                        id="editCentreName"
                        value={formData.centreName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            centreName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="editSourceOfFunding">
                        Source of Funding *
                      </Label>
                      <Input
                        id="editSourceOfFunding"
                        value={formData.sourceOfFunding}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sourceOfFunding: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    {/* Add rest of the form fields similar to create modal */}
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button type="submit">Update Study Center</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* View Modal */}
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Study Center Details</DialogTitle>
                  <DialogDescription>
                    View complete information about this study center.
                  </DialogDescription>
                </DialogHeader>
                {selectedCenter && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Center Name</Label>
                        <p className="text-sm font-medium">
                          {selectedCenter.centreName}
                        </p>
                      </div>
                      <div>
                        <Label>Source of Funding</Label>
                        <p className="text-sm font-medium">
                          {selectedCenter.sourceOfFunding}
                        </p>
                      </div>
                      <div>
                        <Label>Ward No</Label>
                        <p className="text-sm font-medium">
                          {selectedCenter.wardNo}
                        </p>
                      </div>
                      <div>
                        <Label>Habitation</Label>
                        <p className="text-sm font-medium">
                          {selectedCenter.habitation}
                        </p>
                      </div>
                      <div>
                        <Label>Total Students</Label>
                        <p className="text-sm font-medium">
                          {selectedCenter.totalStudents}
                        </p>
                      </div>
                      <div>
                        <Label>Group Leader</Label>
                        <p className="text-sm font-medium">
                          {selectedCenter.groupLeader}
                        </p>
                      </div>
                      <div>
                        <Label>Group Leader Contact</Label>
                        <p className="text-sm font-medium">
                          {selectedCenter.groupLeaderContact}
                        </p>
                      </div>
                      <div>
                        <Label>Project Responsible</Label>
                        <p className="text-sm font-medium">
                          {selectedCenter.projectResponsible}
                        </p>
                      </div>
                    </div>

                    {/* Teachers */}
                    <div>
                      <Label>Teachers</Label>
                      <div className="mt-2 space-y-2">
                        {selectedCenter.teacherNames?.map((name, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-2 bg-gray-50 rounded"
                          >
                            <span className="font-medium">{name}</span>
                            <span className="text-sm text-gray-600">
                              {selectedCenter.teacherContacts?.[index]}
                            </span>
                          </div>
                        ))}
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

export default StudyCenters;
