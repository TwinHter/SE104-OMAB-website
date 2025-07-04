// src/pages/PaymentPage.tsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCreditCard,
    faQrcode,
    faBuildingColumns,
    faInfoCircle,
    faTimes,
    faCalendarAlt,
    faMoneyBillWave,
    faUserMd,
    faUserInjured,
} from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useAppointmentById } from "../../hooks/useAppointments";

// Import your types and the custom hook

// Giữ lại hoặc đảm bảo các enum và interface này được import từ types/index.ts
// enum AppointmentStatus { ... }
// enum PaymentStatus { ... }
// interface AppointmentDoctorInfo { ... }
// ... (các interfaces khác nếu bạn muốn giữ chúng trong file này thay vì import)

const PaymentPage: React.FC = () => {
    const { appointmentId } = useParams<{ appointmentId: string }>();
    const [showModal, setShowModal] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

    // SỬ DỤNG HOOK CỦA BẠN ĐỂ LẤY DỮ LIỆU
    const {
        data: appointmentDetails,
        isLoading,
        error,
    } = useAppointmentById(appointmentId);

    const handlePaymentMethodClick = (method: string) => {
        setSelectedPaymentMethod(method);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedPaymentMethod("");
    };

    // Hiển thị trạng thái tải hoặc lỗi
    if (isLoading) {
        return (
            <div className="container mx-auto p-6 text-center text-lg text-gray-700">
                Đang tải thông tin lịch hẹn...
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-6 text-center text-lg text-red-600">
                Lỗi: Không thể tải thông tin lịch hẹn. Vui lòng thử lại.
                <p className="text-sm text-gray-500">{error.message}</p>
            </div>
        );
    }

    // Nếu không có dữ liệu lịch hẹn, có thể do ID không hợp lệ hoặc không tìm thấy
    if (!appointmentDetails) {
        return (
            <div className="container mx-auto p-6 text-center text-lg text-gray-700">
                Không tìm thấy thông tin lịch hẹn với ID: {appointmentId}
            </div>
        );
    }

    // Format dữ liệu sau khi đã có appointmentDetails
    const formattedDate = format(
        new Date(appointmentDetails.date),
        "EEEE, dd/MM/yyyy",
        { locale: vi }
    );
    const formattedTime = format(new Date(appointmentDetails.date), "HH:mm", {
        locale: vi,
    });
    const formattedCost = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(appointmentDetails.cost);

    return (
        <div className="container mx-auto p-6 font-pt-sans max-w-2xl mt-10">
            <h1 className="text-3xl font-bold text-primary-dark mb-8 text-center">
                Thanh toán cho Lịch hẹn{" "}
                <span className="text-primary-darker">#{appointmentId}</span>
            </h1>

            <div className="bg-white rounded-lg shadow-xl p-8">
                <p className="text-lg text-gray-800 mb-6 text-center">
                    Vui lòng chọn phương thức thanh toán thuận tiện nhất cho
                    bạn:
                </p>

                <div className="space-y-4">
                    {/* Momo Option */}
                    <div
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-indigo-50 transition-colors duration-200"
                        onClick={() => handlePaymentMethodClick("Momo")}
                    >
                        <div className="flex items-center">
                            <FontAwesomeIcon
                                icon={faQrcode}
                                className="text-2xl text-pink-500 mr-4"
                            />
                            <span className="font-semibold text-xl text-gray-900">
                                Thanh toán qua Momo
                            </span>
                        </div>
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/f/fe/MoMo_Logo.png"
                            alt="Momo Logo"
                            className="h-10"
                        />
                    </div>

                    {/* Bank Transfer Option */}
                    <div
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-indigo-50 transition-colors duration-200"
                        onClick={() =>
                            handlePaymentMethodClick("Chuyển khoản Ngân hàng")
                        }
                    >
                        <div className="flex items-center">
                            <FontAwesomeIcon
                                icon={faBuildingColumns}
                                className="text-2xl text-blue-600 mr-4"
                            />
                            <span className="font-semibold text-xl text-gray-900">
                                Chuyển khoản Ngân hàng
                            </span>
                        </div>
                        <span className="text-sm text-gray-500">
                            Vietcombank, Techcombank, Agribank...
                        </span>
                    </div>

                    {/* Credit Card Option */}
                    <div
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-indigo-50 transition-colors duration-200"
                        onClick={() =>
                            handlePaymentMethodClick("Thẻ Visa/MasterCard")
                        }
                    >
                        <div className="flex items-center">
                            <FontAwesomeIcon
                                icon={faCreditCard}
                                className="text-2xl text-purple-600 mr-4"
                            />
                            <span className="font-semibold text-xl text-gray-900">
                                Thanh toán bằng thẻ Visa/MasterCard
                            </span>
                        </div>
                        <div className="flex space-x-2">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png"
                                alt="Visa Logo"
                                className="h-6"
                            />
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/MasterCard_Logo.svg/2560px-MasterCard_Logo.svg.png"
                                alt="MasterCard Logo"
                                className="h-6"
                            />
                        </div>
                    </div>

                    {/* Placeholder for other payment options */}
                    <div className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 text-lg">
                        <FontAwesomeIcon icon={faInfoCircle} className="mr-3" />
                        Các phương thức thanh toán khác sẽ sớm ra mắt!
                    </div>
                </div>

                <p className="mt-8 text-gray-600 text-sm text-center">
                    <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                    Đây là trang thanh toán mẫu. Trong ứng dụng thực tế, bạn sẽ
                    tích hợp với các cổng thanh toán để xử lý giao dịch.
                </p>
            </div>

            {/* Payment Details Modal */}
            {showModal && appointmentDetails && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md mx-4 relative">
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                            onClick={closeModal}
                        >
                            <FontAwesomeIcon icon={faTimes} size="lg" />
                        </button>
                        <h2 className="text-2xl font-bold text-primary-dark mb-6 text-center">
                            Chi tiết Thanh toán
                        </h2>

                        <div className="space-y-4 text-gray-700">
                            <p className="flex items-center">
                                <FontAwesomeIcon
                                    icon={faCalendarAlt}
                                    className="mr-3 text-gray-500"
                                />
                                <span className="font-semibold">Ngày hẹn:</span>{" "}
                                {formattedDate}
                            </p>
                            <p className="flex items-center">
                                <FontAwesomeIcon
                                    icon={faCalendarAlt}
                                    className="mr-3 text-gray-500"
                                />
                                <span className="font-semibold">
                                    Thời gian:
                                </span>{" "}
                                {formattedTime}
                            </p>
                            <p className="flex items-center">
                                <FontAwesomeIcon
                                    icon={faMoneyBillWave}
                                    className="mr-3 text-gray-500"
                                />
                                <span className="font-semibold">
                                    Tổng tiền:
                                </span>{" "}
                                <span className="text-lg font-bold text-green-600">
                                    {formattedCost}
                                </span>
                            </p>
                            <p className="flex items-center">
                                <FontAwesomeIcon
                                    icon={faUserMd}
                                    className="mr-3 text-gray-500"
                                />
                                <span className="font-semibold">Bác sĩ:</span>{" "}
                                {appointmentDetails.doctor.name}
                            </p>
                            <p className="flex items-center">
                                <FontAwesomeIcon
                                    icon={faUserInjured}
                                    className="mr-3 text-gray-500"
                                />
                                <span className="font-semibold">
                                    Bệnh nhân:
                                </span>{" "}
                                {appointmentDetails.patientName}
                            </p>
                            {appointmentDetails.symptoms && (
                                <p className="flex items-start">
                                    <FontAwesomeIcon
                                        icon={faInfoCircle}
                                        className="mt-1 mr-3 text-gray-500"
                                    />
                                    <span className="font-semibold">
                                        Triệu chứng:
                                    </span>{" "}
                                    {appointmentDetails.symptoms}
                                </p>
                            )}
                            {appointmentDetails.notes && (
                                <p className="flex items-start">
                                    <FontAwesomeIcon
                                        icon={faInfoCircle}
                                        className="mt-1 mr-3 text-gray-500"
                                    />
                                    <span className="font-semibold">
                                        Ghi chú:
                                    </span>{" "}
                                    {appointmentDetails.notes}
                                </p>
                            )}
                        </div>

                        <div className="mt-8 text-center">
                            <p className="text-md text-gray-800 mb-4">
                                Bạn đã chọn phương thức:{" "}
                                <span className="font-bold text-primary-dark">
                                    {selectedPaymentMethod}
                                </span>
                            </p>
                            <button
                                className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors duration-300"
                                onClick={() => {
                                    alert(
                                        `Thực hiện thanh toán ${formattedCost} qua ${selectedPaymentMethod} cho lịch hẹn ${appointmentId}`
                                    );
                                    closeModal();
                                    // Trong ứng dụng thực tế, bạn sẽ bắt đầu quy trình thanh toán tại đây.
                                    // Ví dụ: gọi API đến backend của bạn hoặc SDK cổng thanh toán.
                                }}
                            >
                                Xác nhận Thanh toán
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentPage;
