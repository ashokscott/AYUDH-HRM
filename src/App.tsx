import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import { Layout } from "@/components/layout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Employees from "./pages/Employees";
import Departments from "./pages/Departments";
import Attendance from "./pages/Attendance";
import Payroll from "./pages/Payroll";
import Performance from "./pages/Performance";
import Reports from "./pages/Reports";
import PlaceholderPage from "./pages/PlaceholderPage";
import AddEmployeePage from "./pages/AddEmployeePage";
import ViewEmployee from "./pages/viewemployee";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<Layout><Index /></Layout>} />
            <Route path="/employees" element={<Layout><Employees /></Layout>} />
            <Route path="/employees/add" element={<Layout><AddEmployeePage /></Layout>} />
            <Route path="/employees/view/:id" element={<Layout><ViewEmployee /></Layout>} />
            <Route path="/departments" element={<Layout><Departments /></Layout>} />
            <Route path="/designations" element={<Layout><PlaceholderPage title="Designations" description="Manage job titles and positions" /></Layout>} />
            <Route path="/attendance" element={<Layout><Attendance /></Layout>} />
            <Route path="/attendance/*" element={<Layout><PlaceholderPage title="Attendance Management" description="Advanced attendance features" /></Layout>} />
            <Route path="/shifts" element={<Layout><PlaceholderPage title="Shift Management" description="Configure work shifts and schedules" /></Layout>} />
            <Route path="/payroll" element={<Layout><Payroll /></Layout>} />
            <Route path="/payroll/*" element={<Layout><PlaceholderPage title="Payroll Features" description="Advanced payroll management tools" /></Layout>} />
            <Route path="/performance/*" element={<Layout><Performance /></Layout>} />
            <Route path="/engagement/*" element={<Layout><PlaceholderPage title="Employee Engagement" description="Boost team morale and engagement" /></Layout>} />
            <Route path="/training/*" element={<Layout><PlaceholderPage title="Training & Development" description="Manage employee training programs" /></Layout>} />
            <Route path="/recruitment/*" element={<Layout><PlaceholderPage title="Recruitment" description="Manage hiring and recruitment processes" /></Layout>} />
            <Route path="/admin" element={<Layout><PlaceholderPage title="Admin Tools" description="System administration and settings" /></Layout>} />
            <Route path="/reports" element={<Layout><Reports /></Layout>} />
            <Route path="/self-service/*" element={<Layout><PlaceholderPage title="Self Service" description="Employee self-service portal" /></Layout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
