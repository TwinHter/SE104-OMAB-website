// src/components/user/ProfileSummary.tsx
import React from "react";
import { Doctor, User, UserRole } from "../../types";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEnvelope,
    faPhone,
    faMapMarkerAlt,
    faBirthdayCake,
    faVenusMars,
    faStethoscope,
    faBriefcase,
    faMoneyBillWave,
    faUserCircle, // A generic icon for "View Details" or "Profile"
    faStar, // Icon for reviews
} from "@fortawesome/free-solid-svg-icons";
import defaultAvatar from "../../assets/react.svg";
import Button from "../common/Button"; // Assuming you have a Button component

interface ProfileSummaryProps {
    user: User;
    // We'll remove showEditButton as we are replacing it with explicit buttons
    // showEditButton?: boolean;
}

const ProfileSummary: React.FC<ProfileSummaryProps> = ({
    user,
    // showEditButton = true, // No longer needed
}) => {
    const isDoctor = user.type === UserRole.Doctor;
    const isPatient = user.type === UserRole.Patient;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md font-pt-sans relative">
            {/* REMOVED the floating Link/Button here */}

            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6">
                <img
                    src={user.avatarUrl || defaultAvatar}
                    alt={user.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-primary-light shadow-lg"
                />
                <div className="text-center md:text-left flex-grow">
                    <h2 className="text-3xl font-bold text-primary-dark mb-2">
                        {user.name}
                    </h2>
                    <p className="text-lg text-gray-700 mb-4 capitalize">
                        Vai trò:{" "}
                        <span className="font-semibold">
                            {UserRole[user.type]}
                        </span>
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-gray-700 text-sm">
                        {user.email && (
                            <p className="flex items-center">
                                <FontAwesomeIcon
                                    icon={faEnvelope}
                                    className="mr-2 text-gray-500"
                                />{" "}
                                {user.email}
                            </p>
                        )}
                        {user.phone && (
                            <p className="flex items-center">
                                <FontAwesomeIcon
                                    icon={faPhone}
                                    className="mr-2 text-gray-500"
                                />{" "}
                                {user.phone}
                            </p>
                        )}
                        {user.address && (
                            <p className="flex items-center">
                                <FontAwesomeIcon
                                    icon={faMapMarkerAlt}
                                    className="mr-2 text-gray-500"
                                />{" "}
                                {user.address}
                            </p>
                        )}
                        {user.dateOfBirth && (
                            <p className="flex items-center">
                                <FontAwesomeIcon
                                    icon={faBirthdayCake}
                                    className="mr-2 text-gray-500"
                                />{" "}
                                {new Date(user.dateOfBirth).toLocaleDateString(
                                    "vi-VN"
                                )}
                            </p>
                        )}
                        {user.gender && (
                            <p className="flex items-center">
                                <FontAwesomeIcon
                                    icon={faVenusMars}
                                    className="mr-2 text-gray-500"
                                />{" "}
                                {user.gender === "Male"
                                    ? "Nam"
                                    : user.gender === "Female"
                                    ? "Nữ"
                                    : "Khác"}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {isDoctor && (
                <div className="mt-6 border-t pt-4">
                    <h3 className="text-xl font-semibold text-primary-dark mb-3">
                        Thông tin Bác sĩ
                    </h3>
                    <p className="flex items-center mb-2">
                        <FontAwesomeIcon
                            icon={faStethoscope}
                            className="mr-2 text-gray-500"
                        />{" "}
                        Chuyên khoa: {(user as unknown as Doctor).specialty}
                    </p>
                    <p className="flex items-center mb-2">
                        <FontAwesomeIcon
                            icon={faBriefcase}
                            className="mr-2 text-gray-500"
                        />{" "}
                        Kinh nghiệm:{" "}
                        {(user as unknown as Doctor).experienceYears} năm
                    </p>
                    <p className="flex items-center mb-2">
                        <FontAwesomeIcon
                            icon={faMoneyBillWave}
                            className="mr-2 text-gray-500"
                        />{" "}
                        Phí tư vấn:{" "}
                        {(
                            user as unknown as Doctor
                        ).consultationFee?.toLocaleString("vi-VN")}{" "}
                        VND
                    </p>
                    {(user as unknown as Doctor).description && (
                        <p className="text-gray-600 italic mt-2">
                            "{user.description}"
                        </p>
                    )}
                </div>
            )}

            {isPatient && (
                <div className="mt-6 border-t pt-4">
                    <h3 className="text-xl font-semibold text-primary-dark mb-3">
                        Thông tin Bệnh nhân
                    </h3>
                    {user.bloodType && (
                        <p className="mb-2">
                            <span className="font-semibold">Nhóm máu:</span>{" "}
                            {user.bloodType}
                        </p>
                    )}
                    {user.allergies && (
                        <p className="mb-2">
                            <span className="font-semibold">Dị ứng:</span>{" "}
                            {user.allergies}
                        </p>
                    )}
                    {user.insuranceNumber && (
                        <p className="mb-2">
                            <span className="font-semibold">Số bảo hiểm:</span>{" "}
                            {user.insuranceNumber}
                        </p>
                    )}
                </div>
            )}

            {/* NEW: Buttons at the bottom */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-center gap-4">
                <Link to={`/profile/${user.id}/details`} className="flex-grow">
                    <Button className="w-full text-lg py-3 px-6 flex items-center justify-center">
                        <FontAwesomeIcon icon={faUserCircle} className="mr-3" />
                        Xem Chi Tiết Hồ Sơ
                    </Button>
                </Link>

                {isDoctor && (
                    <Link
                        to={`/doctor/${user.id}/reviews`}
                        className="flex-grow"
                    >
                        <Button
                            variant="secondary"
                            className="w-full text-lg py-3 px-6 flex items-center justify-center"
                        >
                            <FontAwesomeIcon icon={faStar} className="mr-3" />
                            Đánh Giá Bác Sĩ
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default ProfileSummary;
