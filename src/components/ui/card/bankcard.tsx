// components/BankCard.tsx
import React from "react";

type BankDetails = {
  _id: string;
  bankName: string;
  branch: string;
  currentBalance: string;
  openingBalance: string;
  ifcsCode: string;
  address: string;
};

const BankCard = (props: { bank: BankDetails }) => {
  // {bank} = props;
  const { bank } = props;
  return (
    <div
      //   key={key}
      className=" mx-auto bg-white shadow-md rounded-2xl p-6 border border-gray-200 space-y-4"
    >
      <div className="flex justify-between">
        <h2 className="text-xl font-bold text-blue-800">{bank.bankName}</h2>
        <h2 className="text-xl font-bold text-blue-800">
          ₹
          {parseFloat(bank.currentBalance).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </h2>
      </div>
      <div className="text-sm text-gray-600">
        <p>
          <span className="font-semibold">Branch:</span> {bank.branch}
        </p>
        <p>
          <span className="font-semibold">Address:</span> {bank.address}
        </p>
        <p>
          <span className="font-semibold">IFSC Code:</span> {bank.ifcsCode}
        </p>
      </div>
      <div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded m-2"
          //   onClick={() => setIsFormOpen(true)}
        >
          Edit
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded m-2"
          //   onClick={() => setIsFormOpen(true)}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default BankCard;
