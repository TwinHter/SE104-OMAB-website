// src/components/doctors/DoctorReviewSection.tsx
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faCommentAlt } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../hooks/useAuthContext";
import { UserRole } from "../../types"; // Đảm bảo bạn có các type này
import Button from "../../components/common/Button";
import ErrorDisplay from "../../components/common/ErrorDisplay";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import {
    useGetDoctorReviews,
    useAddDoctorReview,
} from "../../hooks/useDoctors";

interface DoctorReviewSectionProps {
    doctorId: string;
    doctorName: string;
}

const StarRating: React.FC<{
    rating: number;
    setRating?: (rating: number) => void;
    editable?: boolean;
}> = ({ rating, setRating, editable = false }) => {
    return (
        <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesomeIcon
                    key={star}
                    icon={faStar}
                    className={`cursor-pointer text-xl ${
                        star <= rating ? "text-yellow-500" : "text-gray-300"
                    } ${editable ? "hover:text-yellow-400" : ""}`}
                    onClick={() => editable && setRating && setRating(star)}
                />
            ))}
        </div>
    );
};

const DoctorReviewSection: React.FC<DoctorReviewSectionProps> = ({
    doctorId,
    doctorName,
}) => {
    const { currentUser } = useAuth();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [showForm, setShowForm] = useState(false); // State để ẩn/hiện form

    const {
        data: reviews,
        isLoading: isLoadingReviews,
        isError: isErrorReviews,
        error: reviewsError,
        refetch: refetchReviews,
    } = useGetDoctorReviews(doctorId);
    const addReviewMutation = useAddDoctorReview();

    const canReview = currentUser && currentUser.type === UserRole.Patient;

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canReview) {
            alert("Bạn không có quyền đánh giá bác sĩ.");
            return;
        }
        if (rating === 0) {
            alert("Vui lòng chọn số sao đánh giá.");
            return;
        }
        if (comment.trim() === "") {
            alert("Vui lòng nhập bình luận của bạn.");
            return;
        }

        await addReviewMutation.mutateAsync({
            doctorId: doctorId,
            reviewData: {
                rating: rating,
                comment: comment,
                patientName: currentUser.name, // Backend thường tự lấy từ token
            },
        });
        alert("Đánh giá của bạn đã được gửi thành công!");
        setRating(0);
        setComment("");
        setShowForm(false); // Ẩn form sau khi gửi
        refetchReviews(); // Tải lại danh sách đánh giá
    };

    if (isLoadingReviews) return <LoadingSpinner />;
    if (isErrorReviews)
        return (
            <ErrorDisplay
                message={
                    reviewsError?.message || "Không thể tải đánh giá bác sĩ."
                }
            />
        );

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FontAwesomeIcon
                    icon={faCommentAlt}
                    className="mr-3 text-primary"
                />{" "}
                Đánh giá và Bình luận
            </h3>

            {canReview && (
                <div className="mb-6 border-b pb-4">
                    {!showForm ? (
                        <Button
                            onClick={() => setShowForm(true)}
                            className="w-full"
                        >
                            Viết đánh giá của bạn
                        </Button>
                    ) : (
                        <form
                            onSubmit={handleSubmitReview}
                            className="space-y-4"
                        >
                            <h4 className="text-lg font-medium text-gray-700">
                                Đánh giá bác sĩ {doctorName}
                            </h4>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Số sao:
                                </label>
                                <StarRating
                                    rating={rating}
                                    setRating={setRating}
                                    editable
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="reviewComment"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Bình luận:
                                </label>
                                <textarea
                                    id="reviewComment"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows={3}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                    placeholder="Chia sẻ trải nghiệm của bạn..."
                                ></textarea>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setShowForm(false)}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={addReviewMutation.isPending}
                                >
                                    {addReviewMutation.isPending
                                        ? "Đang gửi..."
                                        : "Gửi đánh giá"}
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            )}

            {reviews && reviews.length > 0 ? (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                        >
                            <div className="flex items-center mb-2">
                                <StarRating rating={review.rating} />
                                <span className="ml-3 font-semibold text-gray-800">
                                    {review.patientName || "Bệnh nhân ẩn danh"}
                                </span>
                            </div>
                            <p className="text-gray-700 mb-2">
                                {review.comment}
                            </p>
                            <p className="text-sm text-gray-500 text-right">
                                Ngày:{" "}
                                {new Date(review.date).toLocaleDateString(
                                    "vi-VN"
                                )}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-center">
                    Chưa có đánh giá nào cho bác sĩ này.
                </p>
            )}
        </div>
    );
};

export default DoctorReviewSection;
