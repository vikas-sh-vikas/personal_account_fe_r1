"use client";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormInput } from "../form/form-input";
import { addEditBanks } from "@/utils/api.constant";
import { eHTTPStatusCode } from "@/utils/enum";
import useFetch from "@/hooks/useFetch";
import { toast } from "react-toastify";
import Loader from "../loader/loader";
type RefreshListFunction = (button: string) => void;
type RefreshListFunctionList = (bool: boolean) => void;

function BankForm(props: {
  onRefreshList: RefreshListFunction;
  data?: BankDetail;
}) {
  const defaultValues: BankDetail = props.data ?? {
    _id: "",
    bankName: "",
    currentBalance: "",
    ifcsCode: "",
  };
  const validationSchema = yup.object({
    bankName: yup.string().required("Enter Amount"),
    currentBalance: yup.string().required("Select Payment Method"),
    ifcsCode: yup.string().required("Select Type"),
  });
  const [formData, setFormData] = useState<BankDetail>(defaultValues);
  const [isLoading, setIsLoading] = useState(false);
  const { post } = useFetch();
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BankDetail>({
    mode: "all",
    defaultValues: formData,
    resolver: yupResolver(validationSchema),
  });
  const formValues = getValues();
  const onSubmit: SubmitHandler<BankDetail> = async (values: BankDetail) => {
    console.log("DataSubmit", values);
    try {
      setIsLoading(true);
      const payment = {
        data:{
          ...values,
          bank_name: values.bankName,
          current_balance: values.currentBalance,
          opening_balance: values.openingBalance,
          ifsc_code: values.ifcsCode,
        }
      };
      const response = await post(addEditBanks, payment);
      const { dataResponse, message, statusCode } = response;
      if (statusCode == eHTTPStatusCode.OK) {
        // const apiData = await response.data
        console.log("object", response);
        reset(defaultValues);
        toast.success(message);
        // getRecentTransection();
      } else {
        
      }
    } catch (error) {
    } finally {
      props.onRefreshList("save");
      setIsLoading(false);
    }
  };
  return (
    <div className="border p-4 rounded-md space-y-2 bg-gray-50">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <h2 className="font-semibold">{props.data ? "Edit Bank" : "Add New Bank"}</h2>
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Bank Name"
              error={errors.bankName?.message}
              name="bankName"
              register={register}
              length={"full"}
              placeholder="Enter Bank Name"
              isRequired={true}
              onKeyPress={(e) => e.key === "Enter" && e.currentTarget.blur()}
            ></FormInput>
            <FormInput
              label="Branch"
              //   error={errors.bankName?.message}
              name="branch"
              register={register}
              length={"full"}
              placeholder="Enter Branch"
              isRequired={true}
              onKeyPress={(e) => e.key === "Enter" && e.currentTarget.blur()}
            ></FormInput>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Current Balance"
              //   error={errors.bankName?.message}
              name="currentBalance"
              register={register}
              length={"full"}
              placeholder="Enter Current Balance"
              isRequired={true}
              onKeyPress={(e) => e.key === "Enter" && e.currentTarget.blur()}
            ></FormInput>
            <FormInput
              label="Opening Balance"
              //   error={errors.bankName?.message}
              name="openingBalance"
              register={register}
              length={"full"}
              placeholder="Enter Opening Balance"
              isRequired={true}
              onKeyPress={(e) => e.key === "Enter" && e.currentTarget.blur()}
            ></FormInput>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Address"
              //   error={errors.bankName?.message}
              name="address"
              register={register}
              length={"full"}
              placeholder="Enter Adress"
              isRequired={true}
              onKeyPress={(e) => e.key === "Enter" && e.currentTarget.blur()}
            ></FormInput>
            <FormInput
              label="ifcs Code"
              //   error={errors.bankName?.message}
              name="ifcsCode"
              register={register}
              length={"full"}
              placeholder="IFCS Code"
              isRequired={true}
              onKeyPress={(e) => e.key === "Enter" && e.currentTarget.blur()}
            ></FormInput>
          </div>
          <div className="pt-3">
            <button
              onClick={handleSubmit(onSubmit)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-md hover:bg-blue-700 m-2"
              >
                {props.data ? "Edit Bank" : "Add Bank"}
              {/* Add Bank */}
            </button>
            <button
              onClick={() => props.onRefreshList("cancel")}
              className="bg-red-600 text-white px-4 py-2 rounded-lg m-2 hover:shadow-md hover:bg-red-700"
              >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default BankForm;
