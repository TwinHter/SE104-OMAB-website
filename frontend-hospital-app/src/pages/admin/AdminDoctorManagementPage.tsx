// src/pages/admin/AdminDoctorManagementPage.tsx
import React, { useState } from "react";
import { useSpecialties } from "../../hooks/useSpecialties";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorDisplay from "../../components/common/ErrorDisplay";
import Modal from "../../components/common/Modal";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import { CreateDoctorData, Doctor, Specialty } from "../../types"; // Import UserRole
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUserPlus,
    faEdit,
    faTrash,
    faSearch,
    faStethoscope,
    faTimes,
    faCalendarAlt,
    faPhone,
    faMapMarkerAlt,
    faLink,
    faDollarSign, // Icon cho phí tư vấn
    faBriefcase, // Icon cho năm kinh nghiệm
} from "@fortawesome/free-solid-svg-icons";
import { useCreateDoctor, useDoctors } from "../../hooks/useDoctors";
import { updateDoctor, useDeleteUser } from "../../hooks/useUsers";

const AdminDoctorManagementPage: React.FC = () => {
    const { data: doctors, isLoading, isError, error, refetch } = useDoctors();
    const { data: specialties, isLoading: isLoadingSpecialties } =
        useSpecialties();

    const createDoctorMutation = useCreateDoctor();
    const updateUserMutation = updateDoctor(); // Sử dụng useUpdateUser nếu cần cập nhật thông tin người dùng
    const deleteUserMutation = useDeleteUser();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        specialty: "",
        consultationFee: "",
        experienceYears: "",
        description: "",
        dateOfBirth: "",
        address: "",
        phone: "",
        avatarUrl: "",
    });
    const [searchTerm, setSearchTerm] = useState("");

    const filteredDoctors = doctors?.filter(
        (doctor) =>
            doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenModal = (doctor: Doctor | null = null) => {
        setEditingDoctor(doctor);
        if (doctor) {
            setFormData({
                name: doctor.name,
                email: doctor.email,
                password: "",
                specialty: doctor.specialty,
                consultationFee: String(doctor.consultationFee || ""),
                experienceYears: String(doctor.experienceYears || ""),
                address: doctor.location || "",
                description: doctor.description || "",
                dateOfBirth: doctor.dateOfBirth
                    ? new Date(doctor.dateOfBirth).toISOString().split("T")[0]
                    : "",
                phone: doctor.phone || "",
                avatarUrl: doctor.avatarUrl || "",
            });
        } else {
            setFormData({
                name: "",
                email: "",
                password: "",
                specialty: "",
                consultationFee: "",
                experienceYears: "",
                address: "",
                description: "",
                dateOfBirth: "",
                phone: "",
                avatarUrl: "",
            });
        }
        setIsModalOpen(true);
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Build the data object to match CreateDoctorData type
        const dataToSubmit: CreateDoctorData = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            specialty: formData.specialty,
            consultationFee: parseFloat(formData.consultationFee),
            experienceYears: parseInt(formData.experienceYears),
            address: formData.address,
            description: formData.description,
            dateOfBirth: formData.dateOfBirth,
            phone: formData.phone,
            avatarUrl: formData.avatarUrl,
            // type: UserRole.Doctor, // Đảm bảo type là Doctor khi tạo hoặc cập nhật
        };

        if (!editingDoctor && !formData.password) {
            // Password required for new doctor
            alert("Vui lòng nhập mật khẩu cho bác sĩ mới.");
            return;
        }

        if (editingDoctor) {
            // For editing, remove password if not provided
            // Make password optional for update
            const updateData: Omit<CreateDoctorData, "password"> & {
                password?: string;
            } = { ...dataToSubmit };
            if (!formData.password) {
                delete updateData.password;
            }
            await updateUserMutation.mutateAsync({
                userId: editingDoctor.id,
                data: updateData,
            });
            alert("Cập nhật bác sĩ thành công!");
        } else {
            await createDoctorMutation.mutateAsync(dataToSubmit);
            alert("Thêm bác sĩ mới thành công!");
        }
        setIsModalOpen(false);
        refetch();
    };

    const handleDelete = async (doctorId: string) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa bác sĩ này?")) {
            await deleteUserMutation.mutateAsync(doctorId);
            alert("Xóa bác sĩ thành công!");
            refetch();
        }
    };

    if (isLoading || isLoadingSpecialties) return <LoadingSpinner />;
    if (isError)
        return (
            <ErrorDisplay
                message={error?.message || "Không thể tải danh sách bác sĩ."}
            />
        );

    return (
        <div className="font-pt-sans p-6">
            <h1 className="text-3xl font-bold text-primary-dark mb-6 border-b pb-3">
                Quản lý Bác sĩ
            </h1>

            <div className="flex justify-between items-center mb-6">
                <div className="relative flex-grow mr-4">
                    <InputField
                        id="search"
                        label="Tìm kiếm bác sĩ"
                        type="text"
                        placeholder="Tên, Email, Chuyên khoa..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        icon={faSearch}
                        className="mb-0"
                    />
                </div>
                <Button
                    variant="primary"
                    icon={faUserPlus}
                    onClick={() => handleOpenModal()}
                >
                    Thêm Bác sĩ mới
                </Button>
            </div>

            {filteredDoctors?.length === 0 ? (
                <p className="text-center text-gray-500 text-lg">
                    Không có bác sĩ nào được tìm thấy.
                </p>
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Tên
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Email
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Chuyên khoa
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Phí tư vấn
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Kinh nghiệm
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Điện thoại
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredDoctors?.map((doctor) => (
                                <tr key={doctor.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {doctor.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {doctor.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {doctor.specialty}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {doctor.consultationFee?.toLocaleString(
                                            "vi-VN"
                                        )}{" "}
                                        VND
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {doctor.experienceYears} năm
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {doctor.phone || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            icon={faEdit}
                                            className="mr-2"
                                            onClick={() =>
                                                handleOpenModal(doctor)
                                            }
                                        >
                                            Sửa
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            icon={faTrash}
                                            onClick={() =>
                                                handleDelete(doctor.id)
                                            }
                                            isLoading={
                                                deleteUserMutation.isPending &&
                                                deleteUserMutation.variables ===
                                                    doctor.id
                                            }
                                        >
                                            Xóa
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add/Edit Doctor Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingDoctor ? "Chỉnh sửa Bác sĩ" : "Thêm Bác sĩ mới"}
            >
                {/* Thay đổi ở đây: Sử dụng grid layout */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                            id="name"
                            label="Tên Bác sĩ"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <InputField
                            id="email"
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <InputField
                            id="password"
                            label={
                                editingDoctor
                                    ? "Mật khẩu (để trống nếu không đổi)"
                                    : "Mật khẩu"
                            }
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required={!editingDoctor}
                        />
                        <div>
                            <label
                                htmlFor="specialty"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                <FontAwesomeIcon
                                    icon={faStethoscope}
                                    className="mr-2 text-gray-500"
                                />{" "}
                                Chuyên khoa
                            </label>
                            <select
                                id="specialty"
                                value={formData.specialty}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            >
                                <option value="">Chọn chuyên khoa</option>
                                {specialties?.map((s: Specialty) => (
                                    <option key={s.id} value={s.name}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <InputField
                            id="consultationFee"
                            label="Phí tư vấn (VND)"
                            type="number"
                            value={formData.consultationFee}
                            onChange={handleChange}
                            required
                            min="0"
                            icon={faDollarSign} // Icon cho phí tư vấn
                        />
                        <InputField
                            id="experienceYears"
                            label="Số năm kinh nghiệm"
                            type="number"
                            value={formData.experienceYears}
                            onChange={handleChange}
                            required
                            min="0"
                            icon={faBriefcase} // Icon cho năm kinh nghiệm
                        />
                        <InputField
                            id="phone"
                            label="Số điện thoại"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            icon={faPhone}
                            placeholder="VD: 0912345678"
                        />
                        <InputField
                            id="dateOfBirth"
                            label="Ngày sinh"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            icon={faCalendarAlt}
                        />
                    </div>
                    {/* Các trường có thể rộng hơn hoặc cần 1 dòng riêng */}
                    <InputField
                        id="address"
                        label="Địa điểm làm việc"
                        type="text"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Ví dụ: Phòng khám A, Bệnh viện B"
                        icon={faMapMarkerAlt}
                    />
                    <InputField
                        id="avatarUrl"
                        label="URL Avatar"
                        type="url"
                        value={formData.avatarUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/avatar.jpg"
                        icon={faLink}
                    />
                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Mô tả chi tiết
                        </label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            placeholder="Mô tả về bác sĩ, chuyên môn..."
                        ></textarea>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setIsModalOpen(false)}
                            icon={faTimes}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={
                                createDoctorMutation.isPending ||
                                updateUserMutation.isPending
                            }
                            icon={editingDoctor ? faEdit : faUserPlus}
                        >
                            {editingDoctor ? "Cập nhật" : "Thêm"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default AdminDoctorManagementPage;
