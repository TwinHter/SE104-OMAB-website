// src/components/layout/Sidebar.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { UserRole } from "../../types";
import {
    faUserMd,
    faCalendarAlt,
    faClipboardList,
    faChartBar,
    faUsers,
    faUserCog,
    faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../common/Button";
import { useAuth } from "../../hooks/useAuthContext";

interface SidebarLinkProps {
    to: string;
    icon: IconDefinition;
    label: string;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label }) => {
    const location = useLocation();
    const isActive =
        location.pathname === to ||
        (to !== "/" && location.pathname.startsWith(to + "/")); // Hoặc cách kiểm tra phức tạp hơn tùy route

    return (
        <li>
            <Link
                to={to}
                className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                    isActive
                        ? "bg-primary text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-200"
                }`}
            >
                <FontAwesomeIcon icon={icon} className="mr-3 text-lg" />
                <span className="font-medium">{label}</span>
            </Link>
        </li>
    );
};

const Sidebar: React.FC = () => {
    const { currentUser, logout } = useAuth();

    if (!currentUser) {
        return null; // Không hiển thị sidebar nếu chưa đăng nhập
    }

    const role = currentUser.type;

    return (
        <aside className="w-64 bg-white p-6 shadow-lg rounded-lg h-full flex flex-col font-pt-sans">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-primary-dark">
                    Tóm tắt hồ sơ
                </h2>
                <p className="text-sm text-gray-500">{UserRole[role]}</p>
            </div>
            <nav className="flex-grow">
                <ul className="space-y-2">
                    <SidebarLink
                        to={`/profile/${currentUser.id}`}
                        icon={faUserCog}
                        label="Hồ sơ của tôi"
                    />

                    {role === UserRole.Patient && (
                        <>
                            <SidebarLink
                                to="/book-appointment"
                                icon={faCalendarAlt}
                                label="Đặt lịch hẹn"
                            />
                            <SidebarLink
                                to="/my-appointments"
                                icon={faClipboardList}
                                label="Lịch hẹn của tôi"
                            />
                        </>
                    )}

                    {role === UserRole.Doctor && (
                        <>
                            <SidebarLink
                                to="/doctor/edit-schedule"
                                icon={faCalendarAlt}
                                label="Lịch làm việc"
                            />
                            <SidebarLink
                                to="/doctor/patient-tracking"
                                icon={faUsers}
                                label="Quản lý bệnh nhân"
                            />
                            <SidebarLink
                                to="/doctor/statistics"
                                icon={faChartBar}
                                label="Thống kê"
                            />
                        </>
                    )}

                    {role === UserRole.Admin && (
                        <>
                            <SidebarLink
                                to="/admin/doctor-management"
                                icon={faUserMd}
                                label="Quản lý Bác sĩ"
                            />
                            <SidebarLink
                                to="/admin/statistics"
                                icon={faChartBar}
                                label="Thống kê hệ thống"
                            />
                            {/* Có thể thêm các link quản lý khác */}
                        </>
                    )}
                </ul>
            </nav>
            <div className="mt-8 pt-4 border-t border-gray-200">
                <Button
                    variant="danger"
                    size="md"
                    icon={faSignOutAlt}
                    onClick={logout}
                    className="w-full"
                >
                    Đăng xuất
                </Button>
                <Link to="/change-password" className="w-full block mt-2">
                    <Button
                        variant="danger"
                        size="md"
                        icon={faSignOutAlt}
                        className="w-full"
                    >
                        Đổi Mật khẩu
                    </Button>
                </Link>
            </div>
        </aside>
    );
};

export default Sidebar;
