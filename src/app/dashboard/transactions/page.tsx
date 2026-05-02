"use client";

import TransactionForm from "@/components/ui/bankForm/transactionForm";
import AddTransactionForm from "@/components/ui/bankForm/AddTransactionForm";
import DepositForm from "@/components/ui/bankForm/depositForm";
import SelfTransferForm from "@/components/ui/bankForm/selfTransferForm";
import ReportTransactionCard from "@/components/ui/dashUi/reportCards";
import DeleteModal from "@/components/ui/deleteModal/deleteModal";
import useFetch from "@/hooks/useFetch";
import useModal from "@/hooks/useModal";
import { ModalSize } from "@/state/modal/slice";
import { endOfMonth, startOfMonth } from "date-fns";
import { getTransaction, deleteTransaction, GetBanks } from "@/utils/api.constant";
import { eHTTPStatusCode } from "@/utils/enum";
import React, { useEffect, useState, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import Loader from "@/components/ui/loader/loader";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, Download, History, Plus, ArrowLeftRight, Search, Landmark, Upload } from "lucide-react";

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

const TransactionsPage = () => {
  const { onCloseModal, onShowModal } = useModal();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formType, setFormType] = useState<string | null>(null);
  const { post } = useFetch();
  const [trasactionList, setTrasactionList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [bankDetails, setBankDetails] = useState<any[]>([]);

  const formRef = useRef<HTMLDivElement>(null);

  const getTransactionMethod = async () => {
    try {
      setIsLoading(true);
      const fromDateUtc = new Date(Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth(), 1, 0, 0, 0, 0));
      const toDateUtc = new Date(Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0, 23, 59, 59, 999));
      const payload = { data: { fromDate: fromDateUtc, toDate: toDateUtc } };
      const response = await post(getTransaction, payload);
      const { errors, statusCode, data } = response.data;
      if (statusCode == eHTTPStatusCode.OK) {
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
        toast.error(errors[0].message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getBankList = async () => {
    try {
      const response = await post(GetBanks);
      if (response.data.statusCode == eHTTPStatusCode.OK) {
        setBankDetails(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTransactionMethod();
    getBankList();
  }, [selectedDate]);

  const downloadExcel = async () => {
    const fromDateUtc = new Date(Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth(), 1, 0, 0, 0, 0));
    const toDateUtc = new Date(Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0, 23, 59, 59, 999));
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
        link.download = `Transactions_${selectedDate.getMonth() + 1}_${selectedDate.getFullYear()}.xlsx`;
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

  const handleDelete = (id: string) => {
    onShowModal({
      content: (
        <DeleteModal
          onSave={async () => {
            const response = await post(deleteTransaction, { data: { _id: id } });
            if (response.data.statusCode == eHTTPStatusCode.OK) {
              toast.success("Deleted successfully");
              getTransactionMethod();
              onCloseModal();
            }
          }}
          onCancel={onCloseModal}
          name="Transaction"
        />
      ),
      title: "Confirm Deletion",
      size: ModalSize.sm,
    });
  };

  const onRefreshList = (button: string) => {
    if (button === "save") {
      getTransactionMethod();
    }
    setFormType(null);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent inline-block">
            Transactions History
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Track and manage your spending habits</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <CalendarIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date | null) => date && setSelectedDate(date)}
              dateFormat="MMMM yyyy"
              showMonthYearPicker
              className="w-full pl-12 pr-4 py-3 bg-secondary/50 border border-border rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <button
            onClick={downloadExcel}
            className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
            title="Export to Excel"
          >
            <Download size={20} />
          </button>
        </div>
      </motion.div>

      {/* Quick Action Buttons */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => setFormType("TRANSACTION")}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold transition-all shadow-lg ${formType === "TRANSACTION" ? 'bg-primary text-white shadow-primary/20' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
        >
          <Plus size={18} /> Add New
        </button>
        <button
          onClick={() => setFormType("DEPOSIT")}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold transition-all shadow-lg ${formType === "DEPOSIT" ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
        >
          <Landmark size={18} /> Deposit
        </button>
        <button
          onClick={() => setFormType("WITHDRAW")}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold transition-all shadow-lg ${formType === "WITHDRAW" ? 'bg-rose-500 text-white shadow-rose-500/20' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
        >
          <Upload size={18} /> Withdraw
        </button>
        <button
          onClick={() => setFormType("TRANSFER")}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold transition-all shadow-lg ${formType === "TRANSFER" ? 'bg-amber-500 text-white shadow-amber-500/20' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
        >
          <ArrowLeftRight size={18} /> Transfer
        </button>
      </motion.div>

      <AnimatePresence mode="wait">
        {formType && (
          <motion.div
            key={formType}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-8 rounded-[2.5rem] border border-white/10 shadow-2xl"
          >
            {formType === "TRANSACTION" && (
              <AddTransactionForm
                onSuccess={() => onRefreshList("save")}
                onCancel={() => setFormType(null)}
              />
            )}
            {formType === "DEPOSIT" && (
              <DepositForm type="DEPOSIT" bankList={bankDetails} onRefreshList={onRefreshList} />
            )}
            {formType === "WITHDRAW" && (
              <DepositForm type="WITHDRAW" bankList={bankDetails} onRefreshList={onRefreshList} />
            )}
            {formType === "TRANSFER" && (
              <SelfTransferForm bankList={bankDetails} onRefreshList={onRefreshList} />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground font-bold text-sm px-2 uppercase tracking-widest">
          <History size={16} /> <span>Transaction Log</span>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-20"><Loader size="40px" className="text-primary" /></div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {trasactionList.length > 0 ? (
              trasactionList.map((item, index) => (
                <motion.div variants={itemVariants} key={item._id}>
                  {editingIndex === index ? (
                    <div className="glass-card p-8 rounded-3xl border border-primary/20">
                      <TransactionForm
                        setIsFormOpen={() => setEditingIndex(null)}
                        transaction={item}
                        transactionList={getTransactionMethod}
                      />
                    </div>
                  ) : (
                    <ReportTransactionCard
                      data={item}
                      onEdit={() => {
                        setEditingIndex(index);
                      }}
                      onDelete={() => handleDelete(item._id)}
                    />
                  )}
                </motion.div>
              ))
            ) : (
              <motion.div variants={itemVariants} className="text-center p-20 glass-card rounded-[2.5rem] border border-dashed border-white/10">
                <div className="flex justify-center mb-6 opacity-10">
                  <Search size={80} />
                </div>
                <h3 className="text-xl font-bold mb-2">No transactions found</h3>
                <p className="text-muted-foreground">Try selecting a different month or add a new transaction.</p>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TransactionsPage;
