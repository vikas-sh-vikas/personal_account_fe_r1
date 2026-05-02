"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/useFetch";
import {
  getCashBankAmount,
  getRecentTransaction,
  getTransaction,
  getUserDashDetail,
} from "@/utils/api.constant";
import { eHTTPStatusCode, eResultCode } from "@/utils/enum";
import Loader from "@/components/ui/loader/loader";
import CompactTransactionCard from "@/components/ui/dashUi/transactionCard";
import { toast } from "react-toastify";
import { FaMoneyBillWave, FaUniversity } from "react-icons/fa";
import { endOfMonth, startOfMonth } from "date-fns";
import LineChart from "@/components/ui/chart/line-chart";
import { transformTransactionsByCategory } from "@/components/ui/chart/line-chart-helper";
import { transformTransactionsForDonut } from "@/components/ui/chart/donut-chart-helper";
import DonutChart from "@/components/ui/chart/donut-chart";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, PlusCircle, History } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

const DashBoardLayout = () => {
  // ... (previous state and logic remains the same)
  const [transactionType, setTransactionType] = useState<string>("cash");
  const [isLoading, setIsLoading] = useState(true);
  const [recentLoading, setRecentLoading] = useState(true);
  const [cashAmount, setCashAmount] = useState("");
  const [bankAmount, setBankAmount] = useState("");
  const [transactionList, setTrasactionList] = useState<Transaction[]>([]);
  const [toggleType, setToggleType] = useState("credit");
  const [bankOptions, setBankOptions] = useState<DropDownOptions[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<DropDownOptions[]>([]);
  const [transactionTypeOptions, setTransactionTypeOptions] = useState<
    DropDownOptions[]
  >([]);
  const [paymentTypeOptions, setPaymentTypeOptions] = useState<
    DropDownOptions[]
  >([]);
  const { get, post } = useFetch();
  const defaultValues: Transaction = {
    amount: "",
    description: "",
    category: "",
    paymentMethod: "",
    bank: "",
    date: new Date(),
    type: "",
  };

  const [formData, setFormData] = useState<Transaction>(defaultValues);
  useEffect(() => {
    const fetchData = async () => {
      await getUserDashDetailMethod();
      await getRecentTransactionMethod();
      await getBankandCashAmount();
      await getTransactionMethod();
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const getBankandCashAmount = async () => {
    try {
      setIsLoading(true);
      const payment = {};
      const response = await post(getCashBankAmount, payment);
      const { message, statusCode, errors, data } = response.data;
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

  const getUserDashDetailMethod = async () => {
    try {
      setIsLoading(true);
      const response = await post(getUserDashDetail);
      const { dataResponse, message, statusCode, errors, data } = response.data;
      if (statusCode == eHTTPStatusCode.OK) {
        const { banks, categories, transactionTypes, paymentTypes } = data;
        const bankOptions = banks.map((b: any) => ({ value: b._id, label: b.bank_name }));
        const categoryOptions = categories.map((c: any) => ({ value: c._id, label: c.name }));
        const transactionTypeOptions = transactionTypes.map((t: any) => ({ value: t._id, label: t.name }));
        const paymentTypeOptions = paymentTypes.map((p: any) => ({ value: p._id, label: p.name }));

        setBankOptions(bankOptions);
        setCategoryOptions(categoryOptions);
        setTransactionTypeOptions(transactionTypeOptions);
        setToggleType(transactionTypeOptions[0]?.label);
        setPaymentTypeOptions(paymentTypeOptions);
        setTransactionType(paymentTypeOptions[0]?.label);
      } else {
        toast.error(errors[0].message, { autoClose: 3000, pauseOnHover: true });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getRecentTransactionMethod = async () => {
    try {
      setRecentLoading(true);
      const payload = { data: { count: 5 } };
      const response = await post(getRecentTransaction, payload);
      const { errors, statusCode, data } = response.data;
      if (statusCode == eHTTPStatusCode.OK) {
        const list = data.map((apiData: any) => ({
          _id: apiData._id,
          type: apiData.transaction_type?.name,
          amount: apiData.amount,
          category: apiData.category?.name,
          paymentMethod: apiData.payment_type?.name,
          description: apiData.description,
          bank: apiData.bank?.bank_name,
          date: apiData.date,
        }));
        setTrasactionList(list);
      } else {
        toast.error(errors[0].message, { autoClose: 3000, pauseOnHover: true });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setRecentLoading(false);
    }
  };






  const [trasactionListReport, setTrasactionListReport] = useState<any[]>([]);

  const getTransactionMethod = async () => {
    try {
      setIsLoading(true);
      const fromDateUtc = new Date(Date.UTC(startOfMonth(new Date()).getFullYear(), startOfMonth(new Date()).getMonth(), startOfMonth(new Date()).getDate(), 0, 0, 0, 0));
      const toDateUtc = new Date(Date.UTC(endOfMonth(new Date()).getFullYear(), endOfMonth(new Date()).getMonth(), endOfMonth(new Date()).getDate(), 23, 59, 59, 999));
      const payload = { data: { fromDate: fromDateUtc, toDate: toDateUtc } };
      const response = await post(getTransaction, payload);
      const { errors, statusCode, data } = response.data;
      if (statusCode == eHTTPStatusCode.OK) {
        setTrasactionListReport(data);
      } else {
        toast.error(errors[0].message, { autoClose: 3000, pauseOnHover: true });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const router = useRouter();
  const formatInr = (amt: string) => `₹${Number(amt || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
  const { labels, datasets } = transformTransactionsByCategory(trasactionListReport);
  const { donutLabels, donutDatasets } = transformTransactionsForDonut(trasactionListReport);

  if (isLoading && !trasactionListReport.length) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size={"40px"} className="text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="glass-card p-6 rounded-3xl shadow-xl">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-primary" /> Weekly Overview
          </h3>
          <LineChart labels={labels} datasets={datasets} />
        </motion.div>
        <motion.div variants={itemVariants} className="glass-card p-6 rounded-3xl shadow-xl">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <PlusCircle size={20} className="text-primary" /> Expense Distribution
          </h3>
          <DonutChart labels={donutLabels} datasets={donutDatasets} />
        </motion.div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg"
        >
          <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-4 -translate-y-4">
            <PlusCircle size={100} />
          </div>
          <div className="relative z-10">
            <p className="text-indigo-50/80 text-sm font-medium uppercase tracking-wider">Total Balance</p>
            <h2 className="text-4xl font-bold mt-2">{formatInr((Number(bankAmount) + Number(cashAmount)).toString())}</h2>
            <div className="mt-6 flex items-center gap-2 text-indigo-50/90 text-sm">
              <TrendingUp size={16} /> <span>Combined Wealth</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg"
        >
          <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-4 -translate-y-4">
            <FaUniversity size={100} />
          </div>
          <div className="relative z-10">
            <p className="text-emerald-50/80 text-sm font-medium uppercase tracking-wider">Bank Balance</p>
            <h2 className="text-4xl font-bold mt-2">{formatInr(bankAmount)}</h2>
            <div className="mt-6 flex items-center gap-2 text-emerald-50/90 text-sm">
              <TrendingUp size={16} /> <span>Updated just now</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg"
        >
          <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-4 -translate-y-4">
            <FaMoneyBillWave size={100} />
          </div>
          <div className="relative z-10">
            <p className="text-blue-50/80 text-sm font-medium uppercase tracking-wider">Cash Balance</p>
            <h2 className="text-4xl font-bold mt-2">{formatInr(cashAmount)}</h2>
            <div className="mt-6 flex items-center gap-2 text-blue-50/90 text-sm">
              <TrendingUp size={16} /> <span>Updated just now</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Transactions List */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary">
              <History size={24} />
            </div>
            <h3 className="text-xl font-bold">Recent Activity</h3>
          </div>
          <button
            onClick={() => router.push('/dashboard/transactions')}
            className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
          >
            View all <TrendingUp size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {recentLoading ? (
            <div className="col-span-full flex justify-center p-12"><Loader size={"40px"} /></div>
          ) : (
            transactionList.length > 0 ? (
              transactionList.map((item) => (
                <CompactTransactionCard key={item._id} data={item} />
              ))
            ) : (
              <div className="col-span-full text-center p-12 glass-card rounded-3xl text-muted-foreground">
                No recent transactions found
              </div>
            )
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DashBoardLayout;

