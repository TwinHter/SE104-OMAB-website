// src/components/doctors/DoctorReviewCard.tsx
import React from "react";
import { DoctorReview } from "../../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faQuoteLeft } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface DoctorReviewCardProps {
    review: DoctorReview;
}

const DoctorReviewCard: React.FC<DoctorReviewCardProps> = ({ review }) => {
    const reviewDate = new Date(review.date);
    const formattedDate = format(reviewDate, "dd/MM/yyyy", { locale: vi });

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 font-pt-sans">
            <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center text-primary-dark font-bold text-lg mr-3">
                    {review.patientName.charAt(0).toUpperCase()}
                </div>
                <div>
                    <p className="font-semibold text-gray-800">
                        {review.patientName}
                    </p>
                    <p className="text-sm text-gray-500">{formattedDate}</p>
                </div>
            </div>
            <div className="flex items-center text-yellow-500 mb-3">
                {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon
                        key={i}
                        icon={faStar}
                        className={`mr-1 ${
                            i < review.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                        }`}
                    />
                ))}
                <span className="ml-1 text-sm font-medium text-gray-700">
                    {review.rating}/5
                </span>
            </div>
            <p className="text-gray-700 italic relative pl-8">
                <FontAwesomeIcon
                    icon={faQuoteLeft}
                    className="absolute top-0 left-0 text-gray-300 text-2xl"
                />
                {review.comment}
            </p>
        </div>
    );
};

export default DoctorReviewCard;
