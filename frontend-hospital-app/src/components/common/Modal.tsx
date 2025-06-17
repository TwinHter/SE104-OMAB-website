// src/components/common/Modal.tsx
import React, { ReactNode } from "react";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    className?: string;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    className,
}) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 font-pt-sans animate-fade-in">
            <div
                className={`bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4 animate-scale-in ${className}`}
            >
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-xl font-semibold text-primary-dark">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition duration-200"
                    >
                        <FontAwesomeIcon icon={faTimes} className="text-lg" />
                    </button>
                </div>
                <div>{children}</div>
            </div>
        </div>,
        document.getElementById("modal-root")! // Tạo một div với id="modal-root" trong public/index.html
    );
};

export default Modal;
