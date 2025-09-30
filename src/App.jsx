import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import Beneficiaries from "./pages/Beneficiaries";
import LegalAid from "./pages/LegalAid";
import Workshops from "./pages/Workshops";
import Reports from "./pages/Reports";
import Form from "./pages/Form";
import StudyCenters from "./pages/StudyCenters";
import SCStudents from "./pages/SCStudents";
import Dropouts from "./pages/Dropouts";
import Schools from "./pages/Schools";
import CompetitiveExams from "./pages/CompetitiveExams";
import BoardPreparation from "./pages/BoardPreparation";
import HealthCamps from "./pages/HealthCamps";
import Elderly from "./pages/Elderly";
import MotherChild from "./pages/MotherChild";
import PWD from "./pages/PWD";
import Adolescents from "./pages/Adolescents";
import TBHIVAddict from "./pages/TBHIVAddict";
import CBUCBODetails from "./pages/CBUCBODetails";
import Entitlements from "./pages/Entitlements";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/beneficiaries"
            element={
              <ProtectedRoute>
                <Beneficiaries />
              </ProtectedRoute>
            }
          />
          <Route
            path="/legal-aid"
            element={
              <ProtectedRoute>
                <LegalAid />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workshops"
            element={
              <ProtectedRoute>
                <Workshops />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/education/study-centers"
            element={
              <ProtectedRoute>
                <StudyCenters />
              </ProtectedRoute>
            }
          />
          <Route
            path="/education/sc-students"
            element={
              <ProtectedRoute>
                <SCStudents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/education/dropouts"
            element={
              <ProtectedRoute>
                <Dropouts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/education/schools"
            element={
              <ProtectedRoute>
                <Schools />
              </ProtectedRoute>
            }
          />
          <Route
            path="/education/competitive-exams"
            element={
              <ProtectedRoute>
                <CompetitiveExams />
              </ProtectedRoute>
            }
          />
          <Route
            path="/education/board-preparation"
            element={
              <ProtectedRoute>
                <BoardPreparation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/health/health-camps"
            element={
              <ProtectedRoute>
                <HealthCamps />
              </ProtectedRoute>
            }
          />
          <Route
            path="/health/elderly"
            element={
              <ProtectedRoute>
                <Elderly />
              </ProtectedRoute>
            }
          />
          <Route
            path="/health/mother-child"
            element={
              <ProtectedRoute>
                <MotherChild />
              </ProtectedRoute>
            }
          />
          <Route
            path="/health/pwd"
            element={
              <ProtectedRoute>
                <PWD />
              </ProtectedRoute>
            }
          />
          <Route
            path="/health/adolescents"
            element={
              <ProtectedRoute>
                <Adolescents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/health/tb-hiv-addict"
            element={
              <ProtectedRoute>
                <TBHIVAddict />
              </ProtectedRoute>
            }
          />
          <Route
            path="/social-justice/cbucbo-details"
            element={
              <ProtectedRoute>
                <CBUCBODetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/social-justice/entitlements"
            element={
              <ProtectedRoute>
                <Entitlements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/social-justice/legal-aid"
            element={
              <ProtectedRoute>
                <LegalAid />
              </ProtectedRoute>
            }
          />
          <Route
            path="/social-justice/workshops"
            element={
              <ProtectedRoute>
                <Workshops />
              </ProtectedRoute>
            }
          />
          <Route path="/form" element={<Form />} />
          <Route path="/" element={<Navigate to="/signin" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
