"use client";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormInput } from "../form/form-input";
import { FormDropdown } from "../form/form-dropdown";
import useFetch from "@/hooks/useFetch";
import { addEditCash, getUserDetail } from "@/utils/api.constant";
import { eHTTPStatusCode } from "@/utils/enum";
import { toast } from "react-toastify";
import Loader from "../loader/loader";

type RefreshListFunction = (button: string) => void;

function AddEditCashForm(props: {
  onRefreshList: RefreshListFunction;
  cash: string;
}) {
  const defaultValues: AddEditCash = {
    _id: "",
    cash: props.cash ?? "",
  };
  const validationSchema = yup.object({
    cash: yup.string().required("Add cash"),
  });
  const [isLoading, setIsLoading] = useState(false);
  const { post } = useFetch();

  const [formData, setFormData] = useState<AddEditCash>(defaultValues);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AddEditCash>({
    mode: "all",
    defaultValues: formData,
    resolver: yupResolver(validationSchema),
  });
  const formValues = getValues();
  const onSubmit: SubmitHandler<AddEditCash> = async (values: AddEditCash) => {
    try {
      setIsLoading(true);
      const payment = {
        data:{...values,}
      };
      const response = await post(addEditCash, payment);
      const { message, statusCode, errors,data } = response.data;
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
  return (
    <div className="border p-4 rounded-md space-y-2 bg-gray-50">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <h2 className="font-semibold">Cash Add/Edit</h2>
          <div className="grid grid-cols-1">
            <FormInput
              label="Add/Edit Cash"
              error={errors.cash?.message}
              name="cash"
              register={register}
              length={"full"}
              placeholder="Enter cash amount"
              isRequired={true}
              onKeyPress={(e) => e.key === "Enter" && e.currentTarget.blur()}
            ></FormInput>
          </div>

          <div className="pt-3">
            <button
              onClick={handleSubmit(onSubmit)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-md hover:bg-blue-700 m-2"
            >
              Update Cash
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

export default AddEditCashForm;
