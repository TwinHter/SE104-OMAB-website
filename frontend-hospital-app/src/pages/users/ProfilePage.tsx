// Ví dụ: src/pages/users/ProfilePage.tsx (có thể có sidebar)
import React from "react";
import { useParams } from "react-router-dom";
import { useUserById } from "../../hooks/useUsers";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorDisplay from "../../components/common/ErrorDisplay";
import ProfileSummary from "../../components/user/ProfileSummary";
import Sidebar from "../../components/layout/Sidebar"; // Import Sidebar
import { useAuth } from "../../hooks/useAuthContext";

const ProfilePage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const { currentUser } = useAuth();

    // Đảm bảo chỉ user hiện tại hoặc admin mới xem được profile của họ
    const idToFetch = userId === "me" ? currentUser?.id : userId;

    if (!idToFetch) {
        return (
            <p className="text-center text-gray-500">
                Không tìm thấy hồ sơ người dùng.
            </p>
        );
    }

    const {
        data: userProfile,
        isLoading,
        isError,
        error,
        // eslint-disable-next-line react-hooks/rules-of-hooks
    } = useUserById(idToFetch);

    if (isLoading) return <LoadingSpinner />;
    if (isError)
        return (
            <ErrorDisplay
                message={error?.message || "Không thể tải thông tin hồ sơ."}
            />
        );
    if (!userProfile)
        return (
            <p className="text-center text-gray-500">
                Không tìm thấy hồ sơ người dùng.
            </p>
        );

    return (
        <div className="flex font-pt-sans gap-8">
            <Sidebar />
            <div className="flex-grow">
                <h1 className="text-3xl font-bold text-primary-dark mb-6 border-b pb-3">
                    Hồ sơ của {userProfile.name}
                </h1>
                <ProfileSummary user={userProfile} />
            </div>
        </div>
    );
};

export default ProfilePage;
