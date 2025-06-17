// src/App.tsx (Điều chỉnh)
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Header from "./components/layout/Header"; // Import Header
import Footer from "./components/layout/Footer"; // Import Footer
import { UserRole } from "./types";

// Import các trang
import HomePage from "./pages/common/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProfilePage from "./pages/users/ProfilePage";
import ProfileDetailsPage from "./pages/users/ProfileDetailsPage";
import ContactAdminPage from "./pages/common/ContactAdminPage";
import DoctorListPage from "./pages/doctors/DoctorListPage";
import BookAppointmentPage from "./pages/patients/BookAppointmentPage";
import PatientAppointmentsPage from "./pages/patients/PatientAppointmentsPage";
import DoctorSchedulePage from "./pages/doctors/DoctorSchedulePage";
import DoctorPatientTrackingPage from "./pages/doctors/DoctorPatientTrackingPage";
import StatisticsPage from "./pages/common/StatisticsPage";
import AdminDoctorManagementPage from "./pages/admin/AdminDoctorManagementPage";
import NotFoundPage from "./pages/common/NotFoundPage";
import DoctorReviewsPage from "./pages/doctors/DoctorReviewPage";

function AppContent() {
    return (
        <div className="min-h-screen bg-background font-pt-sans flex flex-col">
            <Header /> {/* Sử dụng Header component */}
            <main className="container mx-auto p-4 mt-8 flex-grow">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/doctors" element={<DoctorListPage />} />

                    {/* Protected Routes - Yêu cầu đăng nhập */}
                    <Route
                        path="/profile/:userId"
                        element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/doctor/:doctorId/reviews" // Thêm route mới cho trang đánh giá
                        element={<DoctorReviewsPage />}
                    />
                    <Route
                        path="/profile/:userId/details"
                        element={
                            <ProtectedRoute>
                                <ProfileDetailsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/contact-admin"
                        element={
                            <ProtectedRoute>
                                <ContactAdminPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Patient Routes */}
                    <Route
                        path="/book-appointment"
                        element={
                            <ProtectedRoute allowedRoles={[UserRole.Patient]}>
                                <BookAppointmentPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/my-appointments"
                        element={
                            <ProtectedRoute allowedRoles={[UserRole.Patient]}>
                                <PatientAppointmentsPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Doctor Routes */}
                    <Route
                        path="/doctor/edit-schedule"
                        element={
                            <ProtectedRoute allowedRoles={[UserRole.Doctor]}>
                                <DoctorSchedulePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/doctor/patient-tracking"
                        element={
                            <ProtectedRoute allowedRoles={[UserRole.Doctor]}>
                                <DoctorPatientTrackingPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/doctor/statistics"
                        element={
                            <ProtectedRoute allowedRoles={[UserRole.Doctor]}>
                                <StatisticsPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Admin Routes */}
                    <Route
                        path="/admin/doctor-management"
                        element={
                            <ProtectedRoute allowedRoles={[UserRole.Admin]}>
                                <AdminDoctorManagementPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/statistics"
                        element={
                            <ProtectedRoute allowedRoles={[UserRole.Admin]}>
                                <StatisticsPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Catch-all for 404 */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </main>
            <Footer /> {/* Sử dụng Footer component */}
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
