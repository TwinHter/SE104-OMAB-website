// src/pages/doctors/DoctorSchedulePage.tsx
import React, { useState, useMemo } from "react";
import {
    useDoctorById,
    useUpdateDoctorAvailability,
} from "../../hooks/useDoctors";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorDisplay from "../../components/common/ErrorDisplay";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import { UserRole } from "../../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCalendarPlus,
    faClock,
    faSave,
    faTimes,
    faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { format, addDays, eachDayOfInterval, isSameDay } from "date-fns";
import { vi } from "date-fns/locale";
import { useAuth } from "../../hooks/useAuthContext";

const DoctorSchedulePage: React.FC = () => {
    const { currentUser } = useAuth();
    const {
        data: doctor,
        isLoading,
        isError,
        error,
        refetch,
    } = useDoctorById(currentUser?.id);
    const updateAvailabilityMutation = useUpdateDoctorAvailability();

    const [isAddSlotModalOpen, setIsAddSlotModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>(
        format(new Date(), "yyyy-MM-dd")
    );
    const [newTimeSlot, setNewTimeSlot] = useState("");
    const [errors, setErrors] = useState<string[]>([]);

    if (isLoading) return <LoadingSpinner />;
    if (isError)
        return (
            <ErrorDisplay
                message={error?.message || "Không thể tải thông tin bác sĩ."}
            />
        );
    if (!doctor || currentUser?.type !== UserRole.Doctor) {
        return (
            <ErrorDisplay message="Bạn không có quyền truy cập trang này hoặc thông tin bác sĩ không tồn tại." />
        );
    }

    // Generate 7 days starting from today
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const next7Days = useMemo(() => {
        const today = new Date();
        const endDate = addDays(today, 30);
        return eachDayOfInterval({ start: today, end: endDate });
    }, []);

    const handleAddSlot = async () => {
        setErrors([]);
        if (!newTimeSlot || !selectedDate) {
            setErrors(["Vui lòng chọn ngày và nhập giờ."]);
            return;
        }
        const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/; // HH:MM
        if (!timeRegex.test(newTimeSlot)) {
            setErrors(["Định dạng giờ không hợp lệ (HH:MM)."]);
            return;
        }

        const currentSlots = doctor.availability[selectedDate] || [];
        if (currentSlots.includes(newTimeSlot)) {
            setErrors(["Khung giờ này đã tồn tại."]);
            return;
        }

        await updateAvailabilityMutation.mutateAsync({
            doctorId: doctor.id,
            availabilityData: {
                date: selectedDate,
                timeSlots: [...currentSlots, newTimeSlot].sort(), // Thêm và sắp xếp lại
                status: "available",
            },
        });
        alert("Đã thêm khung giờ thành công!");
        setIsAddSlotModalOpen(false);
        setNewTimeSlot("");
        refetch(); // Cập nhật lại dữ liệu
    };

    const handleRemoveSlot = async (date: string, timeToRemove: string) => {
        if (
            !window.confirm(
                `Bạn có chắc chắn muốn xóa khung giờ ${timeToRemove} vào ngày ${format(
                    new Date(date),
                    "dd/MM/yyyy"
                )}?`
            )
        ) {
            return;
        }
        const currentSlots = doctor.availability[date] || [];
        const updatedSlots = currentSlots.filter(
            (time) => time === timeToRemove
        );
        await updateAvailabilityMutation.mutateAsync({
            doctorId: doctor.id,
            availabilityData: {
                date: date,
                timeSlots: updatedSlots, // Xóa khung giờ
                status: "busy", // Có thể gửi status 'busy' để backend hiểu là xóa
            },
        });
        alert("Đã xóa khung giờ thành công!");
        refetch();
    };

    return (
        <div className="font-pt-sans p-6">
            <h1 className="text-3xl font-bold text-primary-dark mb-6 border-b pb-3 flex items-center">
                <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className="mr-3 text-primary"
                />{" "}
                Quản lý Lịch làm việc
            </h1>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Lịch làm việc của bạn
                </h3>
                <Button
                    variant="primary"
                    icon={faCalendarPlus}
                    onClick={() => setIsAddSlotModalOpen(true)}
                    className="mb-4"
                >
                    Thêm khung giờ mới
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {next7Days.map((dateObj) => {
                        const dateString = format(dateObj, "yyyy-MM-dd");
                        const availableTimes =
                            doctor.availability[dateString] || [];
                        const displayDate = format(dateObj, "EEEE, dd/MM", {
                            locale: vi,
                        });
                        const isToday = isSameDay(dateObj, new Date());

                        return (
                            <div
                                key={dateString}
                                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                            >
                                <h4
                                    className={`font-semibold mb-3 ${
                                        isToday
                                            ? "text-primary"
                                            : "text-gray-800"
                                    }`}
                                >
                                    {displayDate} {isToday && "(Hôm nay)"}
                                </h4>
                                {availableTimes.length > 0 ? (
                                    <ul className="space-y-2">
                                        {availableTimes.map((time) => (
                                            <li
                                                key={time}
                                                className="flex justify-between items-center bg-white p-3 rounded-md shadow-sm border border-gray-100"
                                            >
                                                <span className="font-medium text-gray-700 flex items-center">
                                                    <FontAwesomeIcon
                                                        icon={faClock}
                                                        className="mr-2 text-primary-light"
                                                    />{" "}
                                                    {time}
                                                </span>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    icon={faTimes}
                                                    onClick={() =>
                                                        handleRemoveSlot(
                                                            dateString,
                                                            time
                                                        )
                                                    }
                                                    isLoading={
                                                        updateAvailabilityMutation.isPending
                                                    }
                                                >
                                                    Xóa
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500 italic text-sm">
                                        Không có khung giờ trống.
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Add Time Slot Modal */}
            <Modal
                isOpen={isAddSlotModalOpen}
                onClose={() => setIsAddSlotModalOpen(false)}
                title="Thêm Khung giờ làm việc"
            >
                <div className="space-y-4">
                    <div>
                        <label
                            htmlFor="selectDate"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Chọn ngày
                        </label>
                        <select
                            id="selectDate"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        >
                            {next7Days.map((dateObj) => (
                                <option
                                    key={format(dateObj, "yyyy-MM-dd")}
                                    value={format(dateObj, "yyyy-MM-dd")}
                                >
                                    {format(dateObj, "EEEE, dd/MM/yyyy", {
                                        locale: vi,
                                    })}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label
                            htmlFor="newTime"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Nhập giờ (HH:MM)
                        </label>
                        <input
                            type="text"
                            id="newTime"
                            value={newTimeSlot}
                            onChange={(e) => setNewTimeSlot(e.target.value)}
                            placeholder="Ví dụ: 09:00, 14:30"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        />
                    </div>
                    {errors.length > 0 && (
                        <div className="text-red-600 text-sm">
                            {errors.map((err, index) => (
                                <p key={index}>{err}</p>
                            ))}
                        </div>
                    )}
                    <div className="flex justify-end space-x-3 mt-6">
                        <Button
                            variant="secondary"
                            icon={faTimes}
                            onClick={() => setIsAddSlotModalOpen(false)}
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="primary"
                            icon={faSave}
                            onClick={handleAddSlot}
                            isLoading={updateAvailabilityMutation.isPending}
                        >
                            Lưu khung giờ
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default DoctorSchedulePage;
