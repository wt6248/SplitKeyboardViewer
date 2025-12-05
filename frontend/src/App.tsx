import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ComparisonProvider } from './context/ComparisonContext';
import { AuthProvider } from './context/AuthContext';
import MainPage from './pages/MainPage';
import TestPage from './pages/TestPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import DashboardLayout from './pages/admin/DashboardLayout';
import DashboardPage from './pages/admin/DashboardPage';
import KeyboardManagePage from './pages/admin/KeyboardManagePage';
import AccountManagePage from './pages/admin/AccountManagePage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <ComparisonProvider>
        <Router>
          <Routes>
            <Route path="/test" element={<TestPage />} />
            <Route path="/" element={<MainPage />} />
            <Route path="/admin" element={<AdminLoginPage />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
            </Route>
            <Route
              path="/admin/keyboards"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<KeyboardManagePage />} />
            </Route>
            <Route
              path="/admin/accounts"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AccountManagePage />} />
            </Route>
          </Routes>
        </Router>
      </ComparisonProvider>
    </AuthProvider>
  );
}

export default App;
