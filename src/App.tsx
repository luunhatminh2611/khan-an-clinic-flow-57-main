
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ReceptionistDashboard from "./pages/ReceptionistDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import TechnicianDashboard from "./pages/TechnicianDashboard";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminDashboard1 from "./pages/AdminDashboard";
import AccountManagement from "./pages/admin/AccountManagement";
import ClinicManagement from "./pages/admin/ClinicManagement";
import SystemLogs from "./pages/admin/Logs";
import Layout from "./components/Layout";
import PatientList from "./pages/admin/PatientInfo";
import ScheduleAll from "./pages/admin/ScheduleAll";

import MedicalRecordPage from "./components/MedicalRecordDetail";
import SupplyManagementPage from "./pages/admin/SuppliesManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/receptionist-dashboard" element={<ReceptionistDashboard />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/technician-dashboard" element={<TechnicianDashboard />} />
          <Route path="/admin-1" element={<AdminDashboard1 />} />
          <Route path="/medical-record" element={<MedicalRecordPage />} />
          <Route element={<Layout />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin/accounts" element={<AccountManagement />} />
            <Route path="/admin/clinic" element={<ClinicManagement />} />
            <Route path="/admin/logs" element={<SystemLogs />} />
            {/* <Route path="/admin/supplies" element={<SuppliesManagement />} /> */}
            <Route path="/admin/list" element={<PatientList />} />
            <Route path="/admin/schedule-list" element={<ScheduleAll />} />
            <Route path="/admin/supplies" element={<SupplyManagementPage />} />

            {/* Các route khác cũng dùng layout */}
            <Route path="/dashboard" element={<Dashboard />} />

          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
