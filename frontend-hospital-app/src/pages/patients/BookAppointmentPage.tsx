// src/pages/patients/BookAppointmentPage.tsx
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useDoctorById } from "../../hooks/useDoctors";
import { useCreateAppointment } from "../../hooks/useAppointments";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorDisplay from "../../components/common/ErrorDisplay";
import Modal from "../../components/common/Modal"; // Bạn sẽ cần tạo component Modal
import { CreateAppointmentData, UserRole } from "../../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCalendarAlt,
    faClock,
    faPenAlt,
    faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../hooks/useAuthContext";

const BookAppointmentPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const initialDoctorId = searchParams.get("doctorId") || undefined;

    const [selectedDoctorId, setSelectedDoctorId] = useState<
        string | undefined
    >(initialDoctorId);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [symptoms, setSymptoms] = useState<string>("");
    const [cost, setCost] = useState<number>(0);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const {
        data: doctor,
        isLoading: isLoadingDoctor,
        isError: isErrorDoctor,
        error: errorDoctor,
    } = useDoctorById(selectedDoctorId);
    const createAppointmentMutation = useCreateAppointment();

    useEffect(() => {
        if (doctor) {
            setCost(doctor.consultationFee || 0);
        }
    }, [doctor]);

    const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDate(e.target.value);
        setSelectedTime(""); // Reset time when date changes
    };

    const handleSubmit = async () => {
        if (!currentUser || currentUser.type !== UserRole.Patient) {
            alert("Bạn phải là bệnh nhân để đặt lịch.");
            return;
        }
        if (!selectedDoctorId || !selectedDate || !selectedTime || !symptoms) {
            alert("Vui lòng điền đầy đủ thông tin.");
            return;
        }

        const newAppointment: CreateAppointmentData = {
            date: selectedDate,
            time: selectedTime,
            doctor: {
                id: selectedDoctorId,
                name: doctor?.name || "Chưa xác định",
                specialty: doctor?.specialty || "Chưa xác định",
            }, // Wrap doctor ID in an object
            patientId: currentUser.id,
            symptoms,
            cost,
            patientName: currentUser.name,
        };

        await createAppointmentMutation.mutateAsync(newAppointment);
        alert("Yêu cầu đặt lịch thành công! Vui lòng chờ bác sĩ xác nhận.");
        navigate("/my-appointments"); // Chuyển hướng đến trang lịch hẹn của bệnh nhân

        setIsConfirmModalOpen(false);
    };

    if (isLoadingDoctor) return <LoadingSpinner />;
    if (isErrorDoctor)
        return (
            <ErrorDisplay
                message={
                    errorDoctor?.message || "Không thể tải thông tin bác sĩ."
                }
            />
        );
    if (!selectedDoctorId) {
        return (
            <div className="text-center text-gray-600 p-6">
                Vui lòng chọn một bác sĩ từ{" "}
                <Link to="/doctors" className="text-primary hover:underline">
                    danh sách bác sĩ
                </Link>{" "}
                để đặt lịch.
            </div>
        );
    }
    if (!doctor)
        return (
            <div className="text-center text-gray-600">
                Không tìm thấy bác sĩ.
            </div>
        );

    const availableDates = Object.keys(doctor.availability || {})
        .filter((date) => {
            // Chỉ lấy các ngày trong tương lai
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Đặt về đầu ngày để so sánh
            return new Date(date) >= today;
        })
        .sort();

    return (
        <div className="font-pt-sans bg-background p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-primary-dark mb-6 border-b pb-3 flex items-center">
                <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className="mr-3 text-primary"
                />{" "}
                Đặt lịch hẹn với Bác sĩ {doctor.name}
            </h1>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Thông tin Bác sĩ
                </h3>
                <div className="flex items-center space-x-4 mb-4">
                    <img
                        src={doctor.avatarUrl || "/default-avatar.png"}
                        alt={doctor.name}
                        className="w-20 h-20 rounded-full object-cover border-2 border-primary-light"
                    />
                    <div>
                        <p className="text-lg font-medium">{doctor.name}</p>
                        <p className="text-gray-600">
                            {doctor.specialty} - Phí:{" "}
                            {doctor.consultationFee?.toLocaleString("vi-VN")}{" "}
                            VND
                        </p>
                    </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Chọn thời gian khám
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label
                            htmlFor="appointmentDate"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            <FontAwesomeIcon
                                icon={faCalendarAlt}
                                className="mr-2 text-gray-500"
                            />{" "}
                            Ngày
                        </label>
                        <select
                            id="appointmentDate"
                            value={selectedDate}
                            onChange={handleDateChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        >
                            <option value="">Chọn ngày</option>
                            {availableDates.map((date) => (
                                <option key={date} value={date}>
                                    {new Date(date).toLocaleDateString(
                                        "vi-VN",
                                        {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        }
                                    )}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label
                            htmlFor="appointmentTime"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            <FontAwesomeIcon
                                icon={faClock}
                                className="mr-2 text-gray-500"
                            />{" "}
                            Giờ
                        </label>
                        <select
                            id="appointmentTime"
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            required
                            disabled={!selectedDate}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary disabled:bg-gray-100"
                        >
                            <option value="">Chọn giờ</option>
                            {selectedDate &&
                                doctor.availability[selectedDate]?.map(
                                    (time) => (
                                        <option key={time} value={time}>
                                            {time}
                                        </option>
                                    )
                                )}
                        </select>
                    </div>
                </div>

                <div className="mt-6">
                    <label
                        htmlFor="symptoms"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        <FontAwesomeIcon
                            icon={faPenAlt}
                            className="mr-2 text-gray-500"
                        />{" "}
                        Mô tả triệu chứng / Lý do khám
                    </label>
                    <textarea
                        id="symptoms"
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        rows={4}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Mô tả ngắn gọn tình trạng của bạn..."
                    ></textarea>
                </div>

                <div className="mt-6 text-right">
                    <p className="text-lg font-semibold text-gray-800 mb-4">
                        Tổng chi phí:{" "}
                        <span className="text-primary-dark">
                            {cost.toLocaleString("vi-VN")} VND
                        </span>
                    </p>
                    <button
                        type="button"
                        onClick={() => setIsConfirmModalOpen(true)}
                        disabled={
                            !selectedDoctorId ||
                            !selectedDate ||
                            !selectedTime ||
                            !symptoms ||
                            createAppointmentMutation.isPending
                        }
                        className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-accent hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed transition duration-300"
                    >
                        {createAppointmentMutation.isPending ? (
                            <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                        ) : (
                            <FontAwesomeIcon
                                icon={faCheckCircle}
                                className="mr-2"
                            />
                        )}
                        {createAppointmentMutation.isPending
                            ? "Đang gửi yêu cầu..."
                            : "Xác nhận đặt lịch"}
                    </button>
                </div>
            </div>

            <Modal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                title="Xác nhận đặt lịch"
            >
                <p className="mb-4">Bạn có chắc chắn muốn đặt lịch hẹn này?</p>
                <p className="mb-2">
                    <span className="font-semibold">Bác sĩ:</span> {doctor.name}
                </p>
                <p className="mb-2">
                    <span className="font-semibold">Thời gian:</span>{" "}
                    {selectedTime} ngày{" "}
                    {new Date(selectedDate).toLocaleDateString("vi-VN")}
                </p>
                <p className="mb-2">
                    <span className="font-semibold">Triệu chứng:</span>{" "}
                    {symptoms}
                </p>
                <p className="mb-4">
                    <span className="font-semibold">Chi phí:</span>{" "}
                    {cost.toLocaleString("vi-VN")} VND
                </p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={() => setIsConfirmModalOpen(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition duration-300"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={createAppointmentMutation.isPending}
                        className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-dark transition duration-300 disabled:opacity-50"
                    >
                        {createAppointmentMutation.isPending
                            ? "Đang xử lý..."
                            : "Xác nhận"}
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default BookAppointmentPage;
