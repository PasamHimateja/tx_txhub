import { Routes, Route } from "react-router-dom";
import WebsiteApp from "./website/App.jsx";
import AdminApp from "./admin/App.jsx";
import AdminRoute from "./website/components/AdminRoute";
import StudentApp from "./student_admin/App.jsx";
import StudentRoute from "./website/components/StudentRoute";

function App() {
  const isAdminDomain = window.location.hostname.includes("admin");
  const isStudentDomain = window.location.hostname.includes("student");

  return (
    <Routes>
      {/* 1. Always prioritize the explicit /admin/ path */}
      <Route 
        path="/admin/*" 
        element={
          <AdminRoute>
            <AdminApp />
          </AdminRoute>
        } 
      />

      {/* 1.5. Always prioritize the explicit /student/ path */}
      <Route 
        path="/student/*" 
        element={
          <StudentRoute>
            <StudentApp />
          </StudentRoute>
        } 
      />

      {/* 2. Explicitly allow auth pages to reach the website app (even on admin/student domains) */}
      <Route path="/login" element={<WebsiteApp />} />
      <Route path="/register" element={<WebsiteApp />} />

      {/* 3. If it's a specific subdomain, treat the home path as that dashboard */}
      {isAdminDomain && <Route path="/*" element={<AdminApp />} />}
      {isStudentDomain && <Route path="/*" element={<StudentApp />} />}

      {/* 4. Default fallback to the main Website application */}
      <Route path="/*" element={<WebsiteApp />} />
    </Routes>
  );
}

export default App;
