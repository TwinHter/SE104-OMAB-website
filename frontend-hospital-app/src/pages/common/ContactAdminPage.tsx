// src/pages/ContactAdminPage.tsx
import React from "react";
import {
    faUserShield,
    faEnvelope,
    faPhone,
    faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ErrorDisplay from "../../components/common/ErrorDisplay";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useUsersByRole } from "../../hooks/useUsers";
import { User, UserRole } from "../../types";

const ContactAdminPage: React.FC = () => {
    const { data, isLoading, isError, error } = useUsersByRole(
        "admin" as unknown as UserRole
    );
    const admin = data as unknown as User;
    if (isLoading) return <LoadingSpinner />;
    if (isError)
        return (
            <ErrorDisplay
                message={error?.message || "Không thể tải thông tin Admin."}
            />
        );
    if (!admin)
        return (
            <div className="text-center text-gray-600">
                Không tìm thấy thông tin quản trị viên.
            </div>
        );

    return (
        <div className="font-pt-sans bg-background p-6 rounded-lg shadow-lg max-w-xl mx-auto">
            <h1 className="text-3xl font-bold text-primary-dark mb-6 border-b pb-3 flex items-center">
                <FontAwesomeIcon
                    icon={faUserShield}
                    className="mr-3 text-primary"
                />{" "}
                Liên hệ hỗ trợ
            </h1>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                {admin.avatarUrl && (
                    <div className="mb-4">
                        <img
                            src={admin.avatarUrl}
                            alt="Admin Avatar"
                            className="w-24 h-24 rounded-full mx-auto border-4 border-primary-light shadow-md"
                        />
                    </div>
                )}
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                    {admin.name}
                </h3>
                <p className="text-lg text-gray-600 mb-4">
                    Quản trị viên Hệ thống
                </p>

                <div className="space-y-3 text-left max-w-sm mx-auto">
                    <p className="text-gray-700 text-lg flex items-center">
                        <FontAwesomeIcon
                            icon={faEnvelope}
                            className="mr-3 text-primary"
                        />{" "}
                        Email:{" "}
                        <span className="font-medium ml-2">{admin.email}</span>
                    </p>
                    {admin.phone && (
                        <p className="text-gray-700 text-lg flex items-center">
                            <FontAwesomeIcon
                                icon={faPhone}
                                className="mr-3 text-primary"
                            />{" "}
                            Điện thoại:{" "}
                            <span className="font-medium ml-2">
                                {admin.phone}
                            </span>
                        </p>
                    )}
                    {admin.address && (
                        <p className="text-gray-700 text-lg flex items-center">
                            <FontAwesomeIcon
                                icon={faMapMarkerAlt}
                                className="mr-3 text-primary"
                            />{" "}
                            Địa chỉ:{" "}
                            <span className="font-medium ml-2">
                                {admin.address}
                            </span>
                        </p>
                    )}
                </div>

                <p className="mt-8 text-gray-700 italic">
                    Vui lòng liên hệ Admin qua các thông tin trên nếu bạn cần hỗ
                    trợ hoặc có bất kỳ thắc mắc nào về hệ thống.
                </p>
            </div>
        </div>
    );
};

export default ContactAdminPage;
