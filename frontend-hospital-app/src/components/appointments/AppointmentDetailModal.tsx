// src/components/appointments/AppointmentDetailModal.tsx
import React, { useState, useEffect } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import InputField from "../common/InputField";
import {
    Appointment,
    AppointmentStatus, // Đảm bảo đây là string enum
    AppointmentOutcomeStatus, // Đảm bảo đây là string enum
    UserRole,
    Medication,
    RecordAppointmentOutcomeData,
} from "../../types";
import {
    useRecordAppointmentOutcome,
    useSubmitAppointmentReview,
    useUpdateAppointmentStatus, // Import hook này
} from "../../hooks/useAppointments";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faNotesMedical,
    faPrescriptionBottleAlt,
    faStar,
    faComment,
    faSave,
    faTimes,
    faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useAuth } from "../../hooks/useAuthContext";

interface AppointmentDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    appointment: Appointment | null;
}

const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({
    isOpen,
    onClose,
    appointment,
}) => {
    const { currentUser } = useAuth();
    const recordOutcomeMutation = useRecordAppointmentOutcome();
    const submitReviewMutation = useSubmitAppointmentReview();
    const updateAppointmentStatusMutation = useUpdateAppointmentStatus(); // Khởi tạo mutation mới

    const [notes, setNotes] = useState(appointment?.notes || "");
    const [outcomeStatus, setOutcomeStatus] = useState<
        AppointmentOutcomeStatus | ""
    >(
        (appointment?.outcomeStatus as AppointmentOutcomeStatus) || // Loại bỏ `unknown as`
            ""
    );
    const [prescription, setPrescription] = useState<Medication[]>(
        appointment?.prescription && appointment.prescription.length > 0
            ? appointment.prescription
            : [
                  {
                      id: "",
                      name: "",
                      dosage: "",
                      frequency: "",
                      duration: "",
                  },
              ]
    );
    const [reviewRating, setReviewRating] = useState(
        appointment?.patientReview?.rating || 0
    );
    const [reviewComment, setReviewComment] = useState(
        appointment?.patientReview?.comment || ""
    );

    useEffect(() => {
        if (appointment) {
            setNotes(appointment.notes || "");
            setOutcomeStatus(
                (appointment.outcomeStatus as AppointmentOutcomeStatus) || // Loại bỏ `unknown as`
                    ""
            );
            setPrescription(
                appointment.prescription && appointment.prescription.length > 0
                    ? appointment.prescription
                    : [
                          {
                              id: "",
                              name: "",
                              dosage: "",
                              frequency: "",
                              duration: "",
                          },
                      ]
            );
            setReviewRating(appointment.patientReview?.rating || 0); // Đảm bảo reset rating
            setReviewComment(appointment.patientReview?.comment || "");
        } else {
            // Reset states when appointment is null (modal closed or no appointment selected)
            setNotes("");
            setOutcomeStatus("");
            setPrescription([
                { id: "", name: "", dosage: "", frequency: "", duration: "" },
            ]);
            setReviewRating(0);
            setReviewComment("");
        }
    }, [appointment]);

    const isDoctor =
        currentUser?.type === UserRole.Doctor &&
        appointment?.doctor.id === currentUser.id;
    const isPatient =
        currentUser?.type === UserRole.Patient &&
        appointment?.patientId === currentUser.id;
    const isAdmin = currentUser?.type === UserRole.Admin;

    const handleRecordOutcome = async () => {
        if (!appointment) return;
        // 1. Ghi nhận kết quả khám
        await recordOutcomeMutation.mutateAsync({
            appointmentId: appointment.id,
            data: {
                notes,
                ...(outcomeStatus !== ""
                    ? {
                          outcomeStatus:
                              outcomeStatus as AppointmentOutcomeStatus,
                      }
                    : {}),
                prescription: prescription.filter((med) => med.name), // Chỉ gửi các thuốc có tên
            } as RecordAppointmentOutcomeData,
        });

        // 2. Cập nhật trạng thái lịch hẹn thành "Completed"
        // Chỉ cập nhật nếu trạng thái hiện tại không phải là "Completed" hoặc "Cancelled"
        if (
            appointment.status !== AppointmentStatus.Completed &&
            appointment.status !== AppointmentStatus.Cancelled &&
            appointment.status !== AppointmentStatus.Rejected
        ) {
            await updateAppointmentStatusMutation.mutateAsync({
                appointmentId: appointment.id,
                data: { status: AppointmentStatus.Completed },
            });
        }

        alert("Cập nhật kết quả khám và trạng thái lịch hẹn thành công!");
        onClose(); // Đóng modal và kích hoạt refetch từ parent
    };

    const handleSubmitReview = async () => {
        if (!appointment) return;
        if (reviewRating === 0) {
            alert("Vui lòng chọn số sao đánh giá.");
            return;
        }
        await submitReviewMutation.mutateAsync({
            appointmentId: appointment.id,
            data: {
                rating: reviewRating,
                comment: reviewComment,
            },
        });
        alert("Gửi đánh giá thành công!");
        onClose(); // Đóng modal và kích hoạt refetch từ parent
    };

    const addMedicationField = () => {
        setPrescription([
            ...prescription,
            {
                id: "",
                name: "",
                dosage: "",
                frequency: "",
                duration: "",
            },
        ]);
    };

    const updateMedicationField = (
        index: number,
        field: keyof Medication,
        value: string
    ) => {
        const newPrescription = [...prescription];
        newPrescription[index][field] = value;
        setPrescription(newPrescription);
    };

    if (!appointment) {
        return null;
    }

    const appointmentDate = new Date(appointment.date);
    const formattedDate = format(appointmentDate, "EEEE, dd/MM/yyyy", {
        locale: vi,
    });
    const formattedTime = format(appointmentDate, "HH:mm");

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Chi tiết Lịch hẹn">
            <div className="font-pt-sans text-gray-800">
                <p className="mb-2">
                    <span className="font-semibold">Bác sĩ:</span>{" "}
                    {appointment.doctor.name}{" "}
                    {appointment.doctor.specialty &&
                        `(${appointment.doctor.specialty})`}
                </p>
                <p className="mb-2">
                    <span className="font-semibold">Bệnh nhân:</span>{" "}
                    {appointment.patientName}
                </p>
                <p className="mb-2">
                    <span className="font-semibold">Thời gian:</span>{" "}
                    {formattedTime} ngày {formattedDate}
                </p>
                <p className="mb-2">
                    <span className="font-semibold">Triệu chứng:</span>{" "}
                    {appointment.symptoms || "Không có"}
                </p>
                <p className="mb-4">
                    <span className="font-semibold">Trạng thái:</span>{" "}
                    <span
                        className={`px-2 py-0.5 rounded-full text-sm font-semibold ${getStatusColor(
                            appointment.status as AppointmentStatus // Không cần `unknown as`
                        )}`}
                    >
                        {getStatusText(appointment.status as AppointmentStatus)}
                    </span>
                </p>

                {(isDoctor ||
                    isAdmin ||
                    appointment.notes ||
                    (appointment.prescription?.length ?? 0) > 0 ||
                    appointment.outcomeStatus) && ( // Hiển thị nếu có outcomeStatus
                    <div className="border-t pt-4 mt-4">
                        <h3 className="text-lg font-semibold text-primary-dark mb-3 flex items-center">
                            <FontAwesomeIcon
                                icon={faNotesMedical}
                                className="mr-2"
                            />{" "}
                            Ghi chú và Đơn thuốc (Bác sĩ)
                        </h3>
                        {isDoctor || isAdmin ? (
                            <>
                                <div className="mb-4">
                                    <label
                                        htmlFor="notes"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Ghi chú của Bác sĩ
                                    </label>
                                    <textarea
                                        id="notes"
                                        value={notes}
                                        onChange={(e) =>
                                            setNotes(e.target.value)
                                        }
                                        rows={4}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                        placeholder="Ghi chú về kết quả khám, chẩn đoán..."
                                    ></textarea>
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="outcomeStatus"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Trạng thái kết quả khám
                                    </label>
                                    <select
                                        id="outcomeStatus"
                                        value={outcomeStatus}
                                        onChange={(e) =>
                                            setOutcomeStatus(
                                                e.target
                                                    .value as AppointmentOutcomeStatus // Loại bỏ `unknown as`
                                            )
                                        }
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                    >
                                        <option value="">
                                            Chọn trạng thái
                                        </option>
                                        <option
                                            value={
                                                AppointmentOutcomeStatus.CompletedWithNotes
                                            }
                                        >
                                            Hoàn thành với ghi chú
                                        </option>
                                        <option
                                            value={
                                                AppointmentOutcomeStatus.PatientAbsent
                                            }
                                        >
                                            Bệnh nhân vắng mặt
                                        </option>
                                        <option
                                            value={
                                                AppointmentOutcomeStatus.Incomplete
                                            }
                                        >
                                            Chưa hoàn thành
                                        </option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                        <FontAwesomeIcon
                                            icon={faPrescriptionBottleAlt}
                                            className="mr-2"
                                        />{" "}
                                        Đơn thuốc
                                    </label>
                                    {prescription.map((med, index) => (
                                        <div
                                            key={index}
                                            className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2 p-2 border border-gray-200 rounded-md"
                                        >
                                            <InputField
                                                label="Tên thuốc"
                                                id={`med-name-${index}`}
                                                value={med.name}
                                                onChange={(e) =>
                                                    updateMedicationField(
                                                        index,
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Paracetamol"
                                            />
                                            <InputField
                                                label="Liều lượng"
                                                id={`med-dosage-${index}`}
                                                value={med.dosage}
                                                onChange={(e) =>
                                                    updateMedicationField(
                                                        index,
                                                        "dosage",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="500mg"
                                            />
                                            <InputField
                                                label="Tần suất"
                                                id={`med-frequency-${index}`}
                                                value={med.frequency}
                                                onChange={(e) =>
                                                    updateMedicationField(
                                                        index,
                                                        "frequency",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="2 lần/ngày"
                                            />
                                            <InputField
                                                label="Thời gian"
                                                id={`med-duration-${index}`}
                                                value={med.duration}
                                                onChange={(e) =>
                                                    updateMedicationField(
                                                        index,
                                                        "duration",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="7 ngày"
                                            />
                                        </div>
                                    ))}
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        icon={faPlus}
                                        onClick={addMedicationField}
                                        className="mt-2"
                                    >
                                        Thêm thuốc
                                    </Button>
                                </div>
                                <div className="flex justify-end space-x-3 mt-6">
                                    <Button
                                        variant="primary"
                                        icon={faSave}
                                        onClick={handleRecordOutcome}
                                        isLoading={
                                            recordOutcomeMutation.isPending ||
                                            updateAppointmentStatusMutation.isPending // Disabled khi đang xử lý
                                        }
                                        // Chỉ cho phép ghi nhận nếu đang Scheduled
                                        disabled={
                                            appointment.status ===
                                                AppointmentStatus.Completed ||
                                            appointment.status ===
                                                AppointmentStatus.Cancelled ||
                                            appointment.status ===
                                                AppointmentStatus.Rejected
                                        }
                                    >
                                        {recordOutcomeMutation.isPending ||
                                        updateAppointmentStatusMutation.isPending
                                            ? "Đang lưu..."
                                            : "Lưu kết quả khám"}
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                {appointment.notes && (
                                    <p className="mb-2">
                                        <span className="font-semibold">
                                            Ghi chú:
                                        </span>{" "}
                                        {appointment.notes}
                                    </p>
                                )}
                                {appointment.outcomeStatus && ( // Chỉ hiển thị nếu có outcomeStatus
                                    <p className="mb-2">
                                        <span className="font-semibold">
                                            Trạng thái kết quả:
                                        </span>{" "}
                                        {getStatusText(
                                            appointment.outcomeStatus as AppointmentOutcomeStatus // Không cần `unknown as`
                                        )}
                                    </p>
                                )}
                                {appointment.prescription &&
                                appointment.prescription.length > 0 &&
                                appointment.prescription.some(
                                    (med) => med.name
                                ) ? ( // Chỉ hiển thị nếu có ít nhất 1 thuốc có tên
                                    <div className="mt-4">
                                        <p className="font-semibold mb-2 flex items-center">
                                            <FontAwesomeIcon
                                                icon={faPrescriptionBottleAlt}
                                                className="mr-2"
                                            />{" "}
                                            Đơn thuốc:
                                        </p>
                                        <ul className="list-disc list-inside space-y-1">
                                            {appointment.prescription
                                                .filter((med) => med.name)
                                                .map(
                                                    // Lọc các thuốc không có tên
                                                    (med, index) => (
                                                        <li
                                                            key={index}
                                                            className="text-sm"
                                                        >
                                                            <span className="font-medium">
                                                                {med.name}
                                                            </span>
                                                            : {med.dosage}{" "}
                                                            {med.frequency &&
                                                                `(${med.frequency})`}{" "}
                                                            {med.duration &&
                                                                `trong ${med.duration}`}
                                                        </li>
                                                    )
                                                )}
                                        </ul>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">
                                        Không có đơn thuốc.
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                )}

                {isPatient &&
                    appointment.status === AppointmentStatus.Completed && // Không cần `unknown as`
                    !appointment.patientReview && (
                        <div className="border-t pt-4 mt-4">
                            <h3 className="text-lg font-semibold text-primary-dark mb-3 flex items-center">
                                <FontAwesomeIcon
                                    icon={faStar}
                                    className="mr-2"
                                />{" "}
                                Đánh giá Bác sĩ
                            </h3>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Số sao
                                </label>
                                <div className="flex items-center space-x-1 text-yellow-400">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FontAwesomeIcon
                                            key={star}
                                            icon={faStar}
                                            className={`cursor-pointer text-2xl ${
                                                star <= reviewRating
                                                    ? "text-yellow-400"
                                                    : "text-gray-300"
                                            }`}
                                            onClick={() =>
                                                setReviewRating(star)
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="reviewComment"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Nhận xét của bạn
                                </label>
                                <textarea
                                    id="reviewComment"
                                    value={reviewComment}
                                    onChange={(e) =>
                                        setReviewComment(e.target.value)
                                    }
                                    rows={3}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                    placeholder="Chia sẻ trải nghiệm của bạn..."
                                ></textarea>
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <Button
                                    variant="primary"
                                    icon={faComment}
                                    onClick={handleSubmitReview}
                                    isLoading={submitReviewMutation.isPending}
                                >
                                    {submitReviewMutation.isPending
                                        ? "Đang gửi..."
                                        : "Gửi đánh giá"}
                                </Button>
                            </div>
                        </div>
                    )}

                {/* Hiển thị đánh giá đã gửi nếu có */}
                {appointment.patientReview && ( // Chỉ hiển thị nếu có đánh giá, không cần kiểm tra isPatient/isAdmin ở đây nữa vì đã lọc ở trên.
                    <div className="border-t pt-4 mt-4">
                        <h3 className="text-lg font-semibold text-primary-dark mb-3 flex items-center">
                            <FontAwesomeIcon icon={faStar} className="mr-2" />{" "}
                            Đánh giá đã gửi
                        </h3>
                        <div className="flex items-center text-yellow-500 mb-2">
                            {[...Array(5)].map((_, i) => (
                                <FontAwesomeIcon
                                    key={i}
                                    icon={faStar}
                                    className={`${
                                        appointment.patientReview &&
                                        i < appointment.patientReview.rating
                                            ? "text-yellow-500"
                                            : "text-gray-300"
                                    }`}
                                />
                            ))}
                            <span className="ml-2 font-semibold">
                                {appointment.patientReview
                                    ? appointment.patientReview.rating
                                    : 0}
                                /5
                            </span>
                        </div>
                        <p className="text-gray-700 italic">
                            "{appointment.patientReview.comment}"
                        </p>
                    </div>
                )}
            </div>

            <div className="flex justify-end mt-8">
                <Button variant="secondary" icon={faTimes} onClick={onClose}>
                    Đóng
                </Button>
            </div>
        </Modal>
    );
};

// Helper functions (same as in AppointmentCard, merged for clarity)
const getStatusColor = (
    status: AppointmentStatus | AppointmentOutcomeStatus
) => {
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
        case AppointmentOutcomeStatus.CompletedWithNotes:
            return "bg-green-100 text-green-800"; // Có thể dùng màu khác nếu muốn phân biệt
        case AppointmentOutcomeStatus.PatientAbsent:
            return "bg-orange-100 text-orange-800";
        case AppointmentOutcomeStatus.Incomplete:
            return "bg-yellow-100 text-yellow-800"; // Có thể dùng màu khác nếu muốn phân biệt
        default:
            return "bg-gray-100 text-gray-800";
    }
};

const getStatusText = (
    status: AppointmentStatus | AppointmentOutcomeStatus
) => {
    switch (status) {
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
        case AppointmentOutcomeStatus.CompletedWithNotes:
            return "Đã hoàn thành với ghi chú";
        case AppointmentOutcomeStatus.PatientAbsent:
            return "Bệnh nhân vắng mặt";
        case AppointmentOutcomeStatus.Incomplete:
            return "Chưa hoàn thành";
        default:
            return "Không xác định";
    }
};

export default AppointmentDetailModal;
