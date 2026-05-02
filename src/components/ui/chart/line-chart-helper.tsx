import { format, parseISO } from "date-fns";

interface Transaction {
  _id: string;
  amount: string;
  category: { _id: string; name: string };
  date: string;
}

export function transformTransactionsByCategory(transactions: Transaction[]) {
  // Collect all unique dates
  const datesSet = new Set<string>();
  // Category → Date → Total
  const categoryTotals: Record<string, Record<string, number>> = {};

  transactions.forEach((t) => {
    const dateKey = format(parseISO(t.date), "yyyy-MM-dd");
    const amount = parseFloat(t.amount);
    datesSet.add(dateKey);

    if (!categoryTotals[t.category.name]) {
      categoryTotals[t.category.name] = {};
    }
    categoryTotals[t.category.name][dateKey] =
      (categoryTotals[t.category.name][dateKey] || 0) + amount;
  });

  // Sort all dates
  const labels = Array.from(datesSet).sort();

// Utility to generate a random color in rgba
function getRandomColor(alpha = 1) {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Keep track of used colors so no repeats
function getUniqueColor(usedColors: Set<string>, alpha = 1) {
  let color;
  do {
    color = getRandomColor(alpha);
  } while (usedColors.has(color));
  usedColors.add(color);
  return color;
}

const usedColors = new Set<string>();

const datasets = Object.keys(categoryTotals).map((category) => {
  const borderColor = getUniqueColor(usedColors, 1);
  const backgroundColor = borderColor.replace("1)", "0.2)");

  return {
    label: category,
    data: labels.map((date) => categoryTotals[category][date] || 0),
    borderColor,
    backgroundColor,
    tension: 0.3,
    fill: false,
  };
});


  return { labels, datasets };
}
