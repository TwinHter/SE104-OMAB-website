// src/components/layout/Header.tsx
import React from "react";
import { Link } from "react-router-dom";
import { UserRole } from "../../types";
import Button from "../common/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser,
    faSignOutAlt,
    faHome,
    faUserMd,
    faCalendarPlus,
    faClipboardList,
    faChartBar,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../hooks/useAuthContext";

const Header: React.FC = () => {
    const { currentUser, logout } = useAuth();

    return (
        <nav className="bg-white shadow-md p-4 sticky top-0 z-50 font-pt-sans">
            <div className="container mx-auto flex justify-between items-center">
                <Link
                    to="/"
                    className="text-2xl font-bold text-primary hover:text-primary-dark transition duration-300"
                >
                    OMAB
                </Link>
                <ul className="flex space-x-6 items-center">
                    <li>
                        <Link
                            to="/"
                            className="text-gray-700 hover:text-primary transition duration-300 flex items-center"
                        >
                            <FontAwesomeIcon icon={faHome} className="mr-1" />{" "}
                            Trang chủ
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/doctors"
                            className="text-gray-700 hover:text-primary transition duration-300 flex items-center"
                        >
                            <FontAwesomeIcon icon={faUserMd} className="mr-1" />{" "}
                            Bác sĩ
                        </Link>
                    </li>
                    {currentUser ? (
                        <>
                            {currentUser.type === UserRole.Patient && (
                                <>
                                    <li>
                                        <Link
                                            to="/book-appointment"
                                            className="text-gray-700 hover:text-primary transition duration-300 flex items-center"
                                        >
                                            <FontAwesomeIcon
                                                icon={faCalendarPlus}
                                                className="mr-1"
                                            />{" "}
                                            Đặt lịch
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/my-appointments"
                                            className="text-gray-700 hover:text-primary transition duration-300 flex items-center"
                                        >
                                            <FontAwesomeIcon
                                                icon={faClipboardList}
                                                className="mr-1"
                                            />{" "}
                                            Lịch hẹn của tôi
                                        </Link>
                                    </li>
                                </>
                            )}
                            {currentUser.type === UserRole.Doctor && (
                                <>
                                    <li>
                                        <Link
                                            to="/doctor/edit-schedule"
                                            className="text-gray-700 hover:text-primary transition duration-300 flex items-center"
                                        >
                                            <FontAwesomeIcon
                                                icon={faCalendarPlus}
                                                className="mr-1"
                                            />{" "}
                                            Lịch làm việc
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/doctor/patient-tracking"
                                            className="text-gray-700 hover:text-primary transition duration-300 flex items-center"
                                        >
                                            <FontAwesomeIcon
                                                icon={faClipboardList}
                                                className="mr-1"
                                            />{" "}
                                            Quản lý bệnh nhân
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/doctor/statistics"
                                            className="text-gray-700 hover:text-primary transition duration-300 flex items-center"
                                        >
                                            <FontAwesomeIcon
                                                icon={faChartBar}
                                                className="mr-1"
                                            />{" "}
                                            Thống kê
                                        </Link>
                                    </li>
                                </>
                            )}
                            {currentUser.type === UserRole.Admin && (
                                <>
                                    <li>
                                        <Link
                                            to="/admin/doctor-management"
                                            className="text-gray-700 hover:text-primary transition duration-300 flex items-center"
                                        >
                                            <FontAwesomeIcon
                                                icon={faUserMd}
                                                className="mr-1"
                                            />{" "}
                                            Quản lý BS
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/admin/statistics"
                                            className="text-gray-700 hover:text-primary transition duration-300 flex items-center"
                                        >
                                            <FontAwesomeIcon
                                                icon={faChartBar}
                                                className="mr-1"
                                            />{" "}
                                            Thống kê Admin
                                        </Link>
                                    </li>
                                </>
                            )}
                            <li>
                                <Link
                                    to={`/profile/${currentUser.id}`}
                                    className="text-gray-700 hover:text-primary transition duration-300 flex items-center"
                                >
                                    <FontAwesomeIcon
                                        icon={faUser}
                                        className="mr-1"
                                    />{" "}
                                    To Profile
                                </Link>
                            </li>
                            <li>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    icon={faSignOutAlt}
                                    onClick={logout}
                                >
                                    Đăng xuất
                                </Button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-primary transition duration-300"
                                >
                                    Đăng nhập
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/register"
                                    className="text-gray-700 hover:text-primary transition duration-300"
                                >
                                    Đăng ký
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Header;
