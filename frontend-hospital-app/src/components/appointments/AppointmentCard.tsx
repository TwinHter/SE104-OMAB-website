// src/components/appointments/AppointmentCard.tsx
import React from "react";
import { Appointment, AppointmentStatus, UserRole } from "../../types"; // Đảm bảo AppointmentStatus là string enum
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCalendarAlt,
    faUserMd,
    faUserInjured,
    faStethoscope,
    faInfoCircle,
    faCheckCircle,
    faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../common/Button";
import { useNavigate } from "react-router-dom";

interface AppointmentCardProps {
    appointment: Appointment;
    onViewDetails: (appointment: Appointment) => void;
    onConfirm?: (appointmentId: string) => void; // Chỉ dành cho bác sĩ/admin
    onCancel?: (appointmentId: string) => void;
    onComplete?: (appointmentId: string) => void; // Chỉ dành cho bác sĩ/admin
}

// Hàm này sẽ hoạt động tốt với string enum
const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
        case AppointmentStatus.Scheduled:
            return "bg-blue-100 text-blue-800";
        case AppointmentStatus.Completed:
            return "bg-green-100 text-green-800";
        case AppointmentStatus.Cancelled:
            return "bg-red-100 text-red-800";
        case AppointmentStatus.PendingConfirmation:
            return "bg-yellow-100 text-yellow-800";
        case AppointmentStatus.Rejected:
            return "bg-purple-100 text-purple-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

// Hàm này sẽ hoạt động tốt với string enum
const getStatusText = (status: AppointmentStatus) => {
    switch (status.toLowerCase()) {
        case AppointmentStatus.Scheduled:
            return "Đã lên lịch";
        case AppointmentStatus.Completed:
            return "Hoàn thành";
        case AppointmentStatus.Cancelled:
            return "Đã hủy";
        case AppointmentStatus.PendingConfirmation:
            return "Chờ xác nhận";
        case AppointmentStatus.Rejected:
            return "Bị từ chối";
        default:
            return "Không xác định";
    }
};

const AppointmentCard: React.FC<AppointmentCardProps> = ({
    appointment,
    onViewDetails,
    onConfirm,
    onCancel,
    onComplete,
}) => {
    // Lấy currentUser từ localStorage
    // Cách an toàn hơn: dùng useAuth() hook nếu có thể, hoặc đảm bảo JSON.parse không lỗi
    const currentUserString = localStorage.getItem("currentUser");
    const currentUser = currentUserString
        ? JSON.parse(currentUserString)
        : null;

    console.log("Appointment", appointment);
    const navigate = useNavigate();
    const handleMakePayment = () => {
        // Chuyển hướng đến trang thanh toán, truyền ID lịch hẹn
        navigate(`/payment/${appointment.id}`);
    };

    const appointmentDate = new Date(appointment.date);
    const formattedDate = format(appointmentDate, "EEEE, dd/MM/yyyy", {
        locale: vi,
    });
    const formattedTime = format(appointmentDate, "HH:mm");

    // Kiểm tra xem người dùng hiện tại có phải là bác sĩ của lịch hẹn này không
    const isDoctor =
        currentUser?.type === UserRole.Doctor &&
        appointment.doctor.id === currentUser.id;

    // Kiểm tra điều kiện hiển thị nút "Xác nhận"
    const canConfirm =
        isDoctor &&
        appointment.status === AppointmentStatus.PendingConfirmation;

    // Kiểm tra điều kiện hiển thị nút "Hoàn thành"
    const canComplete =
        isDoctor && appointment.status === AppointmentStatus.Scheduled;
    const canCancel = true;

    const canPaid =
        appointment.status === AppointmentStatus.Completed && !isDoctor;

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col font-pt-sans">
            <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-primary-dark flex items-center">
                    <FontAwesomeIcon
                        icon={faCalendarAlt}
                        className="mr-3 text-primary"
                    />
                    Lịch hẹn {formattedTime} - {formattedDate}
                </h3>
                <span
                    // Trực tiếp sử dụng appointment.status vì nó đã là kiểu AppointmentStatus (string enum)
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        appointment.status
                    )}`}
                >
                    {getStatusText(appointment.status)}
                </span>
            </div>

            <div className="space-y-2 text-gray-700 mb-4">
                <p className="flex items-center">
                    <FontAwesomeIcon
                        icon={faUserMd}
                        className="mr-2 text-gray-500"
                    />
                    <span className="font-semibold">Bác sĩ:</span>{" "}
                    {appointment.doctor.name}{" "}
                    {appointment.doctor.specialty &&
                        `(${appointment.doctor.specialty})`}
                </p>
                <p className="flex items-center">
                    <FontAwesomeIcon
                        icon={faUserInjured}
                        className="mr-2 text-gray-500"
                    />
                    <span className="font-semibold">Bệnh nhân:</span>{" "}
                    {appointment.patientName}
                </p>
                {appointment.symptoms && (
                    <p className="flex items-center">
                        <FontAwesomeIcon
                            icon={faStethoscope}
                            className="mr-2 text-gray-500"
                        />
                        <span className="font-semibold">Triệu chứng:</span>{" "}
                        {appointment.symptoms.substring(0, 50)}
                        {appointment.symptoms.length > 50 ? "..." : ""}
                    </p>
                )}
            </div>

            <div className="mt-auto flex justify-end space-x-3 border-t pt-4">
                <Button
                    variant="secondary"
                    size="sm"
                    icon={faInfoCircle}
                    onClick={() => onViewDetails(appointment)}
                >
                    Chi tiết
                </Button>

                {canConfirm && onConfirm && (
                    <Button
                        variant="success"
                        size="sm"
                        icon={faCheckCircle}
                        onClick={() => onConfirm(appointment.id)}
                    >
                        Xác nhận
                    </Button>
                )}

                {canComplete && onComplete && (
                    <Button
                        variant="success"
                        size="sm"
                        icon={faCheckCircle}
                        onClick={() => onComplete(appointment.id)}
                    >
                        Hoàn thành
                    </Button>
                )}
                {canCancel && onCancel && (
                    <Button
                        variant="danger"
                        size="sm"
                        icon={faTimesCircle}
                        onClick={() => onCancel(appointment.id)}
                    >
                        Hủy lịch
                    </Button>
                )}
                {canPaid && (
                    <Button
                        variant="success"
                        size="sm"
                        icon={faTimesCircle}
                        onClick={handleMakePayment}
                    >
                        Thanh toán{" "}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default AppointmentCard;
