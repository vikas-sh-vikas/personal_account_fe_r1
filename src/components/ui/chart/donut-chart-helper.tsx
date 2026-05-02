interface Transaction {
  _id: string;
  amount: string;
  category: { _id: string; name: string };
  date: string;
}
export function transformTransactionsForDonut(transactions: Transaction[]) {
  const categoryTotals: Record<string, number> = {};

  transactions.forEach((t) => {
    const amount = parseFloat(t.amount);
    categoryTotals[t.category.name] =
      (categoryTotals[t.category.name] || 0) + amount;
  });

  const donutLabels = Object.keys(categoryTotals);
  const data = Object.values(categoryTotals);

  // Generate colors for each category
  const backgroundColors = donutLabels.map(() => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.6)`;
  });

  return {
    donutLabels,
    donutDatasets: [
      {
        data,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors.map((c) => c.replace("0.6", "1")),
        borderWidth: 1,
      },
    ],
  };
}
