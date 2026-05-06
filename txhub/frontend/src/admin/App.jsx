import { Routes, Route } from 'react-router-dom';
import { AdminProvider } from './context/AdminContext';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import RegisterUser from './pages/RegisterUser'; // Create similar to Users
import Settings from './pages/Settings'; // Create simple div\
import ClassManagement from './pages/ClassManagement';
import PaymentPage from './pages/payment';

function App() {
  return (
    <AdminProvider>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="registerUser" element={<RegisterUser />} />
          <Route path="settings" element={<Settings />} />
          <Route path="broadcast" element={<ClassManagement />} />
          <Route path="payment" element={<PaymentPage />} />
        </Route>
      </Routes>
    </AdminProvider>
  );
}

export default App;