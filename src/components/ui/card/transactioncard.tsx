// components/TransactionCard.tsx
import React from "react";

const TransactionCard = (props:{transaction: Transaction}) => {
    const {transaction} = props;
  const formattedAmount = Number(transaction.amount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedDate = new Date(transaction.date).toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-200 space-y-2">
      <div className="flex justify-between items-center">
        <span
          className={`text-sm font-semibold ${
            transaction.type === "income" ? "text-green-600" : "text-red-600"
          }`}
        >
          {transaction?.type.toUpperCase()}
        </span>
        <span className="text-sm text-gray-500">{formattedDate}</span>
      </div>

      <h2 className="text-xl font-bold text-gray-800">₹{formattedAmount}</h2>

      <div className="text-sm text-gray-700">
        <p>
          <span className="font-medium">Category:</span> {transaction?.category}
        </p>
        <p>
          <span className="font-medium">Payment Method:</span>{" "}
          {transaction?.paymentMethod}
        </p>
        {transaction.bank && (
          <p>
            <span className="font-medium">Bank:</span> {transaction?.bank}
          </p>
        )}
        {transaction?.description && (
          <p>
            <span className="font-medium">Description:</span>{" "}
            {transaction.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default TransactionCard;
