// src/pages/common/StatisticsPage.tsx
import React from "react";
import {
    useAdminOverviewStatistics,
    useDoctorOverviewStatistics, // Chỉ dùng hook overview cho bác sĩ
    // Các hook Monthly/Annual không còn được dùng trực tiếp ở đây theo yêu cầu mới
    // useAdminMonthlyStatistics,
    // useAdminAnnualStatistics,
    // useDoctorMonthlyStatistics,
    // useDoctorAnnualStatistics,
} from "../../hooks/useStatistics";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorDisplay from "../../components/common/ErrorDisplay";
import { UserRole } from "../../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChartLine,
    faUsers,
    faUserMd,
    faCalendarCheck,
    faStar, // Cho đánh giá trung bình
    faCalendarAlt, // Cho tổng lịch hẹn
    faCommentDots, // Cho tổng đánh giá
} from "@fortawesome/free-solid-svg-icons";
// Chart.js components - sẽ không dùng nếu không có dữ liệu monthly/annual
// import { Chart } from "react-chartjs-2";
// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     BarElement,
//     Title,
//     Tooltip,
//     Legend,
//     ArcElement,
// } from "chart.js";
import { useAuth } from "../../hooks/useAuthContext";

// Chart.js registration removed if no charts are used

const StatisticsPage: React.FC = () => {
    const { currentUser } = useAuth();
    // Bỏ qua selectedYear/Month vì không dùng thống kê monthly/annual trực tiếp từ API nữa
    // const currentYear = new Date().getFullYear();
    // const currentMonth = new Date().getMonth() + 1;
    // const [selectedYear, setSelectedYear] = useState(currentYear);
    // const [selectedMonth, setSelectedMonth] = useState(currentMonth);

    // Admin Data Hook
    const {
        data: adminOverview,
        isLoading: isLoadingAdminOverview,
        isError: isErrorAdminOverview,
        error: errorAdminOverview,
    } = useAdminOverviewStatistics();

    // Doctor Data Hook
    const {
        data: doctorOverview,
        isLoading: isLoadingDoctorOverview,
        isError: isErrorDoctorOverview,
        error: errorDoctorOverview,
    } = useDoctorOverviewStatistics(
        currentUser?.type == UserRole.Doctor ? currentUser?.id : ""
    );

    if (!currentUser) {
        return <ErrorDisplay message="Vui lòng đăng nhập để xem thống kê." />;
    }

    const isLoading =
        currentUser.type === UserRole.Admin
            ? isLoadingAdminOverview
            : isLoadingDoctorOverview;

    const isError =
        currentUser.type === UserRole.Admin
            ? isErrorAdminOverview
            : isErrorDoctorOverview;

    const error =
        currentUser.type === UserRole.Admin
            ? errorAdminOverview
            : errorDoctorOverview;

    if (isLoading) return <LoadingSpinner />;
    if (isError)
        return (
            <ErrorDisplay
                message={error?.message || "Không thể tải dữ liệu thống kê."}
            />
        );

    return (
        <div className="font-pt-sans p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-primary-dark mb-8 border-b-2 border-primary-light pb-4 flex items-center">
                <FontAwesomeIcon
                    icon={faChartLine}
                    className="mr-4 text-primary"
                />{" "}
                Thống kê & Báo cáo
            </h1>

            {/* Admin Statistics Overview */}
            {currentUser.type === UserRole.Admin && adminOverview && (
                <div className="bg-white p-8 rounded-xl shadow-lg mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        <FontAwesomeIcon
                            icon={faChartLine}
                            className="mr-3 text-blue-600"
                        />
                        Thống kê Tổng quan Hệ thống
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-lg shadow-md text-center border border-blue-300">
                            <FontAwesomeIcon
                                icon={faUserMd}
                                className="text-5xl text-blue-700 mb-3"
                            />
                            <h3 className="text-xl font-semibold text-gray-800 mb-1">
                                Tổng Bác sĩ
                            </h3>
                            <p className="text-4xl font-extrabold text-blue-900">
                                {adminOverview.total_Doctors}
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-lg shadow-md text-center border border-green-300">
                            <FontAwesomeIcon
                                icon={faUsers}
                                className="text-5xl text-green-700 mb-3"
                            />
                            <h3 className="text-xl font-semibold text-gray-800 mb-1">
                                Tổng Bệnh nhân
                            </h3>
                            <p className="text-4xl font-extrabold text-green-900">
                                {adminOverview.total_Patients}
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-lg shadow-md text-center border border-purple-300">
                            <FontAwesomeIcon
                                icon={faCalendarCheck}
                                className="text-5xl text-purple-700 mb-3"
                            />
                            <h3 className="text-xl font-semibold text-gray-800 mb-1">
                                Tổng Lịch hẹn
                            </h3>
                            <p className="text-4xl font-extrabold text-purple-900">
                                {adminOverview.total_Appointments}
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-red-100 to-red-200 p-6 rounded-lg shadow-md text-center border border-red-300">
                            <FontAwesomeIcon
                                icon={faCommentDots}
                                className="text-5xl text-red-700 mb-3"
                            />
                            <h3 className="text-xl font-semibold text-gray-800 mb-1">
                                Tổng Đánh giá
                            </h3>
                            <p className="text-4xl font-extrabold text-red-900">
                                {adminOverview.total_Reviews}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Doctor Statistics Overview */}
            {currentUser.type === UserRole.Doctor && doctorOverview && (
                <div className="bg-white p-8 rounded-xl shadow-lg mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        <FontAwesomeIcon
                            icon={faChartLine}
                            className="mr-3 text-blue-600"
                        />
                        Thống kê của Bác sĩ
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-lg shadow-md text-center border border-blue-300">
                            <FontAwesomeIcon
                                icon={faCalendarAlt}
                                className="text-5xl text-blue-700 mb-3"
                            />
                            <h3 className="text-xl font-semibold text-gray-800 mb-1">
                                Tổng lịch hẹn
                            </h3>
                            <p className="text-4xl font-extrabold text-blue-900">
                                {doctorOverview.total_Appointments}
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-lg shadow-md text-center border border-green-300">
                            <FontAwesomeIcon
                                icon={faCommentDots}
                                className="text-5xl text-green-700 mb-3"
                            />
                            <h3 className="text-xl font-semibold text-gray-800 mb-1">
                                Tổng đánh giá
                            </h3>
                            <p className="text-4xl font-extrabold text-green-900">
                                {doctorOverview.total_Reviews}
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-6 rounded-lg shadow-md text-center border border-yellow-300">
                            <FontAwesomeIcon
                                icon={faStar}
                                className="text-5xl text-yellow-700 mb-3"
                            />
                            <h3 className="text-xl font-semibold text-gray-800 mb-1">
                                Đánh giá trung bình
                            </h3>
                            <p className="text-4xl font-extrabold text-yellow-900">
                                {doctorOverview.avg_Rating.toFixed(2)} / 5
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Section for charts or other detailed statistics if needed later */}
            {/* Nếu bạn muốn thêm biểu đồ sau này, hãy thêm lại Chart.js và logic chartData */}
            <div className="bg-white p-8 rounded-xl shadow-lg mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <FontAwesomeIcon
                        icon={faChartLine}
                        className="mr-3 text-gray-600"
                    />
                    Thống kê chi tiết (đang phát triển)
                </h2>
                <p className="text-gray-600 text-lg">
                    Các biểu đồ và thống kê chi tiết theo thời gian (tháng, năm)
                    sẽ được cập nhật khi có API hỗ trợ từ backend. Hiện tại, bạn
                    có thể xem các chỉ số tổng quan ở trên.
                </p>
            </div>
        </div>
    );
};

export default StatisticsPage;
