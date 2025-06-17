// src/pages/doctors/DoctorPatientTrackingPage.tsx
import React, { useState, useMemo } from "react";
import {
    useAppointments,
    useUpdateAppointmentStatus,
    useCancelAppointment,
} from "../../hooks/useAppointments";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorDisplay from "../../components/common/ErrorDisplay";
import AppointmentCard from "../../components/appointments/AppointmentCard";
import AppointmentDetailModal from "../../components/appointments/AppointmentDetailModal";
import InputField from "../../components/common/InputField"; // Đảm bảo đã có component này
import { Appointment, AppointmentStatus, UserRole } from "../../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUserMd,
    faFilter,
    faSearch, // Thêm icon tìm kiếm
    faCalendarDay, // Thêm icon ngày
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../hooks/useAuthContext";

const DoctorPatientTrackingPage: React.FC = () => {
    const { currentUser } = useAuth();
    const [filterStatus, setFilterStatus] = useState<AppointmentStatus | "">(
        ""
    );
    const [filterPatientName, setFilterPatientName] = useState("");
    const [filterDate, setFilterDate] = useState("");

    const [selectedAppointment, setSelectedAppointment] =
        useState<Appointment | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const {
        data: appointments,
        isLoading,
        isError,
        error,
        refetch,
    } = useAppointments();

    const updateStatusMutation = useUpdateAppointmentStatus();
    const cancelAppointmentMutation = useCancelAppointment();

    const handleViewDetails = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setIsDetailModalOpen(true);
    };

    const handleConfirmAppointment = async (appointmentId: string) => {
        if (window.confirm("Bạn có chắc chắn muốn xác nhận lịch hẹn này?")) {
            await updateStatusMutation.mutateAsync({
                appointmentId: appointmentId,
                data: { status: AppointmentStatus.Scheduled },
            });
            alert("Đã xác nhận lịch hẹn thành công!");
            refetch();
        }
    };

    const handleCompleteAppointment = async (appointmentId: string) => {
        const appointmentToComplete = appointments?.find(
            (app) => app.id === appointmentId
        );
        if (appointmentToComplete) {
            setSelectedAppointment(appointmentToComplete);
            setIsDetailModalOpen(true);
        }
    };

    const handleCancelAppointment = async (appointmentId: string) => {
        if (window.confirm("Bạn có chắc chắn muốn hủy lịch hẹn này?")) {
            await cancelAppointmentMutation.mutateAsync(appointmentId);
            alert("Đã hủy lịch hẹn thành công!");
            refetch();
        }
    };

    const filteredAndSortedAppointments = useMemo(() => {
        if (!appointments) return [];

        const filtered = appointments.filter((appointment) => {
            const isForCurrentUser =
                (currentUser?.type === UserRole.Doctor &&
                    appointment.doctor.id === currentUser.id) ||
                currentUser?.type === UserRole.Admin;

            if (!isForCurrentUser) return false;

            const matchesStatus =
                filterStatus === "" ||
                (appointment.status as unknown as AppointmentStatus) ===
                    filterStatus;

            const matchesPatientName =
                filterPatientName === "" ||
                appointment.patientName
                    .toLowerCase()
                    .includes(filterPatientName.toLowerCase());

            const appointmentDatePart = appointment.date.split("T")[0];
            const matchesDate =
                filterDate === "" || appointmentDatePart === filterDate;

            return matchesStatus && matchesPatientName && matchesDate;
        });

        const statusOrder: { [key in AppointmentStatus]: number } = {
            [AppointmentStatus.PendingConfirmation]: 1,
            [AppointmentStatus.Scheduled]: 2,
            [AppointmentStatus.Completed]: 3,
            [AppointmentStatus.Cancelled]: 4,
            [AppointmentStatus.Rejected]: 5,
        };

        return filtered.sort((a, b) => {
            const statusA =
                statusOrder[a.status as unknown as AppointmentStatus] || 99;
            const statusB =
                statusOrder[b.status as unknown as AppointmentStatus] || 99;

            if (statusA !== statusB) {
                return statusA - statusB;
            }

            return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
    }, [
        appointments,
        filterStatus,
        filterPatientName,
        filterDate,
        currentUser,
    ]);

    if (isLoading) return <LoadingSpinner />;
    if (isError)
        return (
            <ErrorDisplay
                message={
                    error?.message || "Không thể tải lịch hẹn của bệnh nhân."
                }
            />
        );

    if (!currentUser || currentUser?.type !== UserRole.Doctor) {
        return (
            <ErrorDisplay message="Bạn không có quyền truy cập trang này. Vui lòng đăng nhập với vai trò bác sĩ." />
        );
    }

    return (
        <div className="font-pt-sans p-6">
            <h1 className="text-3xl font-bold text-primary-dark mb-6 border-b pb-3 flex items-center">
                <FontAwesomeIcon
                    icon={faUserMd}
                    className="mr-3 text-primary"
                />{" "}
                Quản lý Bệnh nhân & Lịch hẹn
            </h1>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <FontAwesomeIcon
                        icon={faFilter}
                        className="mr-2 text-gray-600"
                    />
                    Bộ lọc và Tìm kiếm
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Lọc theo trạng thái */}
                    <div className="w-full">
                        <label
                            htmlFor="filterStatus"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Trạng thái
                        </label>
                        <select
                            id="filterStatus"
                            value={filterStatus}
                            onChange={(e) =>
                                setFilterStatus(
                                    e.target.value as AppointmentStatus | ""
                                )
                            }
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option
                                value={AppointmentStatus.PendingConfirmation}
                            >
                                Chờ xác nhận
                            </option>
                            <option value={AppointmentStatus.Scheduled}>
                                Đã lên lịch
                            </option>
                            <option value={AppointmentStatus.Completed}>
                                Hoàn thành
                            </option>
                            <option value={AppointmentStatus.Cancelled}>
                                Đã hủy
                            </option>
                            <option value={AppointmentStatus.Rejected}>
                                Bị từ chối
                            </option>
                        </select>
                    </div>

                    {/* Lọc theo tên bệnh nhân */}
                    <div className="w-full">
                        <InputField
                            label="Tên bệnh nhân"
                            id="filterPatientName"
                            type="text"
                            value={filterPatientName}
                            onChange={(e) =>
                                setFilterPatientName(e.target.value)
                            }
                            placeholder="Nhập tên bệnh nhân..."
                            icon={faSearch}
                            className="w-full"
                        />
                    </div>

                    {/* Lọc theo ngày */}
                    <div className="w-full">
                        <InputField
                            label="Ngày hẹn"
                            id="filterDate"
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            icon={faCalendarDay}
                            className="w-full"
                        />
                    </div>
                </div>
            </div>

            {filteredAndSortedAppointments &&
            filteredAndSortedAppointments.length === 0 ? (
                <p className="text-center text-gray-500 text-lg">
                    Không có lịch hẹn nào phù hợp với các tiêu chí lọc.
                </p>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredAndSortedAppointments?.map((appointment) => (
                        <AppointmentCard
                            key={appointment.id}
                            appointment={appointment}
                            onViewDetails={handleViewDetails}
                            onConfirm={
                                (appointment.status as unknown as AppointmentStatus) ===
                                AppointmentStatus.PendingConfirmation
                                    ? handleConfirmAppointment
                                    : undefined
                            }
                            onComplete={
                                (appointment.status as unknown as AppointmentStatus) ===
                                AppointmentStatus.Scheduled
                                    ? handleCompleteAppointment
                                    : undefined
                            }
                            onCancel={handleCancelAppointment}
                        />
                    ))}
                </div>
            )}

            <AppointmentDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => {
                    setIsDetailModalOpen(false);
                    setSelectedAppointment(null);
                    refetch();
                }}
                appointment={selectedAppointment}
            />
        </div>
    );
};

export default DoctorPatientTrackingPage;
