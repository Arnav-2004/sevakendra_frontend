import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Users,
  User,
  Home,
  GraduationCap,
  Building2,
  UserMinus,
  School,
  Trophy,
  Book,
  Heart,
  Stethoscope,
  Baby,
  Users2,
  Shield,
  Scale,
  Briefcase,
  FileText,
  Gavel,
  Megaphone,
  ChevronRight,
  Activity,
  Syringe,
  Pill,
  Cross,
  ClipboardCheck,
} from "lucide-react";

const Sidebar = ({ sidebarOpen, setSidebarOpen, activeItem = null }) => {
  const location = useLocation();

  // Determine active tab based on current pathname
  const getActiveTab = () => {
    const pathname = location.pathname;
    if (pathname.startsWith("/education/")) return "education";
    if (pathname.startsWith("/health/")) return "health";
    if (pathname.startsWith("/social-justice/")) return "socialJustice";
    return null;
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());

  // Update active tab when location changes
  useEffect(() => {
    setActiveTab(getActiveTab());
  }, [location.pathname]);

  const tabs = {
    education: {
      name: "Education",
      icon: GraduationCap,
      subtabs: [
        {
          name: "Study Centers",
          icon: Building2,
          path: "/education/study-centers",
        },
        { name: "SC Students", icon: Users, path: "/education/sc-students" },
        { name: "Dropouts", icon: UserMinus, path: "/education/dropouts" },
        { name: "Schools", icon: School, path: "/education/schools" },
        {
          name: "Competitive Exams",
          icon: Trophy,
          path: "/education/competitive-exams",
        },
        {
          name: "Board Preparation",
          icon: Book,
          path: "/education/board-preparation",
        },
      ],
    },
    health: {
      name: "Health",
      icon: Heart,
      subtabs: [
        {
          name: "Health Camps",
          icon: Stethoscope,
          path: "/health/health-camps",
        },
        { name: "Elderly", icon: Users2, path: "/health/elderly" },
        { name: "Mother & Child", icon: Baby, path: "/health/mother-child" },
        { name: "PwD", icon: User, path: "/health/pwd" },
        { name: "Adolescents", icon: Users, path: "/health/adolescents" },
        { name: "Tuberculosis", icon: Activity, path: "/health/tuberculosis" },
        { name: "HIV", icon: Shield, path: "/health/hiv" },
        { name: "Leprosy", icon: Cross, path: "/health/leprosy" },
        { name: "Addiction", icon: Pill, path: "/health/addiction" },
        {
          name: "Other Diseases",
          icon: Syringe,
          path: "/health/other-diseases",
        },
      ],
    },
    socialJustice: {
      name: "Social Justice",
      icon: Scale,
      subtabs: [
        {
          name: "CBUCBO Details",
          icon: Briefcase,
          path: "/social-justice/cbucbo-details",
        },
        {
          name: "Entitlements",
          icon: FileText,
          path: "/social-justice/entitlements",
        },
        {
          name: "Legal Aid Services",
          icon: Gavel,
          path: "/social-justice/legal-aid",
        },
        {
          name: "Workshops & Awareness",
          icon: Megaphone,
          path: "/social-justice/workshops",
        },
      ],
    },
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 h-screen`}
      >
        <div className="flex items-center justify-center h-16 px-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">
              Seva Kendra CRM
            </span>
          </div>
        </div>

        <nav className="flex-1 mt-6 overflow-y-auto pb-4">
          {/* Dashboard Link */}
          <div className="px-4 mb-6">
            <Link
              to="/dashboard"
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                location.pathname === "/dashboard"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Home className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
          </div>

          {/* Tracking Link */}
          <div className="px-4 mb-6">
            <Link
              to="/tracking"
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                location.pathname === "/tracking"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <ClipboardCheck className="mr-3 h-5 w-5" />
              Follow-ups & Tracking
            </Link>
          </div>

          {/* Module Reports Link */}
          <div className="px-4 mb-6">
            <Link
              to="/module-reports"
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                location.pathname === "/module-reports"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <FileText className="mr-3 h-5 w-5" />
              Module Reports
            </Link>
          </div>

          {/* Tabbed Navigation */}
          <div className="px-4">
            {Object.entries(tabs).map(([tabKey, tab]) => (
              <div key={tabKey} className="mb-4">
                {/* Main Tab Header */}
                <button
                  onClick={() =>
                    setActiveTab(activeTab === tabKey ? null : tabKey)
                  }
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tabKey
                      ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center">
                    <tab.icon className="mr-3 h-5 w-5" />
                    {tab.name}
                  </div>
                  <ChevronRight
                    className={`h-4 w-4 transition-transform ${
                      activeTab === tabKey ? "rotate-90" : ""
                    }`}
                  />
                </button>

                {/* Subtabs */}
                {activeTab === tabKey && (
                  <div className="mt-2 ml-4 space-y-1">
                    {tab.subtabs.map((subtab) => {
                      const isActive = location.pathname === subtab.path;
                      return (
                        <Link
                          key={subtab.name}
                          to={subtab.path}
                          className={`flex items-center px-4 py-2 text-sm rounded-md transition-colors ${
                            isActive
                              ? "bg-blue-100 text-blue-700 font-medium"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          }`}
                        >
                          <subtab.icon className="mr-3 h-4 w-4" />
                          {subtab.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
