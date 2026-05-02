"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension?: number;
    fill?: boolean;
  }[];
}

const LineChart: React.FC<LineChartProps> = ({ labels, datasets }) => {
  const lineChartData = { labels, datasets };

  const lineChartOptions = {
    responsive: true,
        maintainAspectRatio: false, // 🔑 ensures chart has room for axes
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Transactions by Category" },
    },
    scales: {
  x: {
    ticks: {
      callback: function (value: any, index: number, ticks: any) {
        const date = labels[index]; // original label
        return date ? new Date(date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short" // e.g., 24 Sep
        }) : "";
      },
    },
  },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Amount",
        },
        ticks: {
          stepSize: 10, // adjust if your values are big
        },
      },
    },
  };

  return <div className="h-[250px] m-auto">
    <Line data={lineChartData} options={lineChartOptions} />;
    </div>
};

export default LineChart;
