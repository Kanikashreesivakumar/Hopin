"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, isToday, isThisWeek, isThisMonth } from "date-fns";

interface EarningRecord {
  id: string;
  date: string;
  rides: number;
  amount: number;
  tips: number;
  distance: number;
  duration: string;
  peakBonus: number;
  status: "completed" | "pending";
}

export default function EarningsPage() {
  const [earnings, setEarnings] = useState<EarningRecord[]>([]);

  useEffect(() => {
    const mockEarnings: EarningRecord[] = [
      {
        id: "1",
        date: "2025-05-01", // Today
        rides: 8,
        amount: 2455.50,
        tips: 150,
        distance: 45.2,
        duration: "5h 30m",
        peakBonus: 200,
        status: "completed",
      },
      {
        id: "2",
        date: "2025-04-30", // This week
        rides: 6,
        amount: 1807.75,
        tips: 100,
        distance: 32.5,
        duration: "4h 15m",
        peakBonus: 150,
        status: "completed",
      },
      {
        id: "3",
        date: "2025-04-15", // This month
        rides: 7,
        amount: 2100.00,
        tips: 120,
        distance: 40.0,
        duration: "5h 00m",
        peakBonus: 180,
        status: "completed",
      },
    ];
    setEarnings(mockEarnings);
  }, []);

  const todayEarnings = earnings
    .filter(record => isToday(new Date(record.date)))
    .reduce((sum, record) => sum + record.amount, 0);

  const weeklyEarnings = earnings
    .filter(record => isThisWeek(new Date(record.date)))
    .reduce((sum, record) => sum + record.amount, 0);

  const monthlyEarnings = earnings
    .filter(record => isThisMonth(new Date(record.date)))
    .reduce((sum, record) => sum + record.amount, 0);

  return (
    <div className="p-6 space-y-6 bg-orange-50">
      <h1 className="text-3xl font-bold text-orange-800">Earnings Overview</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-orange-200">
          <h2 className="text-orange-800 font-semibold">Today</h2>
          <p className="text-2xl font-bold text-orange-600">₹{todayEarnings.toFixed(2)}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-orange-200">
          <h2 className="text-orange-800 font-semibold">This Week</h2>
          <p className="text-2xl font-bold text-orange-600">₹{weeklyEarnings.toFixed(2)}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-orange-200">
          <h2 className="text-orange-800 font-semibold">This Month</h2>
          <p className="text-2xl font-bold text-orange-600">₹{monthlyEarnings.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-orange-200">
        <div className="p-4 bg-orange-100">
          <h2 className="text-lg font-semibold text-orange-800">Earnings History</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-orange-50">
              <TableHead className="text-orange-800">Date</TableHead>
              <TableHead className="text-orange-800">Rides</TableHead>
              <TableHead className="text-orange-800">Duration</TableHead>
              <TableHead className="text-orange-800">Distance</TableHead>
              <TableHead className="text-orange-800">Base Fare</TableHead>
              <TableHead className="text-orange-800">Peak Bonus</TableHead>
              <TableHead className="text-orange-800">Tips</TableHead>
              <TableHead className="text-orange-800">Total</TableHead>
              <TableHead className="text-orange-800">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {earnings.map((record) => (
              <TableRow key={record.id} className="hover:bg-orange-50">
                <TableCell>{format(new Date(record.date), "PPP")}</TableCell>
                <TableCell>{record.rides}</TableCell>
                <TableCell>{record.duration}</TableCell>
                <TableCell>{record.distance} km</TableCell>
                <TableCell>₹{(record.amount - record.tips - record.peakBonus).toFixed(2)}</TableCell>
                <TableCell>₹{record.peakBonus.toFixed(2)}</TableCell>
                <TableCell>₹{record.tips.toFixed(2)}</TableCell>
                <TableCell className="text-orange-600 font-medium">₹{record.amount.toFixed(2)}</TableCell>
                <TableCell className="capitalize">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    record.status === "completed" 
                      ? "bg-orange-100 text-orange-800" 
                      : "bg-orange-200 text-orange-900"
                  }`}>
                    {record.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}