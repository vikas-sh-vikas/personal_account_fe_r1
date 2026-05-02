import React, { ButtonHTMLAttributes, FC } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export const Button: FC<ButtonProps> = ({
  children,
  className = "",
  ...props
}) => (
  <button className={`py-2 px-4 rounded transition ${className}`} {...props}>
    {children}
  </button>
);
