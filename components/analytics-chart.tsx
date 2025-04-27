"use client"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const analyticsData = {
  users: [820, 932, 901, 934, 1290, 1330, 1320, 1450, 1500, 1600, 1700, 1800],
  rides: [320, 332, 301, 334, 390, 330, 320, 450, 500, 600, 700, 800],
  events: [150, 232, 201, 234, 290, 330, 320, 450, 500, 600, 700, 800],
  revenue: [500, 532, 501, 534, 590, 630, 620, 750, 800, 900, 1000, 1100],
};

export default function AnalyticsChart() {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  const data = {
    labels: months,
    datasets: [
      {
        label: 'Users',
        data: analyticsData.users,
        borderColor: '#FF7A00',
        backgroundColor: 'rgba(255, 122, 0, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Rides',
        data: analyticsData.rides,
        borderColor: '#0EA5E9',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Events',
        data: analyticsData.events,
        borderColor: '#22C55E',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Revenue',
        data: analyticsData.revenue,
        borderColor: '#A855F7',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="w-full h-full">
      <Line options={options} data={data} />
    </div>
  );
}