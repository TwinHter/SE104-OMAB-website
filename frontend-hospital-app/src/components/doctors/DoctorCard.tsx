// src/components/doctors/DoctorCard.tsx
import React from "react";
import { Doctor, UserRole } from "../../types";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faStar,
    faMoneyBillWave,
    faBriefcase,
    faInfoCircle,
    faCalendarPlus,
    faStethoscope,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../hooks/useAuthContext";

interface DoctorCardProps {
    doctor: Doctor;
}

// You can replace the URL below with your own default avatar image path if needed
const defaultAvatar = "https://via.placeholder.com/96?text=Avatar";

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
    const { currentUser } = useAuth();

    console.log("Current User:", currentUser);
    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden font-pt-sans">
            <div className="p-6 flex flex-col items-center">
                <img
                    src={doctor.avatarUrl || defaultAvatar}
                    alt={doctor.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-primary-light mb-4 shadow-md"
                />
                <h3 className="text-xl font-bold text-primary-dark mb-2 text-center">
                    {doctor.name}
                </h3>
                <p className="text-gray-700 text-sm mb-1 flex items-center">
                    <FontAwesomeIcon
                        icon={faStethoscope}
                        className="mr-2 text-gray-500"
                    />{" "}
                    {doctor.specialty}
                </p>
                <p className="text-gray-700 text-sm mb-1 flex items-center">
                    <FontAwesomeIcon
                        icon={faBriefcase}
                        className="mr-2 text-gray-500"
                    />{" "}
                    {doctor.experienceYears} năm kinh nghiệm
                </p>
                <p className="text-gray-700 text-sm mb-1 flex items-center">
                    <FontAwesomeIcon
                        icon={faMoneyBillWave}
                        className="mr-2 text-gray-500"
                    />{" "}
                    {doctor.consultationFee?.toLocaleString("vi-VN")} VND
                </p>
                <div className="flex items-center text-yellow-500 mb-3">
                    <FontAwesomeIcon icon={faStar} className="mr-1" />
                    <span className="font-semibold">
                        {doctor.avg_Rating?.toFixed(1) || "N/A"}
                    </span>
                    <span className="text-gray-500 text-xs ml-1">
                        ({doctor.reviews?.length || 0} nhận xét)
                    </span>
                </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-center space-x-4">
                <Link
                    to={`/profile/${doctor.id}`} // Link đến trang profile chi tiết của bác sĩ
                    className="flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-dark transition duration-300"
                >
                    <FontAwesomeIcon icon={faInfoCircle} className="mr-2" /> Chi
                    tiết
                </Link>
                {currentUser?.type === UserRole.Patient && (
                    <Link
                        to={`/book-appointment?doctorId=${doctor.id}`}
                        className="flex items-center px-4 py-2 bg-accent text-white text-sm font-medium rounded-md hover:bg-accent-dark transition duration-300"
                    >
                        <FontAwesomeIcon
                            icon={faCalendarPlus}
                            className="mr-2"
                        />{" "}
                        Đặt lịch
                    </Link>
                )}
            </div>
        </div>
    );
};

export default DoctorCard;
