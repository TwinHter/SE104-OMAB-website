// src/pages/doctors/DoctorReviewsPage.tsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import { useUserById } from "../../hooks/useUsers"; // Để lấy tên bác sĩ
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorDisplay from "../../components/common/ErrorDisplay";
import DoctorReviewSection from "./DoctorReviewSection";

const DoctorReviewsPage: React.FC = () => {
    const { doctorId } = useParams<{ doctorId: string }>();

    // Lấy thông tin bác sĩ để hiển thị tên trong tiêu đề
    const {
        data: doctorProfile,
        isLoading,
        isError,
        error,
    } = useUserById(doctorId ?? "");

    if (isLoading) return <LoadingSpinner />;
    if (isError)
        return (
            <ErrorDisplay
                message={error?.message || "Không thể tải thông tin bác sĩ."}
            />
        );
    if (!doctorProfile)
        return (
            <div className="text-center text-gray-600">
                Không tìm thấy bác sĩ.
            </div>
        );

    return (
        <div className="font-pt-sans bg-background p-6 rounded-lg shadow-lg">
            <Link
                to={`/profile/${doctorId}/details`} // Quay lại trang chi tiết hồ sơ
                className="text-primary hover:underline mb-4 inline-flex items-center"
            >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Quay lại
                hồ sơ
            </Link>
            <h1 className="text-3xl font-bold text-primary-dark mb-6 border-b pb-3">
                Đánh giá và Bình luận về Bác sĩ {doctorProfile.name}
            </h1>

            {/* Sử dụng DoctorReviewSection ở đây */}
            <DoctorReviewSection
                doctorId={doctorId ?? ""}
                doctorName={doctorProfile.name}
            />
        </div>
    );
};

export default DoctorReviewsPage;
