import React, { FC, SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
}

export const Select: FC<SelectProps> = ({
  children,
  className = "",
  ...props
}) => (
  <select className={`p-2 border rounded-md ${className}`} {...props}>
    {children}
  </select>
);

interface SelectItemProps
  extends React.OptionHTMLAttributes<HTMLOptionElement> {
  value: string;
  children: React.ReactNode;
}

export const SelectItem: FC<SelectItemProps> = ({
  value,
  children,
  ...props
}) => (
  <option value={value} {...props}>
    {children}
  </option>
);
