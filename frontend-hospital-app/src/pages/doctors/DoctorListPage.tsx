// src/pages/doctors/DoctorListPage.tsx
import React, { useState } from "react";
import { useDoctors } from "../../hooks/useDoctors";
import { useSpecialties } from "../../hooks/useSpecialties";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorDisplay from "../../components/common/ErrorDisplay";
import DoctorCard from "../../components/doctors/DoctorCard";
import { Doctor, Specialty } from "../../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSearch,
    faStethoscope,
    faStar,
} from "@fortawesome/free-solid-svg-icons";

const DoctorListPage: React.FC = () => {
    const {
        data: doctors,
        isLoading: isLoadingDoctors,
        isError: isErrorDoctors,
        error: errorDoctors,
    } = useDoctors();
    const {
        data: specialties,
        isLoading: isLoadingSpecialties,
        isError: isErrorSpecialties,
        error: errorSpecialties,
    } = useSpecialties();
    console.log(specialties);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSpecialty, setSelectedSpecialty] = useState("");
    const [minRating, setMinRating] = useState(0);

    const filteredDoctors = doctors?.filter((doctor) => {
        const matchesSearch = doctor.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesSpecialty =
            selectedSpecialty === "" || doctor.specialty === selectedSpecialty;
        const matchesRating = (doctor.avg_Rating || 0) >= minRating;
        return matchesSearch && matchesSpecialty && matchesRating;
    });

    if (isLoadingDoctors || isLoadingSpecialties) return <LoadingSpinner />;
    if (isErrorDoctors)
        return (
            <ErrorDisplay
                message={
                    errorDoctors?.message || "Không thể tải danh sách bác sĩ."
                }
            />
        );
    if (isErrorSpecialties)
        return (
            <ErrorDisplay
                message={
                    errorSpecialties?.message ||
                    "Không thể tải danh sách chuyên khoa."
                }
            />
        );

    return (
        <div className="font-pt-sans p-6">
            <h1 className="text-3xl font-bold text-primary-dark mb-6 border-b pb-3">
                Danh sách Bác sĩ
            </h1>

            {/* Filter Section */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label
                        htmlFor="search"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        <FontAwesomeIcon
                            icon={faSearch}
                            className="mr-2 text-gray-500"
                        />{" "}
                        Tìm theo tên
                    </label>
                    <input
                        type="text"
                        id="search"
                        placeholder="Tên bác sĩ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                </div>
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
                        value={selectedSpecialty}
                        onChange={(e) => setSelectedSpecialty(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    >
                        <option value="">Tất cả chuyên khoa</option>
                        {specialties?.map((s: Specialty) => (
                            <option key={s.name} value={s.name}>
                                {s.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label
                        htmlFor="rating"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        <FontAwesomeIcon
                            icon={faStar}
                            className="mr-2 text-gray-500"
                        />{" "}
                        Đánh giá tối thiểu
                    </label>
                    <input
                        type="number"
                        id="rating"
                        min="0"
                        max="5"
                        step="0.5"
                        value={minRating}
                        onChange={(e) =>
                            setMinRating(parseFloat(e.target.value))
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                </div>
            </div>

            {/* Doctor List */}
            {filteredDoctors && filteredDoctors.length === 0 ? (
                <p className="text-center text-gray-500 text-lg">
                    Không tìm thấy bác sĩ phù hợp.
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDoctors?.map((doctor: Doctor) => (
                        <DoctorCard key={doctor.id} doctor={doctor} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default DoctorListPage;
