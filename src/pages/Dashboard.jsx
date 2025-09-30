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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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
  LineChart,
  Line,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Heart,
  GraduationCap,
  Scale,
  Activity,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Menu,
  RefreshCw,
  Download,
  Filter,
  Eye,
  UserCheck,
  Building,
  BookOpen,
  Stethoscope,
  Briefcase,
  Award,
  Target,
  PieChart as PieChartIcon,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import {
  dashboardAPI,
  reportsAPI,
  healthCampAPI,
  elderlyAPI,
  motherChildAPI,
  adolescentsAPI,
  tbhivAddictAPI,
  pwdAPI,
  studyCenterAPI,
  scStudentAPI,
  dropoutAPI,
  schoolAPI,
  competitiveExamAPI,
  boardPreparationAPI,
  cbucboDetailsAPI,
  entitlementsAPI,
  legalAidServiceAPI,
  workshopAndAwarenessAPI,
  beneficiaryAPI,
} from "../services/api";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState("last_30_days");
  const [activeView, setActiveView] = useState("overview");

  // Dashboard data states
  const [overviewStats, setOverviewStats] = useState({
    totalBeneficiaries: 0,
    activeCases: 0,
    pendingLegalAid: 0,
    completedThisMonth: 0,
    recentBeneficiaries: 0,
    urgentCases: 0,
  });

  const [moduleStats, setModuleStats] = useState({
    health: {
      totalCases: 0,
      healthCamps: 0,
      elderlySupport: 0,
      motherChildCare: 0,
      adolescentPrograms: 0,
      tbhivAddictSupport: 0,
      pwdSupport: 0,
    },
    education: {
      totalStudents: 0,
      studyCenters: 0,
      scStudents: 0,
      dropoutRecovery: 0,
      schools: 0,
      competitiveExams: 0,
      boardPreparation: 0,
    },
    socialJustice: {
      totalCases: 0,
      cbucboDetails: 0,
      entitlements: 0,
      legalAidServices: 0,
      workshops: 0,
    },
  });

  const [chartData, setChartData] = useState({
    monthlyTrends: [],
    moduleDistribution: [],
    genderDistribution: [],
    ageDistribution: [],
    statusDistribution: [],
  });

  const [recentActivities, setRecentActivities] = useState([]);

  // Colors for charts
  const COLORS = {
    primary: "#3b82f6",
    secondary: "#10b981",
    accent: "#f59e0b",
    danger: "#ef4444",
    purple: "#8b5cf6",
    pink: "#ec4899",
    teal: "#14b8a6",
    orange: "#f97316",
  };

  const PIE_COLORS = [
    COLORS.primary,
    COLORS.secondary,
    COLORS.accent,
    COLORS.purple,
    COLORS.pink,
    COLORS.teal,
    COLORS.orange,
    COLORS.danger,
  ];

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch overview stats
      const overviewResponse = await dashboardAPI.getOverview();
      setOverviewStats(overviewResponse.data);

      // Fetch module-specific stats (these will return mock data or actual data)
      const [
        // Health module stats
        healthCampsData,
        elderlyData,
        motherChildData,
        adolescentsData,
        tbhivAddictData,
        pwdData,

        // Education module stats
        studyCentersData,
        scStudentsData,
        dropoutsData,
        schoolsData,
        competitiveExamsData,
        boardPrepData,

        // Social Justice module stats
        cbucboData,
        entitlementsData,
        legalAidData,
        workshopsData,

        // Other data
        beneficiariesData,
        reportsData,
        activitiesData,
      ] = await Promise.allSettled([
        healthCampAPI
          .getAll({ limit: 1 })
          .catch(() => ({ data: { total: 0 } })),
        elderlyAPI.getAll({ limit: 1 }).catch(() => ({ data: { total: 0 } })),
        motherChildAPI
          .getAll({ limit: 1 })
          .catch(() => ({ data: { total: 0 } })),
        adolescentsAPI
          .getAll({ limit: 1 })
          .catch(() => ({ data: { total: 0 } })),
        tbhivAddictAPI
          .getAll({ limit: 1 })
          .catch(() => ({ data: { total: 0 } })),
        pwdAPI.getAll({ limit: 1 }).catch(() => ({ data: { total: 0 } })),

        studyCenterAPI
          .getAll({ limit: 1 })
          .catch(() => ({ data: { total: 0 } })),
        scStudentAPI.getAll({ limit: 1 }).catch(() => ({ data: { total: 0 } })),
        dropoutAPI.getAll({ limit: 1 }).catch(() => ({ data: { total: 0 } })),
        schoolAPI.getAll({ limit: 1 }).catch(() => ({ data: { total: 0 } })),
        competitiveExamAPI
          .getAll({ limit: 1 })
          .catch(() => ({ data: { total: 0 } })),
        boardPreparationAPI
          .getAll({ limit: 1 })
          .catch(() => ({ data: { total: 0 } })),

        cbucboDetailsAPI
          .getAll({ limit: 1 })
          .catch(() => ({ data: { total: 0 } })),
        entitlementsAPI
          .getAll({ limit: 1 })
          .catch(() => ({ data: { total: 0 } })),
        legalAidServiceAPI
          .getAll({ limit: 1 })
          .catch(() => ({ data: { total: 0 } })),
        workshopAndAwarenessAPI
          .getAll({ limit: 1 })
          .catch(() => ({ data: { total: 0 } })),

        beneficiaryAPI
          .getAll({ limit: 1 })
          .catch(() => ({ data: { total: 0 } })),
        reportsAPI
          .getOverviewReport(dateRange)
          .catch(() => ({ data: { summary: {}, demographics: {} } })),
        dashboardAPI
          .getRecentActivity()
          .catch(() => ({ data: { activities: [] } })),
      ]);

      // Process module stats
      const healthStats = {
        totalCases: [
          healthCampsData.status === "fulfilled"
            ? healthCampsData.value?.data?.total || 0
            : 0,
          elderlyData.status === "fulfilled"
            ? elderlyData.value?.data?.total || 0
            : 0,
          motherChildData.status === "fulfilled"
            ? motherChildData.value?.data?.total || 0
            : 0,
          adolescentsData.status === "fulfilled"
            ? adolescentsData.value?.data?.total || 0
            : 0,
          tbhivAddictData.status === "fulfilled"
            ? tbhivAddictData.value?.data?.total || 0
            : 0,
          pwdData.status === "fulfilled" ? pwdData.value?.data?.total || 0 : 0,
        ].reduce((a, b) => a + b, 0),
        healthCamps:
          healthCampsData.status === "fulfilled"
            ? healthCampsData.value?.data?.total || 0
            : 0,
        elderlySupport:
          elderlyData.status === "fulfilled"
            ? elderlyData.value?.data?.total || 0
            : 0,
        motherChildCare:
          motherChildData.status === "fulfilled"
            ? motherChildData.value?.data?.total || 0
            : 0,
        adolescentPrograms:
          adolescentsData.status === "fulfilled"
            ? adolescentsData.value?.data?.total || 0
            : 0,
        tbhivAddictSupport:
          tbhivAddictData.status === "fulfilled"
            ? tbhivAddictData.value?.data?.total || 0
            : 0,
        pwdSupport:
          pwdData.status === "fulfilled" ? pwdData.value?.data?.total || 0 : 0,
      };

      const educationStats = {
        totalStudents: [
          studyCentersData.status === "fulfilled"
            ? studyCentersData.value?.data?.total || 0
            : 0,
          scStudentsData.status === "fulfilled"
            ? scStudentsData.value?.data?.total || 0
            : 0,
          dropoutsData.status === "fulfilled"
            ? dropoutsData.value?.data?.total || 0
            : 0,
          schoolsData.status === "fulfilled"
            ? schoolsData.value?.data?.total || 0
            : 0,
          competitiveExamsData.status === "fulfilled"
            ? competitiveExamsData.value?.data?.total || 0
            : 0,
          boardPrepData.status === "fulfilled"
            ? boardPrepData.value?.data?.total || 0
            : 0,
        ].reduce((a, b) => a + b, 0),
        studyCenters:
          studyCentersData.status === "fulfilled"
            ? studyCentersData.value?.data?.total || 0
            : 0,
        scStudents:
          scStudentsData.status === "fulfilled"
            ? scStudentsData.value?.data?.total || 0
            : 0,
        dropoutRecovery:
          dropoutsData.status === "fulfilled"
            ? dropoutsData.value?.data?.total || 0
            : 0,
        schools:
          schoolsData.status === "fulfilled"
            ? schoolsData.value?.data?.total || 0
            : 0,
        competitiveExams:
          competitiveExamsData.status === "fulfilled"
            ? competitiveExamsData.value?.data?.total || 0
            : 0,
        boardPreparation:
          boardPrepData.status === "fulfilled"
            ? boardPrepData.value?.data?.total || 0
            : 0,
      };

      const socialJusticeStats = {
        totalCases: [
          cbucboData.status === "fulfilled"
            ? cbucboData.value?.data?.total || 0
            : 0,
          entitlementsData.status === "fulfilled"
            ? entitlementsData.value?.data?.total || 0
            : 0,
          legalAidData.status === "fulfilled"
            ? legalAidData.value?.data?.total || 0
            : 0,
          workshopsData.status === "fulfilled"
            ? workshopsData.value?.data?.total || 0
            : 0,
        ].reduce((a, b) => a + b, 0),
        cbucboDetails:
          cbucboData.status === "fulfilled"
            ? cbucboData.value?.data?.total || 0
            : 0,
        entitlements:
          entitlementsData.status === "fulfilled"
            ? entitlementsData.value?.data?.total || 0
            : 0,
        legalAidServices:
          legalAidData.status === "fulfilled"
            ? legalAidData.value?.data?.total || 0
            : 0,
        workshops:
          workshopsData.status === "fulfilled"
            ? workshopsData.value?.data?.total || 0
            : 0,
      };

      setModuleStats({
        health: healthStats,
        education: educationStats,
        socialJustice: socialJusticeStats,
      });

      // Set chart data
      const moduleDistribution = [
        { name: "Health", value: healthStats.totalCases, color: COLORS.danger },
        {
          name: "Education",
          value: educationStats.totalStudents,
          color: COLORS.secondary,
        },
        {
          name: "Social Justice",
          value: socialJusticeStats.totalCases,
          color: COLORS.primary,
        },
      ];

      const monthlyTrends = [
        { month: "Jan", health: 45, education: 32, socialJustice: 28 },
        { month: "Feb", health: 52, education: 38, socialJustice: 35 },
        { month: "Mar", health: 48, education: 42, socialJustice: 31 },
        { month: "Apr", health: 61, education: 45, socialJustice: 38 },
        { month: "May", health: 58, education: 49, socialJustice: 42 },
        { month: "Jun", health: 65, education: 52, socialJustice: 45 },
      ];

      setChartData({
        monthlyTrends,
        moduleDistribution,
        genderDistribution: [
          { name: "Female", value: 68, color: COLORS.pink },
          { name: "Male", value: 32, color: COLORS.primary },
        ],
        ageDistribution: [
          { name: "18-25", value: 22 },
          { name: "26-35", value: 35 },
          { name: "36-45", value: 28 },
          { name: "46-55", value: 12 },
          { name: "55+", value: 3 },
        ],
        statusDistribution: [
          { name: "Active", value: 85, color: COLORS.secondary },
          { name: "Pending", value: 28, color: COLORS.accent },
          { name: "Completed", value: 42, color: COLORS.primary },
          { name: "On Hold", value: 15, color: COLORS.purple },
        ],
      });

      // Set recent activities
      if (activitiesData.status === "fulfilled") {
        setRecentActivities(activitiesData.value?.data?.activities || []);
      }
    } catch (error) {
      toast.error("Failed to fetch dashboard data");
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  // Get trend direction
  const getTrendDirection = (value) => {
    if (value > 0)
      return { icon: TrendingUp, color: "text-green-600", bg: "bg-green-100" };
    if (value < 0)
      return { icon: TrendingDown, color: "text-red-600", bg: "bg-red-100" };
    return { icon: Activity, color: "text-gray-600", bg: "bg-gray-100" };
  };

  // Format number
  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeItem="dashboard"
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="mr-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDashboardData}
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">
                  Overview of all NGO activities and beneficiary services
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last_7_days">Last 7 Days</SelectItem>
                    <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                    <SelectItem value="last_90_days">Last 90 Days</SelectItem>
                    <SelectItem value="last_year">Last Year</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={fetchDashboardData}
                  disabled={loading}
                  className="hidden lg:flex"
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
                <Button variant="outline" className="hidden lg:flex">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Beneficiaries
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatNumber(overviewStats.totalBeneficiaries)}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4">
                    <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600 font-medium">
                      +12%
                    </span>
                    <span className="text-sm text-gray-600 ml-2">
                      from last month
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Active Cases
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatNumber(overviewStats.activeCases)}
                      </p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <Activity className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4">
                    <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600 font-medium">
                      +8%
                    </span>
                    <span className="text-sm text-gray-600 ml-2">
                      from last month
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Completed Cases
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatNumber(overviewStats.completedThisMonth)}
                      </p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <CheckCircle className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4">
                    <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600 font-medium">
                      +15%
                    </span>
                    <span className="text-sm text-gray-600 ml-2">
                      from last month
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Urgent Cases
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatNumber(overviewStats.urgentCases)}
                      </p>
                    </div>
                    <div className="p-3 bg-red-100 rounded-full">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4">
                    <ArrowDownRight className="h-4 w-4 text-red-600 mr-1" />
                    <span className="text-sm text-red-600 font-medium">
                      -5%
                    </span>
                    <span className="text-sm text-gray-600 ml-2">
                      from last month
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Module Overview Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Health Module */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Heart className="h-5 w-5 text-red-600" />
                    </div>
                    Health Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Cases</span>
                      <span className="font-semibold">
                        {moduleStats.health.totalCases}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Health Camps</span>
                        <span>{moduleStats.health.healthCamps}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Elderly Support</span>
                        <span>{moduleStats.health.elderlySupport}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Mother & Child</span>
                        <span>{moduleStats.health.motherChildCare}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          Adolescent Programs
                        </span>
                        <span>{moduleStats.health.adolescentPrograms}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Education Module */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <GraduationCap className="h-5 w-5 text-green-600" />
                    </div>
                    Education Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Total Students
                      </span>
                      <span className="font-semibold">
                        {moduleStats.education.totalStudents}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Study Centers</span>
                        <span>{moduleStats.education.studyCenters}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">SC Students</span>
                        <span>{moduleStats.education.scStudents}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Dropout Recovery</span>
                        <span>{moduleStats.education.dropoutRecovery}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Schools</span>
                        <span>{moduleStats.education.schools}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Justice Module */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Scale className="h-5 w-5 text-blue-600" />
                    </div>
                    Social Justice
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Cases</span>
                      <span className="font-semibold">
                        {moduleStats.socialJustice.totalCases}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">CBUCBO Details</span>
                        <span>{moduleStats.socialJustice.cbucboDetails}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Entitlements</span>
                        <span>{moduleStats.socialJustice.entitlements}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Legal Aid</span>
                        <span>
                          {moduleStats.socialJustice.legalAidServices}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Workshops</span>
                        <span>{moduleStats.socialJustice.workshops}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Trends Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Monthly Activity Trends
                  </CardTitle>
                  <CardDescription>
                    Cases and services across all modules over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData.monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="health"
                        stackId="1"
                        stroke={COLORS.danger}
                        fill={COLORS.danger}
                        fillOpacity={0.6}
                        name="Health"
                      />
                      <Area
                        type="monotone"
                        dataKey="education"
                        stackId="1"
                        stroke={COLORS.secondary}
                        fill={COLORS.secondary}
                        fillOpacity={0.6}
                        name="Education"
                      />
                      <Area
                        type="monotone"
                        dataKey="socialJustice"
                        stackId="1"
                        stroke={COLORS.primary}
                        fill={COLORS.primary}
                        fillOpacity={0.6}
                        name="Social Justice"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Module Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5" />
                    Service Distribution
                  </CardTitle>
                  <CardDescription>
                    Distribution of services across modules
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData.moduleDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.moduleDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Demographics and Status Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gender Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Gender Distribution</CardTitle>
                  <CardDescription>
                    Beneficiary distribution by gender
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={chartData.genderDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {chartData.genderDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Case Status Overview</CardTitle>
                  <CardDescription>
                    Current status of all cases across modules
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData.statusDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {chartData.statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activities
                </CardTitle>
                <CardDescription>
                  Latest activities across all modules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.length > 0 ? (
                    recentActivities.map((activity) => (
                      <div
                        key={activity._id}
                        className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="p-2 bg-blue-100 rounded-full">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.description}
                          </p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-gray-500">
                              {new Date(
                                activity.timestamp
                              ).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-gray-500">
                              by {activity.user}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {activity.type.replace("_", " ").toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No recent activities found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
