"use client";
import React, {  useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormInput } from "../form/form-input";
import { FormDropdown } from "../form/form-dropdown";
import useFetch from "@/hooks/useFetch";
import { eHTTPStatusCode } from "@/utils/enum";
import { depositCash, GetBanks, withdrawCash } from "@/utils/api.constant";
import { toast } from "react-toastify";
import Loader from "../loader/loader";

type RefreshListFunction = (button: string) => void;

function DepositForm(props: {
  onRefreshList: RefreshListFunction;
  type: string;
  bankList:any[];
}) {
  const defaultValues: DepositDetail = {
    _id: "",
    bankId: "",
    amount: "",
  };
  const validationSchema = yup.object({
    bankId: yup.string().required("Select Bank"),
    amount: yup.string().required("Enter Amount"),
  });
  const [formData, setFormData] = useState<DepositDetail>(defaultValues);
const [bankOptions, setBankOptions] = useState<DropDownOptions[]>(
  props.bankList.map(apiData => ({
    value: apiData._id,
    label: apiData.bank_name,
  }))
);

  const [isLoading, setIsLoading] = useState(false);
  const { post } = useFetch();
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<DepositDetail>({
    mode: "all",
    defaultValues: formData,
    resolver: yupResolver(validationSchema),
  });
  const formValues = getValues();
  const dipositSubmit = async (values: DepositDetail) => {
    try {
      setIsLoading(true);
      const payment = {
        data: {
          ...values,
        },
      };
      const response = await post(depositCash, payment);
      const { errors, message, statusCode } = response.data;
      if (statusCode == eHTTPStatusCode.OK) {
        // const apiData = await response.data
        reset(defaultValues);
        toast.success(message);
        // getRecentTransection();
      } else {
        toast.error(errors[0].message);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
      props.onRefreshList("save");
    }
  };
  const withdrawSubmit = async (values: DepositDetail) => {
    try {
      setIsLoading(true);
      const payment = {
        data: {
          ...values,
        },
      };
      const response = await post(withdrawCash, payment);
      const { errors, message, statusCode } = response.data;
      if (statusCode == eHTTPStatusCode.OK) {
        // const apiData = await response.data
        reset(defaultValues);
        toast.success(message);
        // getRecentTransection();
      } else {
        toast.error(errors[0].message);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
      props.onRefreshList("save");
    }
  };

  const onSubmit: SubmitHandler<DepositDetail> = async (
    values: DepositDetail
  ) => {
    if (props.type === "DEPOSIT") {
      dipositSubmit(values);
    } else if (props.type === "WITHDRAW") {
      withdrawSubmit(values);
    }
  };
  return (
    <div className="border p-4 rounded-md space-y-2 bg-gray-50">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <h2 className="font-semibold">
            {props.type === "WITHDRAW" ? "Withdraw Cash" : "Deposit Cash"}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Amount"
              error={errors.amount?.message}
              name="amount"
              register={register}
              length={"full"}
              placeholder="Enter Amount"
              isRequired={true}
              onKeyPress={(e) => e.key === "Enter" && e.currentTarget.blur()}
            ></FormInput>
            <FormDropdown
              //  placeholder="Select Categoty"
              label={"Select Bank"}
              value={formValues.bankId}
              isRequired={true}
              options={bankOptions}
              error={errors.bankId?.message}
              onChange={(selected: any) => {
                // setValue("category", selected.groupUniqueId);
                setValue("bankId", selected.value, {
                  shouldValidate: true,
                });
              }}
            ></FormDropdown>
          </div>
          <div className="pt-3">
            <button
              onClick={handleSubmit(onSubmit)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-md hover:bg-blue-700 m-2"
            >
              {props.type.charAt(0).toUpperCase() +
                props.type.slice(1).toLowerCase()}
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

export default DepositForm;
