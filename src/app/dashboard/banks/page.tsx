"use client";

import BankCard from "@/components/ui/card/bankcard";
import React, { useEffect, useState } from "react";
import BankForm from "@/components/ui/bankForm/bankForm";
import AddEditCashForm from "@/components/ui/bankForm/addeditCash";
import useModal from "@/hooks/useModal";
import DeleteModal from "@/components/ui/deleteModal/deleteModal";
import { ModalSize } from "@/state/modal/slice";
import BankDetailCard from "@/components/ui/dashUi/bankCards";
import { GetBanks, getCashBankAmount } from "@/utils/api.constant";
import useFetch from "@/hooks/useFetch";
import { eHTTPStatusCode } from "@/utils/enum";
import { toast } from "react-toastify";
import Loader from "@/components/ui/loader/loader";

import { motion } from "framer-motion";
import { Landmark, Wallet, Plus, Edit3 } from "lucide-react";

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

const BankPage = () => {
  // ... (previous state and logic remains the same)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [cashAmount, setCashAmount] = useState("");
  const [bankAmount, setBankAmount] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const bankFormRef = React.useRef<HTMLDivElement | null>(null);
  const cashFormRef = React.useRef<HTMLDivElement | null>(null);

  const scrollToRef = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const [bankFormData, setBankFormData] = useState<BankDetail>({
    _id: "",
    bankName: "",
    branch: "",
    currentBalance: "",
    openingBalance: "",
    ifcsCode: "",
    address: "",
  });

  const { post } = useFetch();
  const [isLoading, setIsLoading] = useState(false);
  const [bankDetails, setbankDetails] = useState<BankDetail[]>([]);
  const [formType, setFormType] = useState("");
  const { onShowModal, onCloseModal } = useModal();

  useEffect(() => {
    getBankList();
    getBankandCashAmount();
  }, []);

  const onRefreshList = async (button: string) => {
    if (button == "save") {
      getBankList();
      getBankandCashAmount();
    }
    setIsFormOpen(false);
    setEditingIndex(null);
  };

  const getBankList = async () => {
    try {
      setIsLoading(true);
      const response = await post(GetBanks);
      const { errors, statusCode, data } = response.data;
      if (statusCode == eHTTPStatusCode.OK) {
        const options = data.map((apiData: any) => ({
          ...apiData,
          bankName: apiData.bank_name,
          currentBalance: apiData.current_balance,
          ifcsCode: apiData.ifsc_code,
        }));
        setbankDetails(options);
      } else {
        toast.error(errors[0].message, { autoClose: 3000, pauseOnHover: true });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getBankandCashAmount = async () => {
    try {
      setIsLoading(true);
      const response = await post(getCashBankAmount, {});
      const { statusCode, errors, data } = response.data;
      if (statusCode == eHTTPStatusCode.OK) {
        setCashAmount(data.cashAmount);
        setBankAmount(data.bankAmount);
      } else {
        toast.error(errors[0].message, { autoClose: 3000, pauseOnHover: true });
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = (id: string) => {
    onShowModal({
      content: (
        <div style={{ height: "100%", boxSizing: "border-box" }}>
          <DeleteModal
            onSave={() => { }}
            onCancel={() => { onCloseModal(); }}
            name={"Bank"}
          />
        </div>
      ),
      title: "Confirm Deletion",
      size: ModalSize.ImageUpload,
    });
  };

  const formatInr = (amt: string) => `₹${Number(amt || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

  if (isLoading && !bankDetails.length) {
    return <div className="flex justify-center p-12"><Loader size={"40px"} className="text-primary" /></div>;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      <motion.div variants={itemVariants} className="text-center md:text-left">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent inline-block">
          Bank & Cash Management
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your accounts and transfers</p>
      </motion.div>

      {/* Totals Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg"
        >
          <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-4 -translate-y-4">
            <Landmark size={100} />
          </div>
          <div className="relative z-10">
            <p className="text-indigo-50/80 text-sm font-medium uppercase tracking-wider">Total Bank Balance</p>
            <h2 className="text-4xl font-bold mt-2">{formatInr(bankAmount)}</h2>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg"
        >
          <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-4 -translate-y-4">
            <Wallet size={100} />
          </div>
          <div className="relative z-10">
            <p className="text-emerald-50/80 text-sm font-medium uppercase tracking-wider">Total Cash Balance</p>
            <div className="flex items-center justify-between">
              <h2 className="text-4xl font-bold mt-2">{formatInr(cashAmount)}</h2>
              <button
                onClick={() => {
                  setIsFormOpen(true);
                  setFormType("CASH");
                  setTimeout(() => scrollToRef(cashFormRef as any), 0);
                }}
                className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
              >
                <Edit3 size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Add Bank", type: "BANKFORM", icon: Plus, color: "bg-primary shadow-primary/20", ref: bankFormRef },
        ].map((btn) => (
          <button
            key={btn.type}
            onClick={() => {
              setIsFormOpen(true);
              setFormType(btn.type);
              setEditingIndex(null);
              setTimeout(() => scrollToRef(btn.ref as any), 0);
            }}
            className={`flex flex-col items-center justify-center gap-3 p-4 rounded-3xl text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-xl ${btn.color}`}
          >
            <div className="p-2 bg-white/20 rounded-xl">
              <btn.icon size={24} />
            </div>
            <span className="text-sm">{btn.label}</span>
          </button>
        ))}
      </motion.div>

      {/* Forms Section */}
      {isFormOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 rounded-3xl shadow-xl relative"
        >
          <button
            onClick={() => setIsFormOpen(false)}
            className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground"
          >
            ×
          </button>

          {formType === "BANKFORM" && <div ref={bankFormRef}><BankForm onRefreshList={onRefreshList} /></div>}
          {formType === "CASH" && <div ref={cashFormRef}><AddEditCashForm cash={cashAmount} onRefreshList={onRefreshList} /></div>}
        </motion.div>
      )}

      {/* Bank List */}
      <div className="space-y-4">
        <motion.h3 variants={itemVariants} className="text-lg font-bold flex items-center gap-2">
          <Landmark size={20} className="text-primary" /> My Bank Accounts
        </motion.h3>

        <div className="grid grid-cols-1 gap-4">
          {bankDetails.map((bank: any, index: number) => (
            <motion.div variants={itemVariants} key={bank._id}>
              {editingIndex === index ? (
                <div className="glass-card p-8 rounded-3xl">
                  <BankForm onRefreshList={onRefreshList} data={bankFormData} />
                </div>
              ) : (
                <BankDetailCard
                  data={bank}
                  onEdit={() => {
                    setBankFormData(bank);
                    setIsFormOpen(false);
                    setEditingIndex(index);
                  }}
                  onDelete={() => onDelete(bank._id)}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default BankPage;

