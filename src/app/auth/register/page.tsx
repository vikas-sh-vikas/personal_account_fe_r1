"use client";

import React, { useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FormInput } from "@/components/ui/form/form-input";
import { registerUser } from "@/utils/api.constant";
import { eResultCode } from "@/utils/enum";
import useFetch from "@/hooks/useFetch";
import { Button } from "@/components/ui/button/button";
import { toast } from "react-toastify";
import Loader from "@/components/ui/loader/loader";
import Label from "@/components/ui/label/label";

type Inputs = {
  email: string;
  fullName: string;
  mobileNo: string;
  password: string;
  confirmPassword?: string;
  avatar?: File[];
};

export default function Login() {
  const { post } = useFetch();
  const [isLoading, setIsLoading] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const defaultValues: Inputs = {
    email: "",
    mobileNo: "",
    fullName: "",
    password: "",
    confirmPassword: "",
  };
  const router = useRouter();

  const validationSchema = yup.object({
    email: yup.string().required("email is required").email(),    
    mobileNo: yup.string()
    .required('Mobile number is required')
    .matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits'),
    fullName: yup.string().required("fullname is required"),
    password: yup.string().required("password is required"),
  });

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    mode: "all",
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    setIsLoading(true);

    try {
      if(data.password != data.confirmPassword){
        toast.error("Password and confirm password should be same")
      }
      else {
        const formData = new FormData();
  
        formData.append("user_name", data.email);
        formData.append("email", data.email);
        formData.append("full_name", data.fullName);
        formData.append("password", data.password);
        formData.append("mobileNo", data.mobileNo);
  
        if (data.avatar && data.avatar.length > 0) {
          formData.append("profilepic", data.avatar[0]); // assuming input type="file" with multiple={false}
        }
        // if (data.avatar) {
        //   formData.append("profilepic", data.avatar);
        // }
  
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASEURL}${registerUser}`, {
          method: "POST",
          body: formData, // no JSON.stringify!
          // ❌ Don't set Content-Type manually!
        });
        // const { returnCode, description } = response.data;
        // if (returnCode == eResultCode.SUCCESS) {
        //   router.push("/auth/login");
        //   // setIsAccountCreated(true);
        //   reset();
        // } else {
        // }
        const dataResponse = await response.json();
        const { success, message,errors } = dataResponse;
        if (success) {
          toast.success(message);
          router.push("/auth/login");
          reset();
        } else {
          toast.error(errors[0].message, {
            autoClose: 3000,
            pauseOnHover: true,
          });        
                    }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const [isDragging, setIsDragging] = useState(false);
  const dropRef = useRef<HTMLLabelElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setValue("avatar", [file], { shouldValidate: true });
      setFileName(file.name); // ✅ manually show file name
    }
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("avatar", [file], { shouldValidate: true });
      setFileName(file.name);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        {isLoading ? (
          <Loader size={"30px"} className="m-auto" />
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <FormInput
                  type="text"
                  label={"Email"}
                  error={errors.email?.message}
                  isRequired={true}
                  name="email"
                  length={"full"}
                  disabled={false}
                  register={register}
                  placeholder={"Enter email"}
                  onKeyPress={(e) =>
                    e.key === "Enter" && e.currentTarget.blur()
                  }
                ></FormInput>
              </div>
              <div>
                <FormInput
                  type="text"
                  label={"Full Name"}
                  error={errors.fullName?.message}
                  isRequired={true}
                  name="fullName"
                  length={"full"}
                  disabled={false}
                  register={register}
                  placeholder={"Enter fullName"}
                  onKeyPress={(e) =>
                    e.key === "Enter" && e.currentTarget.blur()
                  }
                ></FormInput>
              </div>
              <div>
                <FormInput
                  type="text"
                  label={"Mobile No"}
                  error={errors.mobileNo?.message}
                  isRequired={true}
                  name="mobileNo"
                  length={"full"}
                  disabled={false}
                  register={register}
                  placeholder={"Enter mobile no"}
                  onKeyPress={(e) =>
                    e.key === "Enter" && e.currentTarget.blur()
                  }
                ></FormInput>
              </div>
              <div>
                <FormInput
                  type="password"
                  label={"Password"}
                  error={errors.password?.message}
                  isRequired={true}
                  name="password"
                  length={"full"}
                  disabled={false}
                  register={register}
                  placeholder={"Enter password"}
                  onKeyPress={(e) =>
                    e.key === "Enter" && e.currentTarget.blur()
                  }
                ></FormInput>
              </div>
              <div>
                <FormInput
                  type="password"
                  label={"Confirm Password"}
                  error={errors.password?.message}
                  isRequired={true}
                  name="confirmPassword"
                  length={"full"}
                  disabled={false}
                  register={register}
                  placeholder={"Enter password"}
                  onKeyPress={(e) =>
                    e.key === "Enter" && e.currentTarget.blur()
                  }
                ></FormInput>
              </div>
              <div>
                <Label className="text-xl pb-2 text-gray-500">
                  Profile Picture
                </Label>
                {/* <input {...register("avatar")} type="file" /> */}
                <div className="mb-4">
                  {/* <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Picture
                  </label> */}
                  <label
                    ref={dropRef}
                    htmlFor="avatar"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors ${
                      isDragging
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-3 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12m-4 0h-2a2 2 0 00-2 2v0a2 2 0 002 2h2a2 2 0 002-2v0a2 2 0 00-2-2z"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, JPEG (Max 5MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      id="avatar"
                      {...register("avatar")}
                      onChange={handleFileChange}

                      className="hidden"
                    />
                  </label>
                </div>
                {fileName && (
  <p className="text-sm text-gray-600 mt-2">Selected file: {fileName}</p>
)}
              </div>
              <div className="flex justify-end text-sm">
                <p className="p-4 text-gray-500">
                  {"already have an account "}
                  <span className="text-gray-700 font-bold">
                    <Link
                      href="/auth/login"
                      className="text-blue-600 hover:underline"
                    >
                      Log In
                    </Link>
                  </span>
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition duration-200"
              >
                {toggle ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-3 inline"
                    fill="white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path d="M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8C121.8 95.6 64 169.1 64 256c0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1c-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 140 77.1 42.1 182.9 10.6c16.9-5 34.8 4.6 39.8 21.5z" />
                  </svg>
                ) : null}
                {toggle ? "Loading...." : "Log In"}
              </Button>
            </form>
          </>
        )}
      </div>

      {/* <div className="bg-[url('/login.jpg')] bg-cover bg-center bg-no-repeat h-full w-full"></div> */}
    </div>
  );
}
