import React, { FC, HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Card: FC<CardProps> = ({ children, className = "", ...props }) => (
  <div className={`bg-white rounded-md shadow ${className}`} {...props}>
    {children}
  </div>
);

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const CardContent: FC<CardContentProps> = ({
  children,
  className = "",
  ...props
}) => (
  <div className={`p-4 ${className}`} {...props}>
    {children}
  </div>
);
