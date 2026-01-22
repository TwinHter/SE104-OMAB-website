// src/components/common/Button.tsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "danger" | "success" | "outline";
    size?: "sm" | "md" | "lg";
    icon?: IconDefinition;
    isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = "primary",
    size = "md",
    icon,
    isLoading = false,
    className = "",
    disabled,
    ...props
}) => {
    const baseStyles =
        "inline-flex items-center justify-center font-medium rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";
    const disabledStyles = "opacity-50 cursor-not-allowed";

    const variantStyles = {
        primary:
            "bg-primary hover:bg-primary-dark text-white focus:ring-primary",
        secondary:
            "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400",
        danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500",
        success:
            "bg-green-500 hover:bg-green-600 text-white focus:ring-green-500",
        outline:
            "border border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary",
    };

    const sizeStyles = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
    };

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${
                sizeStyles[size]
            } ${isLoading ? disabledStyles : ""} ${
                disabled ? disabledStyles : ""
            } ${className}`}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading ? (
                <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
            ) : (
                icon && <FontAwesomeIcon icon={icon} className="mr-2" />
            )}
            {children}
        </button>
    );
};

export default Button;
