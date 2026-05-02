"use client";
import React, { useState, InputHTMLAttributes } from "react";
import Label from "@/components/ui/label/label";
import { Input } from "@/components/ui/input/input";
import styles from "@/components/ui/form/form.module.css";
import { UseFormRegister } from "react-hook-form";
import { FaCheck, FaEye, FaEyeSlash } from "react-icons/fa";
export enum varientProps {
  row = "row",
  column = "column",
}

type FormInputProps = {
  label?: string;
  name: string;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  row?: boolean;
  error?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  varient?: varientProps;
  register?: UseFormRegister<any>;
  autoComplete?: "on" | "off";
  password?: boolean;
  search?: boolean;
  number?: boolean;
  verified?: boolean;
  isRequired?: boolean;
  length?: any;
  isDisabled?: boolean;
} & InputHTMLAttributes<any>;

export const FormInput = (props: FormInputProps) => {
  let {
    label,
    className = "",
    error,
    onChange,
    inputClassName = "",
    disabled,
    varient = "row",
    password,
    search,
    verified,
    register,
    length,
    number,
    placeholder,
    isRequired,
    ...formInputProps
  } = props;

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    if (!disabled) setShowPassword(!showPassword);
  };

  const formInputClass = `${styles.formInput} ${className} ${styles[varient]}`;
  const labelClass = `${className} ${styles.lables}`;
  const inputClass = `${styles.RowInputCss} ${inputClassName}`;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-muted-foreground ml-1">
          {label}
          {isRequired && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <Input
          {...formInputProps}
          placeholder={placeholder}
          onChange={onChange}
          type={
            password && !showPassword
              ? "password"
              : search
                ? "search"
                : number
                  ? "number"
                  : "text"
          }
          className={inputClassName}
          length={length}
          disabled={disabled}
          register={register}
        />
        {password && (
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <FaEye size={18} className={disabled ? "opacity-50" : ""} />
            ) : (
              <FaEyeSlash size={18} className={disabled ? "opacity-50" : ""} />
            )}
          </button>
        )}
        {verified && (
          <span className="absolute inset-y-0 right-3 flex items-center text-emerald-500">
            <FaCheck size={18} />
          </span>
        )}
      </div>
      {error && (
        <p className="text-xs font-medium text-destructive ml-1 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
};
