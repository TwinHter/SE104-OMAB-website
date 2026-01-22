// src/components/common/InputField.tsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    id: string;
    icon?: IconDefinition;
    error?: string;
}

const InputField: React.FC<InputFieldProps> = ({
    label,
    id,
    icon,
    error,
    className = "",
    ...props
}) => {
    return (
        <div className={`mb-4 ${className}`}>
            <label
                htmlFor={id}
                className="block text-sm font-medium text-gray-700 mb-1"
            >
                {icon && (
                    <FontAwesomeIcon
                        icon={icon}
                        className="mr-2 text-gray-500"
                    />
                )}
                {label}
            </label>
            <input
                id={id}
                className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary transition duration-200 ${
                    error ? "border-red-500" : "border-gray-300"
                }`}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

export default InputField;
