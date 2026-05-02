"use client";
import { motion } from "framer-motion";
import { Edit2, Trash2, Calendar, Wallet, Landmark, ArrowUpRight, ArrowDownLeft } from "lucide-react";

interface TransactionCardProps {
  data: TransactionReport;
  onEdit: () => void;
  onDelete: () => void;
}

const ReportTransactionCard = ({
  data,
  onEdit,
  onDelete,
}: TransactionCardProps) => {
  const formattedDate = new Date(data.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const isCredit = data.typeName === "Credit";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5 rounded-2xl mb-4 border border-white/5 shadow-sm hover:shadow-md transition-all group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4 items-center">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isCredit ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
            }`}>
            {isCredit ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
          </div>
          <div>
            <h4 className="font-bold text-base">{data.categoryName}</h4>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar size={14} /> {formattedDate}</span>
              <span className="flex items-center gap-1">
                {data.paymentMethodName === "Bank" ? <Landmark size={14} /> : <Wallet size={14} />}
                {data.paymentMethodName === "Bank" ? data.bankName : "Cash"}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-lg font-bold ${isCredit ? 'text-emerald-500' : 'text-rose-500'}`}>
            {isCredit ? '+' : '-'} ₹{Number(data.amount).toLocaleString("en-IN")}
          </p>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${isCredit ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
            }`}>
            {data.typeName}
          </span>
        </div>
      </div>

      {data.description && (
        <div className="bg-muted/30 p-3 rounded-xl mb-4 text-xs text-muted-foreground italic">
          "{data.description}"
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4 border-t border-white/5">
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-primary bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors"
        >
          <Edit2 size={14} /> Edit
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-500 bg-rose-500/10 rounded-xl hover:bg-rose-500/20 transition-colors"
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </motion.div>
  );
};

export default ReportTransactionCard;

