"use client"

import {Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis} from "recharts"
import {ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart"
import {useEffect, useState} from "react";
import {EnergyResponse} from "linky";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {calculateCostPerDay} from "@/app/utils/priceUtils";
import {ConsumptionSummary} from "@/app/components/charts/ConsumptionSummary";
import {ConsumptionBarChart} from "@/app/components/charts/ConsumptionBarChart";
import {ConsumptionAreaChart} from "@/app/components/charts/ConsumptionAreaChart";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";

const chartConfig = {
    conso: {
        label: "Conso",
        color: "hsl(var(--chart-1))",
    },
    cost: {
        label: "Cost",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

export default function ConsumptionGraph() {
    const [data, setData] = useState<{ date: string; conso: number }[]>([]);
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/linky");

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const jsonData: EnergyResponse = await response.json();

                // Extract start and end dates
                const usageData = jsonData;
                setStartDate(usageData.start);
                setEndDate(usageData.end);

                // Extract interval_reading and format it
                const readings = usageData.interval_reading ?? [];

                const formattedData = readings.map((entry) => {
                    const kWh = Number(entry.value) / 1000;
                    return {
                        date: entry.date,
                        conso: kWh,
                        cost: calculateCostPerDay(kWh),
                    };
                });

                setData(formattedData);
            } catch (e) {
                console.error(e);
            }
        }

        fetchData();
    }, []);

    const endDateConsumption: number = data.length > 0 ? data[data.length - 1].conso : 0;

    return (
        <Card>

            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                <div className="flex flex-col justify-center gap-1 px-6 py-5 sm:py-6 sm:w-4/5">
                    <CardTitle>Power usage - Linky</CardTitle>
                    <CardTitle>Periode: {startDate} - {endDate}</CardTitle>
                    <CardDescription>Displaying the last 30 days power usage</CardDescription>
                </div>

                <ConsumptionSummary endDate={endDate} endDateConsumption={endDateConsumption} />
            </CardHeader>

            <CardContent>
                <ConsumptionBarChart data={data}/>
                <ConsumptionAreaChart data={data}/>
            </CardContent>
        </Card>
    )
}