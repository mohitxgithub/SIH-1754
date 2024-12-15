"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import Cookies from "js-cookie";

export default function Fuel({ value }) {
  const [fuel, setFuel] = useState({
    Electric: [],
    Petrol: [],
    Diesel: [],
    CNG: [],
  });
  
  const [fuelTotals, setFuelTotals] = useState({
    Electric: 0,
    Petrol: 0,
    Diesel: 0,
    CNG: 0,
  });

  // Calculate fuel totals and group them by type
  useEffect(() => {
    const groupedFuel = value.reduce((acc, curr) => {
      const fuelType = curr.fuelType;
      if (acc[fuelType]) {
        acc[fuelType].push(curr);
      } else {
        acc[fuelType] = [curr];
      }
      return acc;
    }, {
      Electric: [],
      Petrol: [],
      Diesel: [],
      CNG: [],
    });
    
    setFuel(groupedFuel);

    const totals = Object.keys(groupedFuel).reduce((acc, fuelType) => {
      const totalQuantity = groupedFuel[fuelType].reduce((sum, item) => {
        const quantityValue = parseFloat(item.quantity);
        return sum + (isNaN(quantityValue) ? 0 : quantityValue);
      }, 0);
      acc[fuelType] = totalQuantity;
      return acc;
    }, {
      Electric: 0,
      Petrol: 0,
      Diesel: 0,
      CNG: 0,
    });

    setFuelTotals(totals);
    Cookies.set("fueldata", JSON.stringify(totals), { expires: 7 }); 
    console.log("total:",totals)
  }, [value]);

  // Prepare chart data based on fuelTotals
  const chartData = Object.keys(fuelTotals).map(fuelType => ({
    type: fuelType,
    total: fuelTotals[fuelType],
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Fuel Type Totals</CardTitle>
        <CardDescription>Total quantities of different fuel types</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}}>
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} horizontal={false} />
            <XAxis
              dataKey="type"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar
              dataKey="total"
              fill="var(--color-fuel)" // You can change this color dynamically based on the fuel type
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total fuel quantities
        </div>
      </CardFooter>
    </Card>
  );
}
