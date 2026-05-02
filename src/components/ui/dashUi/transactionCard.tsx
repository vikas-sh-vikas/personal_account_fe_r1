"use client";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownLeft, Tag, Calendar, Wallet, Landmark, Info } from "lucide-react";

interface TransactionCardProps {
  data: {
    _id?: string;
    type: string;
    amount: string;
    category: string;
    paymentMethod: string;
    description?: string;
    bank?: string;
    date: any;
  };
}

const CompactTransactionCard = ({ data }: TransactionCardProps) => {
  const formattedDate = new Date(data.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const isCredit = data.type === "Credit";

  return (
    <motion.div
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-card p-4 rounded-2xl flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all duration-300 border border-white/5"
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${
          isCredit ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
        }`}>
          {isCredit ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
        </div>
        
        <div className="min-w-0">
          <h4 className="font-bold text-foreground text-sm truncate">{data.category}</h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Calendar size={12} /> {formattedDate}
            </span>
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              {data.paymentMethod === "Bank" ? <Landmark size={12} /> : <Wallet size={12} />}
              {data.paymentMethod === "Bank" ? data.bank : "Cash"}
            </span>
          </div>
          {data.description && (
            <p className="text-[11px] text-muted-foreground/70 mt-1 truncate max-w-[150px]">
              {data.description}
            </p>
          )}
        </div>
      </div>

      <div className="text-right">
        <p className={`text-lg font-bold ${isCredit ? 'text-emerald-500' : 'text-rose-500'}`}>
          {isCredit ? '+' : '-'} ₹{Number(data.amount).toLocaleString("en-IN")}
        </p>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
          isCredit ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
        }`}>
          {data.type}
        </span>
      </div>
    </motion.div>
  );
};

export default CompactTransactionCard;
