"use client";

import { Button } from "@/components/ui/button/button";
import { FormInput } from "@/components/ui/form/form-input";
import Link from "next/link";
import { useState } from "react";
import * as yup from "yup";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useFetch from "@/hooks/useFetch";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaGoogle } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const defaultValues: Inputs = {
    email: "",
    password: "",
  };
  const validationSchema = yup.object({
    email: yup.string().required("Username is required").email(),
    password: yup.string().required("Password is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    mode: "all",
    defaultValues,
    resolver: yupResolver(validationSchema),
  });
  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        username: data.email,
        password: data.password,
      });

      if (result?.ok) {
        toast.success("Login successful");
        router.push("/dashboard");
      } else {
        toast.error("Invalid username or password");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-black">
          Login
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <FormInput
              label={"Email/Username"}
              error={errors.email?.message}
              isRequired={true}
              name="email"
              length={"full"}
              register={register}
              placeholder={"Enter email/username"}
              onKeyPress={(e) => e.key === "Enter" && e.currentTarget.blur()}
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
              password
              register={register}
              placeholder={"Enter Password"}
              onKeyPress={(e) => e.key === "Enter" && e.currentTarget.blur()}
            ></FormInput>
          </div>
          <div className="flex justify-between text-sm">
            <Link
              href="/auth/forgotpassword"
              className="text-blue-600 hover:underline"
            >
              Forgot password?
            </Link>
            <Link
              href="/auth/register"
              className="text-blue-600 hover:underline"
            >
              Sign up
            </Link>
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition duration-200"
          >
            {isSubmitting ? (
              <svg
                className="animate-spin h-5 w-5 mr-3 inline"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8C121.8 95.6 64 169.1 64 256c0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1c-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 140 77.1 42.1 182.9 10.6c16.9-5 34.8 4.6 39.8 21.5z" />
              </svg>
            ) : null}
            {isSubmitting ? "Loading...." : "Log In"}
          </Button>
          <div className="text-center">
            Or
          </div>
            <div className="flex items-center justify-center">
          <Button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition duration-200 flex justify-center items-center"
            >
              <span className="pr-2">
                          {isGoogleLoading ? (
              <svg
                className="animate-spin h-5 w-5 mr-3 inline"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8C121.8 95.6 64 169.1 64 256c0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1c-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 140 77.1 42.1 182.9 10.6c16.9-5 34.8 4.6 39.8 21.5z" />
              </svg>
            ) : null}
            {isGoogleLoading ? <>Loading....</> : <>Sign in with Google</>}
            
              </span>
            <FaGoogle className="text-xl" />
          </Button>

            </div>
        </form>
      </div>
    </div>
  );
}
