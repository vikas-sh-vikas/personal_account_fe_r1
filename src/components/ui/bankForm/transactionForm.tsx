"use client";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormInput } from "../form/form-input";
import {
  FaBuildingColumns,
  FaCalendarDays,
  FaLayerGroup,
  FaMoneyBill1Wave,
} from "react-icons/fa6";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Label from "../label/label";
import { AddEditTransaction } from "@/utils/api.constant";
import { eHTTPStatusCode } from "@/utils/enum";
import { toast } from "react-toastify";
import useFetch from "@/hooks/useFetch";
import Loader from "../loader/loader";

type RefreshListFunction = (bool: boolean) => void;

function TransactionForm(props: {
  setIsFormOpen: RefreshListFunction;
  transaction: TransactionReport;
  transactionList: () => void;
}) {
  const defaultValues: TransactionReport = props.transaction;

  // console.log("object",defaultValues)
  const [isLoading, setIsLoading] = useState(false);
  const validationSchema = yup.object({
    amount: yup.string().required("Enter Amount"),
    category: yup.string().required("Select Category"),
    paymentMethod: yup.string().required("Select Payment Method"),
    date: yup.date().required("Date is required"),
    type: yup.string().required("Select Type"),
  });
  const [formData, setFormData] = useState<TransactionReport>(defaultValues);
  const { post } = useFetch();
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TransactionReport>({
    mode: "all",
    defaultValues: formData,
    resolver: yupResolver(validationSchema),
  });
  const formValues = getValues();
  const onSubmit: SubmitHandler<TransactionReport> = async (
    values: TransactionReport
  ) => {
    console.log("Values", values);
    try {
      setIsLoading(true);
      const payment = {
        data:{
          ...values,
          payment_type: values.paymentMethod,
          transaction_type: values.type,
          bank:
            values.bank === "" || values.bank === undefined ? null : values.bank,
        }
      };
      const response = await post(AddEditTransaction, payment);
      const { dataResponse, message, statusCode } = response.data;
      if (statusCode == eHTTPStatusCode.OK) {
        // const apiData = await response.data
        console.log("object", response);
        reset();
        toast.success(message);
        props.transactionList();
      } else {
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      props.setIsFormOpen(false);
    }
  };

  return isLoading ? (
    <Loader />
  ) : (
    <div className="border p-4 rounded-md space-y-2 bg-gray-50">
      <h2 className="font-semibold">Transaction Edit</h2>
      <div className="flex justify-between items-center mb-2">
        <span
          className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
            formData.typeName === "Credit"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {formData.typeName}
          {/* {formData.type.charAt(0).toUpperCase() + formData.type.slice(1)} */}
        </span>
        <span className="text-base font-bold text-gray-800">
          {/* ₹{formData.amount} */}
        </span>
      </div>

      {/* Info Rows */}
      <div className="space-y-1 text-gray-600 mb-2">
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1">
            <FaLayerGroup className="text-gray-500" />
            {formData.categoryName}
          </span>
          <span className="flex items-center gap-1">
            {/* <FaCalendarDays className="text-gray-500" /> */}
            {/* {formattedDate} */}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1">
            {formData.paymentMethodName === "Bank" ? (
              <>
                <FaBuildingColumns className="text-gray-500" />
                {formData.bankName}
              </>
            ) : (
              <>
                <FaMoneyBill1Wave className="text-gray-500" />
                Cash
              </>
            )}
          </span>
          {formData.description && (
            <span className="text-lg text-gray-500 font-semibold truncate max-w-[50%]">
              {formData.description}
            </span>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormInput
          label="Amount"
          error={errors.amount?.message}
          name="amount"
          register={register}
          length={"full"}
          placeholder="Enter Adress"
          isRequired={true}
          onKeyPress={(e) => e.key === "Enter" && e.currentTarget.blur()}
        ></FormInput>
        <div>
          <Label>Date</Label>
          <DatePicker
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            selected={formValues.date}
            //  error={errors.date?.message}

            onChange={(date: any) =>
              setValue("date", date, {
                shouldValidate: true,
              })
            }
          />
        </div>
      </div>

      <FormInput
        label="Description"
        // error={errors.amount?.message}
        name="description"
        register={register}
        length={"full"}
        placeholder="Enter Description"
        // isRequired={true}
        onKeyPress={(e) => e.key === "Enter" && e.currentTarget.blur()}
      ></FormInput>
      <div className="pt-3">
        <button
          onClick={handleSubmit(onSubmit)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-md hover:bg-blue-700 m-2"
        >
          Save
        </button>
        <button
          onClick={() => props.setIsFormOpen(false)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg m-2 hover:shadow-md hover:bg-red-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default TransactionForm;
