import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import AdminLayout from "@/layouts/AdminLayout";
import StudentLayout from "@/layouts/StudentLayout";
import Index from "./pages/Index";
import Programs from "./pages/Programs";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import StudentOverview from "./pages/student/StudentOverview";
import StudentPrograms from "./pages/student/StudentPrograms";
import StudentNotifications from "./pages/student/StudentNotifications";
import FeePayment from "./pages/student/FeePayment";
import FeesStatement from "./pages/student/FeesStatement";
import PaymentReceipts from "./pages/student/PaymentReceipts";
import Certificates from "./pages/student/Certificates";
import Resources from "./pages/student/Resources";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminPrograms from "./pages/admin/AdminPrograms";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminIntakes from "./pages/admin/AdminIntakes";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminResources from "./pages/admin/AdminResources";
import AdminCertificateTemplates from "./pages/admin/AdminCertificateTemplates";
import AdminFinancials from "./pages/admin/AdminFinancials";
import NotFound from "./pages/NotFound";
import DesignSystem from "./pages/DesignSystem";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/dashboard"
              element={<ProtectedRoute><StudentLayout /></ProtectedRoute>}
            >
              <Route index element={<StudentOverview />} />
              <Route path="programs" element={<StudentPrograms />} />
              <Route path="notifications" element={<StudentNotifications />} />
              <Route path="financials/payment" element={<FeePayment />} />
              <Route path="financials/statement" element={<FeesStatement />} />
              <Route path="financials/receipts" element={<PaymentReceipts />} />
              <Route path="downloads/certificates" element={<Certificates />} />
              <Route path="downloads/resources" element={<Resources />} />
            </Route>
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route
              path="/admin"
              element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}
            >
              <Route index element={<AdminOverview />} />
              <Route path="programs" element={<AdminPrograms />} />
              <Route path="notifications" element={<AdminNotifications />} />
              <Route path="students" element={<AdminStudents />} />
              <Route path="intakes" element={<AdminIntakes />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
              <Route path="uploads/certificates" element={<AdminCertificateTemplates />} />
              <Route path="uploads/resources" element={<AdminResources />} />
              <Route path="financials" element={<AdminFinancials />} />
            </Route>
            <Route path="/design-system" element={<DesignSystem />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
