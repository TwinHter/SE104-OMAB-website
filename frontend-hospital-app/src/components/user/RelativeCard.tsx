// src/components/user/RelativeCard.tsx
import React from "react";
import { Relative } from "../../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUserFriends,
    faPhone,
    faEdit,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../common/Button";

interface RelativeCardProps {
    relative: Relative;
    onEdit: (relative: Relative) => void;
    onDelete: (relativeId: string) => void;
    isDeleting: boolean;
}

const RelativeCard: React.FC<RelativeCardProps> = ({
    relative,
    onEdit,
    onDelete,
    isDeleting,
}) => {
    return (
        <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 font-pt-sans flex flex-col justify-between">
            <div>
                <h3 className="text-lg font-bold text-primary-dark mb-2 flex items-center">
                    <FontAwesomeIcon
                        icon={faUserFriends}
                        className="mr-3 text-primary"
                    />
                    {relative.name}
                </h3>
                <p className="text-gray-700 text-sm mb-1">
                    <span className="font-semibold">Quan hệ:</span>{" "}
                    {relative.relationship}
                </p>
                {relative.phone && (
                    <p className="text-gray-700 text-sm mb-3 flex items-center">
                        <FontAwesomeIcon
                            icon={faPhone}
                            className="mr-2 text-gray-500"
                        />
                        {relative.phone}
                    </p>
                )}
            </div>
            <div className="flex justify-end space-x-2 mt-4">
                <Button
                    variant="secondary"
                    size="sm"
                    icon={faEdit}
                    onClick={() => onEdit(relative)}
                >
                    Sửa
                </Button>
                <Button
                    variant="danger"
                    size="sm"
                    icon={faTrash}
                    onClick={() => onDelete(relative.id)}
                    isLoading={isDeleting}
                >
                    Xóa
                </Button>
            </div>
        </div>
    );
};

export default RelativeCard;
