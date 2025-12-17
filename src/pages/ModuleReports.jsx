import React, { useState } from "react";
import {
  FileText,
  Download,
  Calendar,
  Filter,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  GraduationCap,
  RefreshCw,
  Activity,
  Heart,
  Menu,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import { educationReportsAPI, healthReportsAPI } from "../services/api";

const ModuleReports = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [module, setModule] = useState("");
  const [reportType, setReportType] = useState("");
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportData, setReportData] = useState(null);
  const [chartData, setChartData] = useState(null);

  // Additional filters based on category
  const [wardNo, setWardNo] = useState("");
  const [habitation, setHabitation] = useState("");
  const [centerName, setCenterName] = useState("");
  const [studentName, setStudentName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [examType, setExamType] = useState("");
  const [boardType, setBoardType] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [classStandard, setClassStandard] = useState("");
  const [patientName, setPatientName] = useState("");
  const [diseaseType, setDiseaseType] = useState("");
  const [treatmentStatus, setTreatmentStatus] = useState("");

  const modules = [
    { value: "education", label: "Education", icon: GraduationCap },
    { value: "health", label: "Health", icon: Heart },
  ];

  const educationCategories = [
    { value: "study-centers", label: "Study Centers" },
    { value: "sc-students", label: "SC Students" },
    { value: "dropouts", label: "Dropouts" },
    { value: "schools", label: "Schools" },
    { value: "competitive-exams", label: "Competitive Exams" },
    { value: "board-preparation", label: "Board Preparation" },
  ];

  const healthCategories = [
    { value: "health-camps", label: "Health Camps" },
    { value: "elderly", label: "Elderly Care" },
    { value: "mother-child", label: "Mother & Child" },
    { value: "pwd", label: "Persons with Disabilities" },
    { value: "adolescents", label: "Adolescents" },
    { value: "tuberculosis", label: "Tuberculosis" },
    { value: "hiv", label: "HIV/AIDS" },
    { value: "leprosy", label: "Leprosy" },
    { value: "addiction", label: "Addiction" },
    { value: "other-diseases", label: "Other Diseases" },
  ];

  const reportTypes = [
    { value: "summary", label: "Summary Report" },
    { value: "detailed", label: "Detailed Report" },
    { value: "analytics", label: "Analytics Report" },
  ];

  const statusOptions = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "completed", label: "Completed" },
    { value: "pending", label: "Pending" },
  ];

  const examTypes = [
    { value: "all", label: "All" },
    { value: "upsc", label: "UPSC" },
    { value: "ssc", label: "SSC" },
    { value: "railway", label: "Railway" },
    { value: "banking", label: "Banking" },
    { value: "state-pcs", label: "State PCS" },
  ];

  const boardTypes = [
    { value: "all", label: "All" },
    { value: "cbse", label: "CBSE" },
    { value: "state", label: "State Board" },
    { value: "icse", label: "ICSE" },
  ];

  const classStandards = [
    { value: "all", label: "All" },
    { value: "10", label: "Class 10" },
    { value: "12", label: "Class 12" },
  ];

  const diseaseTypes = [
    { value: "all", label: "All" },
    { value: "chronic", label: "Chronic" },
    { value: "acute", label: "Acute" },
    { value: "infectious", label: "Infectious" },
    { value: "non-communicable", label: "Non-Communicable" },
  ];

  const treatmentStatuses = [
    { value: "all", label: "All" },
    { value: "ongoing", label: "Ongoing" },
    { value: "completed", label: "Completed" },
    { value: "follow-up", label: "Follow-up Required" },
    { value: "referred", label: "Referred" },
  ];

  const getCurrentCategories = () => {
    if (module === "education") return educationCategories;
    if (module === "health") return healthCategories;
    return [];
  };

  const getReportsAPI = () => {
    if (module === "education") return educationReportsAPI;
    if (module === "health") return healthReportsAPI;
    return null;
  };

  const handleModuleChange = (value) => {
    setModule(value);
    setCategory("");
    setReportData(null);
    setChartData(null);
    resetFilters();
  };

  const handleGenerateReport = async () => {
    if (!module) {
      toast.error("Please select a module");
      return;
    }

    if (!reportType || !category) {
      toast.error("Please select report type and category");
      return;
    }

    if (!startDate || !endDate) {
      toast.error("Please select start and end dates");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error("Start date cannot be after end date");
      return;
    }

    setLoading(true);
    try {
      const params = {
        reportType,
        category,
        startDate,
        endDate,
      };

      // Add module-specific filters
      if (module === "education") {
        if (wardNo) params.wardNo = wardNo;
        if (habitation) params.habitation = habitation;
        if (centerName) params.centerName = centerName;
        if (studentName) params.studentName = studentName;
        if (schoolName) params.schoolName = schoolName;
        if (examType && examType !== "all") params.examType = examType;
        if (boardType && boardType !== "all") params.boardType = boardType;
        if (statusFilter && statusFilter !== "all")
          params.status = statusFilter;
        if (classStandard && classStandard !== "all")
          params.class = classStandard;
      } else if (module === "health") {
        if (wardNo) params.wardNo = wardNo;
        if (habitation) params.habitation = habitation;
        if (patientName) params.patientName = patientName;
        if (diseaseType && diseaseType !== "all")
          params.diseaseType = diseaseType;
        if (treatmentStatus && treatmentStatus !== "all")
          params.treatmentStatus = treatmentStatus;
        if (statusFilter && statusFilter !== "all")
          params.status = statusFilter;
      }

      const reportsAPI = getReportsAPI();
      const response = await reportsAPI.generate(params);
      setReportData(response.report || response.data?.report);
      setChartData(response.chartData || response.data?.chartData);
      toast.success("Report generated successfully!");
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error(error.message || "Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!reportData) {
      toast.error("Please generate a report first");
      return;
    }

    try {
      const params = {
        reportType,
        category,
        startDate,
        endDate,
      };

      // Add filters
      if (module === "education") {
        if (wardNo) params.wardNo = wardNo;
        if (habitation) params.habitation = habitation;
        if (centerName) params.centerName = centerName;
        if (studentName) params.studentName = studentName;
        if (schoolName) params.schoolName = schoolName;
        if (examType && examType !== "all") params.examType = examType;
        if (boardType && boardType !== "all") params.boardType = boardType;
        if (statusFilter && statusFilter !== "all")
          params.status = statusFilter;
        if (classStandard && classStandard !== "all")
          params.class = classStandard;
      } else if (module === "health") {
        if (wardNo) params.wardNo = wardNo;
        if (habitation) params.habitation = habitation;
        if (patientName) params.patientName = patientName;
        if (diseaseType && diseaseType !== "all")
          params.diseaseType = diseaseType;
        if (treatmentStatus && treatmentStatus !== "all")
          params.treatmentStatus = treatmentStatus;
        if (statusFilter && statusFilter !== "all")
          params.status = statusFilter;
      }

      const reportsAPI = getReportsAPI();
      const response = await reportsAPI.exportPDF(params);

      // Create download link
      const blob = new Blob([response], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${module}-report-${category}-${startDate}-to-${endDate}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Report exported as PDF successfully!");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error(error.message || "Failed to export PDF");
    }
  };

  const handleExportExcel = async () => {
    if (!reportData) {
      toast.error("Please generate a report first");
      return;
    }

    try {
      const params = {
        reportType,
        category,
        startDate,
        endDate,
      };

      // Add filters
      if (module === "education") {
        if (wardNo) params.wardNo = wardNo;
        if (habitation) params.habitation = habitation;
        if (centerName) params.centerName = centerName;
        if (studentName) params.studentName = studentName;
        if (schoolName) params.schoolName = schoolName;
        if (examType && examType !== "all") params.examType = examType;
        if (boardType && boardType !== "all") params.boardType = boardType;
        if (statusFilter && statusFilter !== "all")
          params.status = statusFilter;
        if (classStandard && classStandard !== "all")
          params.class = classStandard;
      } else if (module === "health") {
        if (wardNo) params.wardNo = wardNo;
        if (habitation) params.habitation = habitation;
        if (patientName) params.patientName = patientName;
        if (diseaseType && diseaseType !== "all")
          params.diseaseType = diseaseType;
        if (treatmentStatus && treatmentStatus !== "all")
          params.treatmentStatus = treatmentStatus;
        if (statusFilter && statusFilter !== "all")
          params.status = statusFilter;
      }

      const reportsAPI = getReportsAPI();
      const response = await reportsAPI.exportExcel(params);

      // Create download link
      const blob = new Blob([response], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${module}-report-${category}-${startDate}-to-${endDate}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Report exported as Excel successfully!");
    } catch (error) {
      console.error("Error exporting Excel:", error);
      toast.error(error.message || "Failed to export Excel");
    }
  };

  const resetFilters = () => {
    setWardNo("");
    setHabitation("");
    setCenterName("");
    setStudentName("");
    setSchoolName("");
    setExamType("");
    setBoardType("");
    setStatusFilter("");
    setClassStandard("");
    setPatientName("");
    setDiseaseType("");
    setTreatmentStatus("");
  };

  const handleReset = () => {
    setModule("");
    setReportType("");
    setCategory("");
    setStartDate("");
    setEndDate("");
    resetFilters();
    setReportData(null);
    setChartData(null);
  };

  const getCategoryLabel = (value) => {
    const allCategories = [...educationCategories, ...healthCategories];
    const cat = allCategories.find((c) => c.value === value);
    return cat ? cat.label : value;
  };

  const renderModuleSpecificFilters = () => {
    if (module === "education") {
      return renderEducationFilters();
    } else if (module === "health") {
      return renderHealthFilters();
    }
    return null;
  };

  const renderEducationFilters = () => {
    switch (category) {
      case "study-centers":
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Ward No
              </label>
              <Input
                type="text"
                placeholder="Enter ward number"
                value={wardNo}
                onChange={(e) => setWardNo(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Habitation
              </label>
              <Input
                type="text"
                placeholder="Enter habitation"
                value={habitation}
                onChange={(e) => setHabitation(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Center Name
              </label>
              <Input
                type="text"
                placeholder="Enter center name"
                value={centerName}
                onChange={(e) => setCenterName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Status
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case "sc-students":
      case "dropouts":
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Student Name
              </label>
              <Input
                type="text"
                placeholder="Enter student name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Ward No
              </label>
              <Input
                type="text"
                placeholder="Enter ward number"
                value={wardNo}
                onChange={(e) => setWardNo(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Habitation
              </label>
              <Input
                type="text"
                placeholder="Enter habitation"
                value={habitation}
                onChange={(e) => setHabitation(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Status
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case "schools":
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                School Name
              </label>
              <Input
                type="text"
                placeholder="Enter school name"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Ward No
              </label>
              <Input
                type="text"
                placeholder="Enter ward number"
                value={wardNo}
                onChange={(e) => setWardNo(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Status
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case "competitive-exams":
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Exam Type
              </label>
              <Select value={examType} onValueChange={setExamType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select exam type" />
                </SelectTrigger>
                <SelectContent>
                  {examTypes.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Student Name
              </label>
              <Input
                type="text"
                placeholder="Enter student name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Status
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case "board-preparation":
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Board Type
              </label>
              <Select value={boardType} onValueChange={setBoardType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select board type" />
                </SelectTrigger>
                <SelectContent>
                  {boardTypes.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Class</label>
              <Select value={classStandard} onValueChange={setClassStandard}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classStandards.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Student Name
              </label>
              <Input
                type="text"
                placeholder="Enter student name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Status
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        );

      default:
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Ward No
              </label>
              <Input
                type="text"
                placeholder="Enter ward number"
                value={wardNo}
                onChange={(e) => setWardNo(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Status
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        );
    }
  };

  const renderHealthFilters = () => {
    return (
      <>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Patient Name
          </label>
          <Input
            type="text"
            placeholder="Enter patient name"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Ward No</label>
          <Input
            type="text"
            placeholder="Enter ward number"
            value={wardNo}
            onChange={(e) => setWardNo(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Habitation
          </label>
          <Input
            type="text"
            placeholder="Enter habitation"
            value={habitation}
            onChange={(e) => setHabitation(e.target.value)}
          />
        </div>
        {(category === "tuberculosis" ||
          category === "hiv" ||
          category === "leprosy" ||
          category === "addiction" ||
          category === "other-diseases") && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Disease Type
              </label>
              <Select value={diseaseType} onValueChange={setDiseaseType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select disease type" />
                </SelectTrigger>
                <SelectContent>
                  {diseaseTypes.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Treatment Status
              </label>
              <Select
                value={treatmentStatus}
                onValueChange={setTreatmentStatus}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select treatment status" />
                </SelectTrigger>
                <SelectContent>
                  {treatmentStatuses.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Status</label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 lg:flex">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 lg:ml-0">
        {/* Mobile Header with Menu */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white shadow-md border-b">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              Module Reports
            </h1>
            <div className="w-10"></div>
          </div>
        </div>

        <main className="py-8 px-4 sm:px-6 lg:px-8 mt-16 lg:mt-0">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                  Module Reports
                </h1>
                <p className="mt-3 text-gray-600 text-sm sm:text-base">
                  Generate comprehensive reports for Education and Health
                  modules
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex items-center gap-2 border-2 hover:bg-gray-50 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Reset All
              </Button>
            </div>
          </div>

          {/* Filters Section */}
          <Card className="mb-6 shadow-lg border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardTitle className="flex items-center gap-2 text-white">
                <Filter className="w-5 h-5" />
                Report Configuration
              </CardTitle>
              <CardDescription className="text-blue-50">
                Select module, report parameters and apply filters to generate
                customized reports
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Module Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Module *
                  </label>
                  <Select value={module} onValueChange={handleModuleChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select module" />
                    </SelectTrigger>
                    <SelectContent>
                      {modules.map((mod) => {
                        const Icon = mod.icon;
                        return (
                          <SelectItem key={mod.value} value={mod.value}>
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4" />
                              {mod.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Report Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Report Type *
                  </label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Category *
                  </label>
                  <Select
                    value={category}
                    onValueChange={setCategory}
                    disabled={!module}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          module ? "Select category" : "Select module first"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {getCurrentCategories().map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Start Date *
                  </label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    End Date *
                  </label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>

                {/* Module-specific filters */}
                {module && category && renderModuleSpecificFilters()}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t">
                <Button
                  onClick={handleGenerateReport}
                  disabled={loading || !module || !reportType || !category}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-4 h-4" />
                      Generate Report
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleExportPDF}
                  disabled={!reportData}
                  className="flex items-center gap-2 border-2 hover:bg-red-50 hover:border-red-300 transition-all"
                >
                  <Download className="w-4 h-4" />
                  Export PDF
                </Button>

                <Button
                  variant="outline"
                  onClick={handleExportExcel}
                  disabled={!reportData}
                  className="flex items-center gap-2 border-2 hover:bg-green-50 hover:border-green-300 transition-all"
                >
                  <Download className="w-4 h-4" />
                  Export Excel
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Report Results */}
          <div className="space-y-6">
            {reportData && reportData.summary && (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-blue-50 to-blue-100">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-blue-700">
                        Total Records
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-3xl sm:text-4xl font-bold text-blue-900">
                          {reportData.summary.totalRecords || 0}
                        </div>
                        <div className="p-3 bg-blue-200 rounded-xl">
                          <Users className="w-7 h-7 text-blue-700" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-green-50 to-green-100">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-green-700">
                        Active
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-3xl sm:text-4xl font-bold text-green-900">
                          {reportData.summary.active || 0}
                        </div>
                        <div className="p-3 bg-green-200 rounded-xl">
                          <TrendingUp className="w-7 h-7 text-green-700" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-yellow-50 to-yellow-100">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-yellow-700">
                        Pending
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-3xl sm:text-4xl font-bold text-yellow-900">
                          {reportData.summary.pending || 0}
                        </div>
                        <div className="p-3 bg-yellow-200 rounded-xl">
                          <Activity className="w-7 h-7 text-yellow-700" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-purple-50 to-purple-100">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-purple-700">
                        Completion Rate
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-3xl sm:text-4xl font-bold text-purple-900">
                          {reportData.summary.completionRate || 0}%
                        </div>
                        <div className="p-3 bg-purple-200 rounded-xl">
                          <PieChart className="w-7 h-7 text-purple-700" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Data Table */}
                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <FileText className="w-5 h-5 text-blue-600" />
                      Detailed Report Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-100 hover:bg-gray-100">
                            <TableHead className="font-semibold text-gray-700">
                              ID
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700">
                              Name
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700">
                              Module
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700">
                              Category
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700">
                              Status
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700">
                              Date
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700">
                              Details
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {reportData.records &&
                          reportData.records.length > 0 ? (
                            reportData.records.map((record, index) => (
                              <TableRow key={record._id || index}>
                                <TableCell className="font-medium">
                                  {record.id || record._id || `#${index + 1}`}
                                </TableCell>
                                <TableCell>
                                  {record.name ||
                                    record.centerName ||
                                    record.studentName ||
                                    record.schoolName ||
                                    record.patientName ||
                                    "N/A"}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="secondary">
                                    {module.charAt(0).toUpperCase() +
                                      module.slice(1)}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">
                                    {getCategoryLabel(category)}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    className={
                                      record.status === "active"
                                        ? "bg-green-100 text-green-800"
                                        : record.status === "pending"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : record.status === "completed"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-gray-100 text-gray-800"
                                    }
                                  >
                                    {record.status || "N/A"}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {record.date || record.createdAt
                                    ? new Date(
                                        record.date || record.createdAt
                                      ).toLocaleDateString()
                                    : "N/A"}
                                </TableCell>
                                <TableCell className="text-sm text-gray-600">
                                  {record.wardNo && `Ward: ${record.wardNo}`}
                                  {record.habitation &&
                                    ` | ${record.habitation}`}
                                  {record.class && ` | Class: ${record.class}`}
                                  {record.treatmentStatus &&
                                    ` | Treatment: ${record.treatmentStatus}`}
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={7}
                                className="text-center text-gray-500 py-8"
                              >
                                No data available for the selected filters
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                {/* Chart Visualization */}
                {chartData && (
                  <Card className="border-0 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
                      <CardTitle className="flex items-center gap-2 text-gray-900">
                        <BarChart3 className="w-5 h-5 text-indigo-600" />
                        Visual Analytics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-dashed border-blue-300">
                        <div className="text-center text-gray-600">
                          <div className="p-4 bg-blue-100 rounded-full inline-block mb-4">
                            <BarChart3 className="w-12 h-12 text-blue-600" />
                          </div>
                          <p className="font-medium text-gray-700">
                            Chart visualization will be displayed here
                          </p>
                          <p className="text-sm mt-2 text-gray-500">
                            Integration with charting library (e.g., Recharts)
                            recommended
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {/* Empty State */}
            {!reportData && (
              <Card className="border-0 shadow-lg">
                <CardContent className="py-16">
                  <div className="text-center">
                    <div className="inline-block p-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-6">
                      <Calendar className="w-16 h-16 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      No Report Generated
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Select the module, report parameters above and click
                      "Generate Report" to view comprehensive data and analytics
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ModuleReports;
