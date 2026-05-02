"use client";
import { motion } from "framer-motion";
import { Edit2, MapPin, Landmark, CreditCard, Hash } from "lucide-react";

interface BankDetail {
  _id?: string;
  bankName: string;
  branch?: string;
  currentBalance: string;
  openingBalance?: string;
  ifcsCode: string;
  address?: string;
}

interface BankCardProps {
  data: BankDetail;
  onEdit: () => void;
  onDelete: () => void;
}

const BankDetailCard = ({ data, onEdit, onDelete }: BankCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6 rounded-3xl mb-4 border border-white/5 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <Landmark size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold">{data.bankName}</h3>
            {data.branch && (
              <p className="text-xs text-muted-foreground">{data.branch} Branch</p>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-primary">
            ₹{Number(data.currentBalance).toLocaleString("en-IN")}
          </p>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Current Balance</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-muted/30 p-3 rounded-2xl">
          <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1 flex items-center gap-1">
            <Hash size={10} /> IFSC Code
          </p>
          <p className="text-sm font-semibold">{data.ifcsCode}</p>
        </div>
        {data.address && (
          <div className="bg-muted/30 p-3 rounded-2xl col-span-2">
            <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1 flex items-center gap-1">
              <MapPin size={10} /> Location
            </p>
            <p className="text-sm text-muted-foreground truncate">{data.address}</p>
          </div>
        )}
      </div>

      <div className="flex justify-end pt-4 border-t border-white/5">
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-primary rounded-2xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          <Edit2 size={16} /> Edit Details
        </button>
      </div>
    </motion.div>
  );
};

export default BankDetailCard;

