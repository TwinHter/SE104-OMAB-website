// src/pages/patients/PatientAppointmentsPage.tsx
import React, { useState, useMemo } from "react"; // Import useMemo
import {
    useAppointments,
    useCancelAppointment,
} from "../../hooks/useAppointments";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorDisplay from "../../components/common/ErrorDisplay";
import AppointmentCard from "../../components/appointments/AppointmentCard";
import AppointmentDetailModal from "../../components/appointments/AppointmentDetailModal";
import { Appointment, AppointmentStatus, UserRole } from "../../types"; // Đảm bảo AppointmentStatus là string enum
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList, faFilter } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../hooks/useAuthContext";

const PatientAppointmentsPage: React.FC = () => {
    const { currentUser } = useAuth();
    const [filterStatus, setFilterStatus] = useState<AppointmentStatus | "">(
        ""
    );
    const [selectedAppointment, setSelectedAppointment] =
        useState<Appointment | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    // Fetch appointments for the current patient
    const {
        data: appointments,
        isLoading,
        isError,
        error,
        refetch,
    } = useAppointments();

    const cancelAppointmentMutation = useCancelAppointment();

    const handleViewDetails = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setIsDetailModalOpen(true);
    };

    const handleCancelAppointment = async (appointmentId: string) => {
        if (window.confirm("Bạn có chắc chắn muốn hủy lịch hẹn này?")) {
            await cancelAppointmentMutation.mutateAsync(appointmentId);
            alert("Đã hủy lịch hẹn thành công!");
            refetch(); // Cập nhật lại danh sách sau khi hủy
        }
    };

    // Sử dụng useMemo để lọc và sắp xếp lịch hẹn
    const filteredAndSortedAppointments = useMemo(() => {
        if (!appointments) return [];

        const filtered = appointments.filter((appointment) => {
            // Lọc theo bệnh nhân hiện tại (đảm bảo chỉ hiển thị lịch của người dùng đang đăng nhập)
            const isForCurrentUser =
                currentUser?.type === UserRole.Patient &&
                appointment.patientId === currentUser.id;

            if (!isForCurrentUser) return false;

            // Lọc theo trạng thái
            const matchesStatus =
                filterStatus === "" || appointment.status === filterStatus; // So sánh trực tiếp string enum

            return matchesStatus;
        });

        // Sắp xếp lịch hẹn: Ưu tiên "Chờ xác nhận", "Đã lên lịch" ở trên cùng, sau đó theo thời gian
        const statusOrder: { [key in AppointmentStatus]: number } = {
            [AppointmentStatus.PendingConfirmation]: 1,
            [AppointmentStatus.Scheduled]: 2,
            [AppointmentStatus.Completed]: 3,
            [AppointmentStatus.Cancelled]: 4,
            [AppointmentStatus.Rejected]: 5,
        };

        return filtered.sort((a, b) => {
            const statusA = statusOrder[a.status as AppointmentStatus] || 99;
            const statusB = statusOrder[b.status as AppointmentStatus] || 99;

            if (statusA !== statusB) {
                return statusA - statusB;
            }

            // Sắp xếp theo thời gian (từ cũ nhất đến mới nhất)
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
    }, [appointments, filterStatus, currentUser]);

    if (isLoading) return <LoadingSpinner />;
    if (isError)
        return (
            <ErrorDisplay
                message={error?.message || "Không thể tải lịch hẹn của bạn."}
            />
        );
    if (!currentUser || currentUser?.type !== UserRole.Patient) {
        // Đảm bảo currentUser tồn tại
        return (
            <ErrorDisplay message="Bạn không có quyền truy cập trang này." />
        );
    }

    return (
        <div className="font-pt-sans p-6">
            <h1 className="text-3xl font-bold text-primary-dark mb-6 border-b pb-3 flex items-center">
                <FontAwesomeIcon
                    icon={faClipboardList}
                    className="mr-3 text-primary"
                />{" "}
                Lịch hẹn của tôi
            </h1>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <FontAwesomeIcon
                        icon={faFilter}
                        className="mr-2 text-gray-600"
                    />{" "}
                    Lọc lịch hẹn
                </h3>
                <select
                    value={filterStatus}
                    onChange={(e) =>
                        setFilterStatus(
                            e.target.value as AppointmentStatus | ""
                        )
                    }
                    className="mt-1 block w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value={AppointmentStatus.PendingConfirmation}>
                        Chờ xác nhận
                    </option>
                    <option value={AppointmentStatus.Scheduled}>
                        Đã lên lịch
                    </option>
                    <option value={AppointmentStatus.Completed}>
                        Hoàn thành
                    </option>
                    <option value={AppointmentStatus.Cancelled}>Đã hủy</option>
                    <option value={AppointmentStatus.Rejected}>
                        Bị từ chối
                    </option>
                </select>
            </div>

            {filteredAndSortedAppointments &&
            filteredAndSortedAppointments.length === 0 ? (
                <p className="text-center text-gray-500 text-lg">
                    Bạn không có lịch hẹn nào phù hợp với các tiêu chí lọc.
                </p>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredAndSortedAppointments?.map((appointment) => (
                        <AppointmentCard
                            key={appointment.id}
                            appointment={appointment}
                            onViewDetails={handleViewDetails}
                            // Thêm điều kiện để nút Hủy chỉ xuất hiện khi lịch hẹn chưa bị Completed/Cancelled/Rejected
                            onCancel={
                                appointment.status ===
                                    AppointmentStatus.PendingConfirmation ||
                                appointment.status ===
                                    AppointmentStatus.Scheduled
                                    ? handleCancelAppointment
                                    : undefined
                            }
                        />
                    ))}
                </div>
            )}

            <AppointmentDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => {
                    setIsDetailModalOpen(false);
                    setSelectedAppointment(null);
                    refetch(); // Refetch data khi đóng modal để cập nhật trạng thái mới nhất
                }}
                appointment={selectedAppointment}
            />
        </div>
    );
};

export default PatientAppointmentsPage;
