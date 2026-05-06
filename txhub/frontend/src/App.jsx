import { Routes, Route } from "react-router-dom";
import WebsiteApp from "./website/App.jsx";
import AdminApp from "./admin/App.jsx";

function App() {
  const isAdminDomain = window.location.hostname.includes("admin");

  return (
    <Routes>
      {/* 1. Always prioritize the explicit /admin/ path */}
      <Route path="/admin/*" element={<AdminApp />} />

      {/* 2. Explicitly allow auth pages to reach the website app (even on admin domains) */}
      <Route path="/login" element={<WebsiteApp />} />
      <Route path="/register" element={<WebsiteApp />} />

      {/* 3. If it's an admin subdomain, treat the home path as the admin dashboard */}
      {isAdminDomain && <Route path="/*" element={<AdminApp />} />}

      {/* 4. Default fallback to the main Website application */}
      <Route path="/*" element={<WebsiteApp />} />
    </Routes>
  );
}

export default App;
