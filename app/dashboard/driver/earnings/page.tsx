"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface EarningRecord {
  id: string;
  date: string;
  rides: number;
  amount: number;
  status: "completed" | "pending";
}

export default function EarningsPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const [earnings, setEarnings] = useState<EarningRecord[]>([]);

 
  useEffect(() => {
    const mockEarnings: EarningRecord[] = [
      {
        id: "1",
        date: "2025-04-30",
        rides: 8,
        amount: 245.50,
        status: "completed",
      },
      {
        id: "2",
        date: "2025-04-29",
        rides: 6,
        amount: 180.75,
        status: "completed",
      },
    
    ];
    setEarnings(mockEarnings);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Earnings Dashboard</h1>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Today&apos;s Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">${earnings[0]?.amount || "0.00"}</p>
                <p className="text-sm text-muted-foreground">
                  {earnings[0]?.rides || 0} rides completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  ${earnings.reduce((sum, record) => sum + record.amount, 0).toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {earnings.reduce((sum, record) => sum + record.rides, 0)} total rides
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Date Range</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="range"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Earnings History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Rides</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {earnings.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{format(new Date(record.date), "PPP")}</TableCell>
                      <TableCell>{record.rides}</TableCell>
                      <TableCell>${record.amount.toFixed(2)}</TableCell>
                      <TableCell className="capitalize">{record.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}