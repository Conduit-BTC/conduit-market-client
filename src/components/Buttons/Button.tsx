import React from "react";

export interface ButtonProps {
    variant?: "primary" | "secondary" | "outline";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
    variant = "primary",
    size = "md",
    disabled = false,
    children,
    onClick,
}) => {
    const baseStyles =
        "flex gap-2 font-semibold rounded-lg transition-colors focus:outline-hidden focus:ring-2 focus:ring-offset-2";

    const variantStyles = {
        primary: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500",
        secondary:
            "bg-gray-700 text-gray-100 hover:bg-gray-800 focus:ring-gray-700",
        outline:
            "border-2 border-blue-500 text-blue-500 hover:bg-blue-900/10 focus:ring-blue-500",
    };

    const sizeStyles = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
    };

    const disabledStyles = disabled
        ? "opacity-50 cursor-not-allowed"
        : "cursor-pointer";

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${
                sizeStyles[size]
            } ${disabledStyles}`}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;
