// src/pages/ProfileDetailsPage.tsx
import React from "react";
import { useParams } from "react-router-dom";
import { useUserById, useUpdateUser } from "../../hooks/useUsers";
import { UserRole, User, Doctor, Relative, UpdateUserData } from "../../types";
import {
    faPhone,
    faEdit,
    faHeartbeat,
    faUsers,
    faBirthdayCake,
    faVenusMars,
    faMapMarkerAlt,
    faStethoscope,
    faAllergies,
    faIdCard,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorDisplay from "../../components/common/ErrorDisplay";
import { useAuth } from "../../hooks/useAuthContext"; // Import useAuth

const ProfileDetailsPage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const { currentUser } = useAuth(); // Lấy currentUser từ AuthContext

    const {
        data: user,
        isLoading,
        isError,
        error,
        refetch,
    } = useUserById(userId ?? "");
    const updateUserMutation = useUpdateUser();

    const [editMode, setEditMode] = React.useState(false);
    const [formData, setFormData] = React.useState<UpdateUserData>({});

    React.useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                phone: user.phone || "",
                address: user.address || "",
                gender: user.gender ?? undefined,
                // Chuyển đổi dateOfBirth sang định dạng 'YYYY-MM-DD' nếu nó không ở định dạng đó
                // hoặc đảm bảo API trả về đúng định dạng
                dateOfBirth: user.dateOfBirth
                    ? new Date(user.dateOfBirth).toISOString().split("T")[0]
                    : "",
                description: user.description || "",
                // Type casting an toàn hơn bằng cách kiểm tra
                bloodType:
                    user.type === UserRole.Patient && (user as User).bloodType
                        ? (user as User).bloodType
                        : "",
                allergies:
                    user.type === UserRole.Patient && (user as User).allergies
                        ? (user as User).allergies
                        : "",
                insuranceNumber:
                    user.type === UserRole.Patient &&
                    (user as User).insuranceNumber
                        ? (user as User).insuranceNumber
                        : "",
            });
        }
    }, [user]);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;

        // Chỉ cho phép cập nhật nếu người dùng có quyền
        if (!canEdit) {
            alert("Bạn không có quyền chỉnh sửa hồ sơ này.");
            return;
        }

        await updateUserMutation.mutateAsync({
            userId: userId,
            data: formData,
        });
        console.log("Profile updated:", formData);
        console.log("User ID:", userId);
        alert("Cập nhật hồ sơ thành công!");
        setEditMode(false);
        refetch(); // Tải lại dữ liệu sau khi cập nhật
    };

    if (isLoading) return <LoadingSpinner />;
    if (isError)
        return (
            <ErrorDisplay
                message={error?.message || "Không thể tải chi tiết hồ sơ."}
            />
        );
    if (!user)
        return (
            <div className="text-center text-gray-600">
                Không tìm thấy chi tiết người dùng.
            </div>
        );

    const isDoctor = user.type === UserRole.Doctor;
    const isPatient = user.type === UserRole.Patient;

    // Logic kiểm tra quyền chỉnh sửa
    const canEdit =
        currentUser && // Đảm bảo đã đăng nhập
        (currentUser.id === userId || // Là chủ sở hữu hồ sơ
            currentUser.type === UserRole.Admin); // Hoặc là admin

    return (
        <div className="font-pt-sans bg-background p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-primary-dark mb-6 border-b pb-3 flex justify-between items-center">
                Chi tiết Hồ sơ của {user.name}
                {canEdit &&
                    !editMode && ( // Chỉ hiển thị nút chỉnh sửa nếu có quyền và không ở chế độ chỉnh sửa
                        <button
                            onClick={() => setEditMode(true)}
                            className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-md flex items-center transition duration-300"
                        >
                            <FontAwesomeIcon icon={faEdit} className="mr-2" />{" "}
                            Chỉnh sửa
                        </button>
                    )}
            </h1>

            {/* Chỉ hiển thị form chỉnh sửa nếu có quyền và đang ở chế độ chỉnh sửa */}
            {canEdit && editMode ? (
                <form onSubmit={handleUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Tên:
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name || ""} // Đảm bảo giá trị không phải undefined
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email:
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email || ""}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="phone"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Điện thoại:
                            </label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                value={formData.phone || ""}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="address"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Địa chỉ:
                            </label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address || ""}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="gender"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Giới tính:
                            </label>
                            <select
                                id="gender"
                                name="gender"
                                value={formData.gender || ""} // Đảm bảo giá trị mặc định khi null/undefined
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            >
                                <option value="">Chọn giới tính</option>
                                <option value="Male">Nam</option>
                                <option value="Female">Nữ</option>
                                <option value="Other">Khác</option>
                            </select>
                        </div>
                        <div>
                            <label
                                htmlFor="dateOfBirth"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Ngày sinh:
                            </label>
                            <input
                                type="date"
                                id="dateOfBirth"
                                name="dateOfBirth"
                                value={formData.dateOfBirth || ""}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label
                                htmlFor="description"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Mô tả:
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description || ""}
                                onChange={handleChange}
                                rows={3}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            ></textarea>
                        </div>

                        {isPatient && (
                            <>
                                <div>
                                    <label
                                        htmlFor="bloodType"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Nhóm máu:
                                    </label>
                                    <input
                                        type="text"
                                        id="bloodType"
                                        name="bloodType"
                                        value={formData.bloodType || ""}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="allergies"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Dị ứng:
                                    </label>
                                    <input
                                        type="text"
                                        id="allergies"
                                        name="allergies"
                                        value={formData.allergies || ""}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="insuranceNumber"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Số bảo hiểm:
                                    </label>
                                    <input
                                        type="text"
                                        id="insuranceNumber"
                                        name="insuranceNumber"
                                        value={formData.insuranceNumber || ""}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                    />
                                </div>
                            </>
                        )}

                        {/* Các trường đặc biệt của bác sĩ chỉ admin mới có thể chỉnh sửa */}
                        {isDoctor && currentUser?.type === UserRole.Admin && (
                            <>
                                {/* Giả định các trường này có trong formData và UpdateUserData */}
                                <div>
                                    <label
                                        htmlFor="specialty"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Chuyên khoa:
                                    </label>
                                    <input
                                        type="text"
                                        id="specialty"
                                        name="specialty"
                                        value={
                                            (formData as Doctor).specialty || ""
                                        }
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="experienceYears"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Kinh nghiệm (năm):
                                    </label>
                                    <input
                                        type="number"
                                        id="experienceYears"
                                        name="experienceYears"
                                        value={
                                            (formData as Doctor)
                                                .experienceYears || 0
                                        }
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="location"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Địa điểm làm việc:
                                    </label>
                                    <input
                                        type="text"
                                        id="location"
                                        name="location"
                                        value={
                                            (formData as Doctor).location || ""
                                        }
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="consultationFee"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Phí tư vấn:
                                    </label>
                                    <input
                                        type="number"
                                        id="consultationFee"
                                        name="consultationFee"
                                        value={
                                            (formData as Doctor)
                                                .consultationFee || 0
                                        }
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                {/* Thêm các trường khác của bác sĩ mà admin có thể chỉnh sửa */}
                            </>
                        )}
                    </div>
                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            onClick={() => setEditMode(false)}
                            className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={updateUserMutation.isPending}
                            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                        >
                            {updateUserMutation.isPending
                                ? "Đang lưu..."
                                : "Lưu thay đổi"}
                        </button>
                    </div>
                </form>
            ) : (
                // Chế độ xem (không thay đổi)
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow-md">
                        <div>
                            <p className="text-gray-700 mb-2">
                                <FontAwesomeIcon
                                    icon={faPhone}
                                    className="mr-2 text-gray-500"
                                />
                                <span className="font-medium">Điện thoại:</span>{" "}
                                {user.phone || "Chưa cập nhật"}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <FontAwesomeIcon
                                    icon={faMapMarkerAlt}
                                    className="mr-2 text-gray-500"
                                />
                                <span className="font-medium">Địa chỉ:</span>{" "}
                                {user.address || "Chưa cập nhật"}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <FontAwesomeIcon
                                    icon={faVenusMars}
                                    className="mr-2 text-gray-500"
                                />
                                <span className="font-medium">Giới tính:</span>{" "}
                                {user.gender || "Chưa cập nhật"}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <FontAwesomeIcon
                                    icon={faBirthdayCake}
                                    className="mr-2 text-gray-500"
                                />
                                <span className="font-medium">Ngày sinh:</span>{" "}
                                {user.dateOfBirth || "Chưa cập nhật"}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-700 mb-2">
                                <span className="font-medium">Mô tả:</span>{" "}
                                {user.description || "Chưa cập nhật"}
                            </p>
                        </div>
                    </div>

                    {isPatient && (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                <FontAwesomeIcon
                                    icon={faHeartbeat}
                                    className="mr-3 text-primary"
                                />{" "}
                                Thông tin y tế
                            </h3>
                            <p className="text-gray-700 mb-2">
                                <span className="font-medium">Nhóm máu:</span>{" "}
                                {(user as User).bloodType || "Chưa cập nhật"}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <FontAwesomeIcon
                                    icon={faAllergies}
                                    className="mr-2 text-gray-500"
                                />
                                <span className="font-medium">Dị ứng:</span>{" "}
                                {(user as User).allergies || "Không có"}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <FontAwesomeIcon
                                    icon={faIdCard}
                                    className="mr-2 text-gray-500"
                                />
                                <span className="font-medium">
                                    Số bảo hiểm:
                                </span>{" "}
                                {(user as User).insuranceNumber ||
                                    "Chưa cập nhật"}
                            </p>

                            <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-3 flex items-center">
                                <FontAwesomeIcon
                                    icon={faUsers}
                                    className="mr-2 text-primary"
                                />{" "}
                                Người thân
                            </h4>
                            {/* {(user as User).relatives &&
                            (user as User).relatives!.length > 0 ? (
                                <ul className="space-y-3">
                                    {(user as User).relatives!.map(
                                        (relative: Relative) => (
                                            <li
                                                key={relative.id}
                                                className="bg-gray-100 p-3 rounded-md border border-gray-200"
                                            >
                                                <p className="font-medium">
                                                    {relative.name} - (
                                                    {relative.relationship})
                                                </p>
                                                <p className="text-sm text-gray-700">
                                                    SĐT:{" "}
                                                    {relative.phone ||
                                                        "Chưa cập nhật"}
                                                </p>
                                            </li>
                                        )
                                    )}
                                </ul>
                            ) : (
                                <p className="text-gray-500 text-sm">
                                    Chưa có thông tin người thân.
                                </p>
                            )} */}
                            {/* Nút thêm người thân ở đây nếu có API */}
                        </div>
                    )}

                    {isDoctor && (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                <FontAwesomeIcon
                                    icon={faStethoscope}
                                    className="mr-3 text-primary"
                                />{" "}
                                Chi tiết chuyên môn
                            </h3>
                            <p className="text-gray-700 mb-2">
                                <span className="font-medium">
                                    Chuyên khoa:
                                </span>{" "}
                                {(user as unknown as Doctor).specialty}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <span className="font-medium">
                                    Kinh nghiệm:
                                </span>{" "}
                                {(user as unknown as Doctor).experienceYears}{" "}
                                năm
                            </p>
                            <p className="text-gray-700 mb-2">
                                <span className="font-medium">
                                    Địa điểm làm việc:
                                </span>{" "}
                                {(user as unknown as Doctor).location}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <span className="font-medium">Phí tư vấn:</span>{" "}
                                {(
                                    user as unknown as Doctor
                                ).consultationFee?.toLocaleString("vi-VN")}{" "}
                                VND
                            </p>
                            <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-3">
                                Lịch làm việc:
                            </h4>
                            {(user as unknown as Doctor).availability &&
                            Object.keys(
                                (user as unknown as Doctor).availability!
                            ).length > 0 ? (
                                Object.entries(
                                    (user as unknown as Doctor).availability!
                                ).map(([date, times]) => (
                                    <div key={date} className="mb-2">
                                        <p className="font-medium text-gray-700">
                                            {new Date(date).toLocaleDateString(
                                                "vi-VN"
                                            )}
                                            :
                                        </p>
                                        <ul className="list-disc list-inside ml-4 text-gray-600">
                                            {times.map((time, idx) => (
                                                <li key={idx}>{time}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm">
                                    Chưa có lịch làm việc được cập nhật.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProfileDetailsPage;
