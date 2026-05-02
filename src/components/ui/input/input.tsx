import React, { InputHTMLAttributes } from "react";
import { UseFormRegister } from "react-hook-form";

type Length = "full" | "half" | "oneThird" | "inputEmail";
type InputProps = {
  placeholder?: string;
  showPassword?: boolean;
  className?: string;
  register?: UseFormRegister<any>;
  name: string;
  disabled?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  autoComplete?: "on" | "off";
  length: Length;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
} & InputHTMLAttributes<any>;

export const Input = (props: InputProps) => {
  let {
    placeholder,
    className,
    register = (name: string) => {},
    name,
    onChange,
    onKeyDown,
    disabled,
    autoComplete,
    length,
    ...restProps
  } = props;
  autoComplete = autoComplete ?? "off";
  placeholder = placeholder ?? "Enter your value";

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <input
      {...restProps}
      value={props.value}
      className={`w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground/50 ${className}`}
      placeholder={placeholder}
      {...register(name)}
      onKeyDown={onKeyDown}
      disabled={disabled}
      autoComplete={autoComplete}
      onChange={handleChange}
    />
  );
};
