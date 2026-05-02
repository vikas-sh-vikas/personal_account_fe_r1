// components/TransactionCard.tsx
"use client";
import TransactionForm from "@/components/ui/bankForm/transactionForm";
import { Button } from "@/components/ui/button/button";
import ReportTransactionCard from "@/components/ui/dashUi/reportCards";
import DeleteModal from "@/components/ui/deleteModal/deleteModal";
import useFetch from "@/hooks/useFetch";
import useModal from "@/hooks/useModal";
import { ModalSize } from "@/state/modal/slice";
import { endOfMonth, startOfMonth } from "date-fns";
import {
  getTransaction,
  deleteTransaction,
} from "@/utils/api.constant";
import { eHTTPStatusCode } from "@/utils/enum";
import React, { useEffect, useState, useRef } from "react";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import Loader from "@/components/ui/loader/loader";

import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Download, PieChart, ArrowLeftRight } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const Reports = () => {
  // ... (previous state and logic remains the same)
  const { onCloseModal, onShowModal } = useModal();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const { post } = useFetch();
  const [trasactionList, setTrasactionList] = useState<TransactionReport[]>([]);
  const [trasactionListReport, setTrasactionListReport] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [trasactionFormData, setTrasactionFormData] =
    useState<TransactionReport>({
      _id: "",
      type: "",
      typeName: "",
      amount: "",
      category: "",
      categoryName: "",
      paymentMethod: "",
      paymentMethodName: "",
      description: "",
      bank: "",
      bankName: "",
      date: new Date(),
    });

  const getTransactionMethod = async () => {
    try {
      setIsLoading(true);
      const fromDateUtc = new Date(Date.UTC(startOfMonth(selectedDate).getFullYear(), startOfMonth(selectedDate).getMonth(), startOfMonth(selectedDate).getDate(), 0, 0, 0, 0));
      const toDateUtc = new Date(Date.UTC(endOfMonth(selectedDate).getFullYear(), endOfMonth(selectedDate).getMonth(), endOfMonth(selectedDate).getDate(), 23, 59, 59, 999));
      const payload = { data: { fromDate: fromDateUtc, toDate: toDateUtc } };
      const response = await post(getTransaction, payload);
      const { errors, statusCode, data } = response.data;
      if (statusCode == eHTTPStatusCode.OK) {
        setTrasactionListReport(data);
        const list = data.map((apiData: any) => ({
          _id: apiData._id,
          type: apiData.transaction_type?._id,
          typeName: apiData.transaction_type?.name,
          amount: apiData.amount,
          category: apiData.category?._id,
          categoryName: apiData.category?.name,
          paymentMethod: apiData.payment_type?._id,
          paymentMethodName: apiData.payment_type?.name,
          description: apiData.description,
          bank: apiData.bank?._id,
          bankName: apiData.bank?.bank_name,
          date: apiData.date,
        }));
        setTrasactionList(list);
      } else {
        toast.error(errors[0].message, { autoClose: 3000, pauseOnHover: true });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTransactionMethod();
  }, [selectedDate]);

  const deleteTransactionMethod = async (id: string) => {
    try {
      const payload = { data: { _id: id } };
      const response = await post(deleteTransaction, payload);
      const { errors, message, statusCode } = response.data;
      if (statusCode == eHTTPStatusCode.OK) {
        toast.success(message);
        getTransactionMethod();
        onCloseModal();
      } else {
        toast.error(errors[0].message, { autoClose: 3000, pauseOnHover: true });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const downloadExcel = async () => {
    const fromDateUtc = new Date(Date.UTC(startOfMonth(selectedDate).getFullYear(), startOfMonth(selectedDate).getMonth(), startOfMonth(selectedDate).getDate(), 0, 0, 0, 0));
    const toDateUtc = new Date(Date.UTC(endOfMonth(selectedDate).getFullYear(), endOfMonth(selectedDate).getMonth(), endOfMonth(selectedDate).getDate(), 23, 59, 59, 999));
    try {
      const data = { fromDate: fromDateUtc, toDate: toDateUtc };
      const response = await fetch("/api/proxy", {
        method: "POST",
        body: JSON.stringify({ url: "/api/transaction/exportExcelReport", data }),
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `Report_${selectedDate.getMonth() + 1}_${selectedDate.getFullYear()}.xlsx`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);
        toast.success("Report downloaded successfully");
      } else {
        toast.error("Failed to download report");
      }
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const handleDelete = (id: any) => {
    onShowModal({
      content: (
        <div style={{ height: "100%", boxSizing: "border-box" }}>
          <DeleteModal
            onSave={() => { deleteTransactionMethod(id); }}
            onCancel={() => { onCloseModal(); }}
            name={"Transaction"}
          />
        </div>
      ),
      title: "Confirm Deletion",
      size: ModalSize.ImageUpload,
    });
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 glass-card p-6 rounded-3xl shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary">
            <PieChart size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold">Transaction Reports</h1>
            <p className="text-sm text-muted-foreground">View and manage your history</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <CalendarIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date | null) => { if (date) setSelectedDate(date); }}
              dateFormat="MMMM yyyy"
              showMonthYearPicker
              className="pl-10 pr-4 py-2.5 bg-background border border-input rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none w-full"
            />
          </div>
          <button
            onClick={downloadExcel}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
          >
            <Download size={16} /> <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader size={"40px"} className="text-primary" /></div>
      ) : (
        <div className="space-y-4">
          {trasactionList.length > 0 ? (
            trasactionList.map((item, index) => (
              <motion.div variants={itemVariants} key={item._id}>
                {editingIndex === index ? (
                  <div className="glass-card p-6 rounded-3xl">
                    <TransactionForm
                      setIsFormOpen={() => setEditingIndex(null)}
                      key={trasactionFormData._id}
                      transaction={trasactionFormData}
                      transactionList={getTransactionMethod}
                    />
                  </div>
                ) : (
                  <ReportTransactionCard
                    data={item}
                    onEdit={() => {
                      setTrasactionFormData(item);
                      setEditingIndex(index);
                    }}
                    onDelete={() => handleDelete(item._id)}
                  />
                )}
              </motion.div>
            ))
          ) : (
            <motion.div variants={itemVariants} className="text-center p-12 glass-card rounded-3xl text-muted-foreground">
              <div className="flex justify-center mb-4 opacity-20">
                <ArrowLeftRight size={64} />
              </div>
              <p>No transactions found for this period</p>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default Reports;



