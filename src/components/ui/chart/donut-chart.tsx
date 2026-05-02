"use client";

import React from "react";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Title, Tooltip, Legend);

interface DonutChartProps {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
}

const DonutChart: React.FC<DonutChartProps> = ({ labels, datasets }) => {
  const donutChartData = { labels, datasets };

  const donutChartOptions = {
    responsive: true,
    maintainAspectRatio: false, // 🔑 allow full width
    plugins: {
      legend: { position: "bottom" as const },
      title: { display: true, text: "Category Distribution" },
    },
  };

  return (
    <div className="w-full h-[250px]"> {/* Full width, fixed height */}
      <Doughnut data={donutChartData} options={donutChartOptions} />
    </div>
  );
};

export default DonutChart;
