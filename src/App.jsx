import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Footer from './components/Footer';
import NotFound from './pages/NotFound';
import Register from './pages/Register';
import GlobalDisclaimer from './pages/User-Side/GlobalDisclaimer';

// Admin Pages
import AdminLogin from './pages/Admin/AdminLogin';
import DashboardHome from './pages/Admin/DashboardHome';
import AdminLayout from './pages/Admin/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import VisaCategories from './pages/Admin/VisaCategories';
import CountryList from './pages/Admin/CountryList';
import Applications from './pages/Admin/Applications';
import UploadBlog from './pages/Admin/UploadBlog';
import BlogList from './pages/Admin/BlogList';
import AppliedCandidates from './pages/Admin/AppliedCandidates';
import RecruiterManager from './pages/Admin/RecruiterManager';
import StaffManager from './pages/Admin/StaffManager';
import TourManager from './pages/Admin/TourManager';
import BookingManager from './pages/Admin/BookingManager';
import AnalyticsDashboard from './pages/Admin/AnalyticsDashboard';
import InboX from './pages/Admin/Inbox';
import AnnouncementMAnager from './pages/Admin/Announcement';
import ManageRecruiters from './pages/Admin/ManageRecruiters';
import UploadTestimony from './pages/Admin/UploadTestimony';
import FlightRequests from './pages/Admin/FlightRequests';
import FlightRevenue from './pages/Admin/FlightRevenue';
import EmployeeList from './pages/Admin/Employee-List';
import B2BPartner from './pages/Admin/B2BPartnerList';
import B2BPricing from './pages/Admin/B2BPricing.jsx';
import AssignTask from './pages/Admin/AssignTask.jsx';
import WorkerRequest from './pages/Admin/WorkerRequest.jsx';

// User-Side
import BlogDetail from './pages/User-Side/BlogDetail';
import ForgotPassword from './pages/User-Side/ForgotPassword';
import Visa from './pages/User-Side/Visa';
import Citizenship from './pages/User-Side/Citizenship';
import CitizenshipDetail from './pages/User-Side/CitizenshipDetail';
import Travel from './pages/User-Side/Travel';
import AboutUs from './pages/User-Side/About';
import ApplyVisa from './pages/User-Side/ApplyVisa';
import ApplyTours from './pages/User-Side/ApplyTours';
import UserProfile from './pages/User-Side/UserProfile';
import Flight from './pages/User-Side/Flight';
import TravelDetails from './pages/User-Side/TravelDetails';
import TermsConditions from './pages/TermsConditions';
import GlobalSitemap from './pages/User-Side/GlobalSitemap';
import PolicyDashboard from './pages/User-Side/PolicyDashboard';
import WorkVisaDetail from './pages/User-Side/WorkVisaDetail';
import StudentVisaDetail from './pages/User-Side/StudentVisaDetail';
import VisitVisaDetail from './pages/User-Side/VisitVisaDetail';

// ✅ NEW: Registration & Dashboard Pages
import RegisterSelect from './pages/RegisterSelect';
import B2BRegister from './pages/B2BRegister';
import EmployerRegister from './pages/EmployerRegister';
import B2BDashboard from './pages/B2BDashboard';
import EmployerDashboard from './pages/EmployerDashboard';

// Scroll To Top
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// Main Layout (with Navbar + Footer)
const MainLayout = () => (
  <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-500">
    <Navbar />
    <main className="flex-grow"><Outlet /></main>
    <Footer />
  </div>
);

// Dashboard Layout (NO Navbar, NO Footer — dashboards have their own)
const DashboardLayout = () => (
  <div className="min-h-screen">
    <Outlet />
  </div>
);

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>

        {/* ── PUBLIC PAGES (with Navbar + Footer) ─────────────────────────── */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/blogs/:slug" element={<BlogDetail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/terms-engagement" element={<TermsConditions />} />
          <Route path="/global-disclaimer" element={<GlobalDisclaimer />} />
          <Route path="/sitemap" element={<GlobalSitemap />} />
          <Route path="/policy" element={<PolicyDashboard />} />

          {/* ── VISA ─────────────────────────────────────────────────────── */}
          <Route path="/visa" element={<Visa />} />
          <Route path="/visa/work/:countryId" element={<WorkVisaDetail />} />
          <Route path="/visa/student/:countryId" element={<StudentVisaDetail />} />
          <Route path="/visa/visit/:countryId" element={<VisitVisaDetail />} />

          {/* ── CITIZENSHIP ──────────────────────────────────────────────── */}
          <Route path="/citizenship" element={<Citizenship />} />
          <Route path="/citizenship/:countryId" element={<CitizenshipDetail />} />

          {/* ── TRAVEL ───────────────────────────────────────────────────── */}
          <Route path="/travel" element={<Travel />} />
          <Route path="/travel-details/:countryName" element={<TravelDetails />} />

          {/* ── OTHER ────────────────────────────────────────────────────── */}
          <Route path="/flight" element={<Flight />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/apply-visa/:visaId" element={<ApplyVisa />} />
          <Route path="/apply-tours/:pkgId" element={<ApplyTours />} />
        </Route>

        {/* ── REGISTRATION PAGES (with Navbar + Footer) ────────────────────── */}
        {/* NOTE: /register is the original user register page */}
        <Route element={<MainLayout />}>
          <Route path="/register" element={<Register />} />
          <Route path="/register/select" element={<RegisterSelect />} />
          <Route path="/register/b2b" element={<B2BRegister />} />
          <Route path="/register/employer" element={<EmployerRegister />} />
        </Route>

        {/* ── DASHBOARDS (NO Navbar/Footer — self-contained) ───────────────── */}
        <Route element={<DashboardLayout />}>
          <Route path="/b2b/dashboard" element={<ProtectedRoute><B2BDashboard /></ProtectedRoute>} />
          <Route path="/employer/dashboard" element={<ProtectedRoute><EmployerDashboard /></ProtectedRoute>} />
          
        </Route>

        {/* ── ADMIN DASHBOARD (Protected) ──────────────────────────────────── */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['superadmin', 'admin', 'hr_manager', 'moderator', 'recruiter']}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardHome />} />
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="visa-categories" element={<VisaCategories />} />
          <Route path="country-list" element={<CountryList />} />
          <Route path="applications" element={<Applications />} />
          <Route path="blogs/create" element={<UploadBlog />} />
          <Route path="blogs" element={<BlogList />} />
          <Route path="candidates" element={<AppliedCandidates />} />
          <Route path="recruiters" element={<RecruiterManager />} />
          <Route path="staff-management" element={<StaffManager />} />
          <Route path="tour-packages" element={<TourManager />} />
          <Route path="bookings" element={<BookingManager />} />
          <Route path="analytics" element={<AnalyticsDashboard />} />
          <Route path="push-alerts" element={<AnnouncementMAnager />} />
          <Route path="manage-recruiters" element={<ManageRecruiters />} />
          <Route path="notifications" element={<InboX />} />
          <Route path="testimonials" element={<UploadTestimony />} />
          <Route path="flight-requests" element={<FlightRequests />} />
          <Route path="flight-revenue" element={<FlightRevenue />} />
          <Route path="employee-list" element={<EmployeeList />} />
          <Route path="worker-request" element={<WorkerRequest />} />
          <Route path="b2b-partners" element={<B2BPartner />} />
          <Route path="b2b/pricing" element={<B2BPricing />} />
          <Route path="b2b/assign-file" element={<AssignTask />} />
        </Route>

        {/* ── 404 ──────────────────────────────────────────────────────────── */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
}

export default App;