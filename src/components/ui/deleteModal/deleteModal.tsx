import React from "react";
import { Button } from "../button/button";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { motion } from "framer-motion";

type DeleteModalProp = {
  onSave: () => void;
  onCancel: () => void;
  name: string;
};

function DeleteModal(props: DeleteModalProp) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-8 rounded-3xl shadow-2xl max-w-sm mx-auto border border-white/10"
    >
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mb-6">
          <AlertTriangle size={32} />
        </div>
        
        <h3 className="text-xl font-bold mb-2">Delete {props.name}</h3>
        <p className="text-muted-foreground text-sm mb-8">
          Are you sure you want to delete this {props.name.toLowerCase()}? This action cannot be undone.
        </p>

        <div className="flex flex-col w-full gap-3">
          <button
            onClick={props.onSave}
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-rose-500 text-white font-bold rounded-2xl hover:bg-rose-600 shadow-lg shadow-rose-500/20 transition-all active:scale-95"
          >
            <Trash2 size={18} />
            Delete Permanently
          </button>
          
          <button
            onClick={props.onCancel}
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-muted text-muted-foreground font-bold rounded-2xl hover:bg-muted/80 transition-all active:scale-95"
          >
            <X size={18} />
            Keep it
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default DeleteModal;
