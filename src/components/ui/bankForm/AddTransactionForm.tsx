"use client";

import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Form from "@/components/ui/form/form";
import { FormInput } from "@/components/ui/form/form-input";
import { FormDropdown } from "@/components/ui/form/form-dropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useFetch from "@/hooks/useFetch";
import {
  getUserDashDetail,
  AddEditTransaction,
} from "@/utils/api.constant";
import { eHTTPStatusCode } from "@/utils/enum";
import Loader from "@/components/ui/loader/loader";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { PlusCircle, X } from "lucide-react";

interface AddTransactionFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const validationSchema = yup.object({
  amount: yup.string().required("Enter Amount"),
  category: yup.string().required("Select Category"),
  paymentMethod: yup.string().required("Select Payment Method"),
  date: yup.date().required("Date is required"),
  type: yup.string().required("Select Type"),
});

export default function AddTransactionForm({ onSuccess, onCancel }: AddTransactionFormProps) {
  const { post } = useFetch();
  const [isLoading, setIsLoading] = useState(false);
  const [toggleType, setToggleType] = useState("credit");
  const [transactionType, setTransactionType] = useState<string>("cash");
  
  const [bankOptions, setBankOptions] = useState<any[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<any[]>([]);
  const [transactionTypeOptions, setTransactionTypeOptions] = useState<any[]>([]);
  const [paymentTypeOptions, setPaymentTypeOptions] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<any>({
    mode: "all",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      date: new Date(),
      amount: "",
      description: "",
      category: "",
      paymentMethod: "",
      bank: "",
      type: "",
    }
  });

  const formValues = getValues();

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await post(getUserDashDetail);
        const { statusCode, data } = response.data;
        if (statusCode == eHTTPStatusCode.OK) {
          const { banks, categories, transactionTypes, paymentTypes } = data;
          setBankOptions(banks.map((b: any) => ({ value: b._id, label: b.bank_name })));
          setCategoryOptions(categories.map((c: any) => ({ value: c._id, label: c.name })));
          
          const tOptions = transactionTypes.map((t: any) => ({ value: t._id, label: t.name }));
          setTransactionTypeOptions(tOptions);
          if (tOptions.length > 0) {
            setValue("type", tOptions[0].value);
            setToggleType(tOptions[0].label);
          }

          const pOptions = paymentTypes.map((p: any) => ({ value: p._id, label: p.name }));
          setPaymentTypeOptions(pOptions);
          if (pOptions.length > 0) {
            setValue("paymentMethod", pOptions[0].value);
            setTransactionType(pOptions[0].label);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchOptions();
  }, []);

  const onSubmit: SubmitHandler<any> = async (values) => {
    try {
      setIsLoading(true);
      const payload = {
        data: {
          ...values,
          payment_type: values.paymentMethod,
          transaction_type: values.type,
          bank: values.bank !== "" ? values.bank : null,
        },
      };
      const response = await post(AddEditTransaction, payload);
      const { message, statusCode } = response.data;
      if (statusCode == eHTTPStatusCode.OK) {
        toast.success(message);
        reset({
          date: new Date(),
          bank: "",
          type: values.type,
          paymentMethod: values.paymentMethod,
        });
        if (onSuccess) onSuccess();
      } else {
        toast.error("Failed to add transaction");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      {onCancel && (
        <button 
          onClick={onCancel}
          className="absolute -top-2 -right-2 p-2 text-muted-foreground hover:text-foreground z-10"
        >
          <X size={20} />
        </button>
      )}
      
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
          <PlusCircle size={24} />
        </div>
        <h3 className="text-xl font-bold">New Transaction</h3>
      </div>

      <Form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex bg-secondary p-1.5 rounded-2xl gap-1">
          {transactionTypeOptions.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => {
                setToggleType(type.label);
                setValue("type", type.value);
              }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${toggleType === type.label
                ? "bg-white text-primary shadow-md scale-[1.02]"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground ml-1">Date</label>
            <DatePicker
              className="w-full bg-secondary/50 border border-border p-3 rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all outline-none font-medium"
              selected={formValues.date}
              onChange={(date: any) => setValue("date", date)}
            />
          </div>
          <FormInput
            label="Amount"
            error={errors.amount?.message}
            name="amount"
            register={register}
            length={"full"}
            placeholder="0.00"
            isRequired={true}
            className="!p-0 font-bold"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormDropdown
            label={"Category"}
            value={formValues.category}
            isRequired={true}
            options={categoryOptions}
            error={errors.category?.message}
            onChange={(selected: any) => setValue("category", selected.value)}
            className="!p-0 font-medium"
          />
          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground ml-1">Payment Method</label>
            <div className="flex bg-secondary p-1.5 rounded-2xl gap-1 h-[52px]">
              {paymentTypeOptions.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => {
                    setTransactionType(type.label);
                    setValue("paymentMethod", type.value);
                  }}
                  className={`flex-1 rounded-xl text-sm font-bold transition-all duration-300 ${transactionType === type.label
                    ? "bg-white text-primary shadow-md scale-[1.02]"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {transactionType !== "Cash" && (
          <FormDropdown
            label={"Select Bank"}
            value={formValues.bank}
            options={bankOptions}
            onChange={(selected: any) => setValue("bank", selected.value)}
            className="!p-0"
          />
        )}

        <FormInput
          label="Description (Optional)"
          name="description"
          register={register}
          length={"full"}
          placeholder="What was this for?"
          className="!p-0"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {isLoading ? <Loader size="20px" /> : <PlusCircle size={20} />}
          Add Transaction
        </button>
      </Form>
    </div>
  );
}
