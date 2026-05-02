"use client";
import React, { useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormInput } from "../form/form-input";
import { FormDropdown } from "../form/form-dropdown";
import useFetch from "@/hooks/useFetch";
import { selfTransfer } from "@/utils/api.constant";
import { eHTTPStatusCode } from "@/utils/enum";
import { toast } from "react-toastify";
import Loader from "../loader/loader";

type RefreshListFunction = (button: string) => void;

function SelfTransferForm(props: {
  bankList: any[];
  onRefreshList: RefreshListFunction;
}) {
  // 1) Map banks → dropdown options once
  const bankOptions = useMemo(
    () =>
      props.bankList.map((b) => ({
        value: b._id,
        label: b.bank_name,
      })),
    [props.bankList]
  );

  // 2) Form + validation
  const validationSchema = yup.object({
    fromBankId: yup.string().required("Select From Bank"),
    toBankId: yup.string().required("Select To Bank"),
    amount: yup.string().required("Enter Amount"),
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SelfTransferDetail>({
    mode: "all",
    defaultValues: { _id: "", amount: "", fromBankId: "", toBankId: "" },
    resolver: yupResolver(validationSchema),
  });

  const watchedFrom = watch("fromBankId");
  const watchedTo = watch("toBankId");

  // 3) Filter so you can't pick the same bank twice
  const fromOptions = useMemo(
    () => bankOptions.filter((opt) => opt.value !== watchedTo),
    [bankOptions, watchedTo]
  );
  const toOptions = useMemo(
    () => bankOptions.filter((opt) => opt.value !== watchedFrom),
    [bankOptions, watchedFrom]
  );

  // 4) Submission state
  const [isLoading, setIsLoading] = useState(false);
  const { post } = useFetch();

  const onSubmit: SubmitHandler<SelfTransferDetail> = async (values) => {
    setIsLoading(true);
    try {
      const payload = { data: values };
      const response = await post(selfTransfer, payload);
      const { message, statusCode, errors: apiErrors } = response.data;
      if (statusCode === eHTTPStatusCode.OK) {
        toast.success(message);
        reset();
      } else {
        toast.error(apiErrors[0]?.message || "Transfer failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
      props.onRefreshList("save");
    }
  };
  console.log("object");
  return (
    <div className="border p-4 rounded-md space-y-2 bg-gray-50">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <h2 className="font-semibold">Self Transfer</h2>

          <FormInput
            label="Amount"
            error={errors.amount?.message}
            name="amount"
            register={register}
            placeholder="Enter amount"
            isRequired
            onKeyPress={(e) => e.key === "Enter" && e.currentTarget.blur()}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormDropdown
              label="From Bank"
              value={watchedFrom}
              options={fromOptions}
              error={errors.fromBankId?.message}
              isRequired
              onChange={(opt) =>
                setValue("fromBankId", opt.value, { shouldValidate: true })
              }
            />
            <FormDropdown
              label="To Bank"
              value={watchedTo}
              options={toOptions}
              error={errors.toBankId?.message}
              isRequired
              onChange={(opt) =>
                setValue("toBankId", opt.value, { shouldValidate: true })
              }
            />
          </div>

          <div>
            <button
              onClick={handleSubmit(onSubmit)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-md hover:bg-blue-700 m-2"
            >
              Transfer
            </button>
            <button
              onClick={() => props.onRefreshList("cancel")}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:shadow-md hover:bg-red-700 m-2"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default SelfTransferForm;
