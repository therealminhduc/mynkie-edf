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
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

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

    const [chartType, setChartType] = useState<"bar" | "area">("bar");
    const [isDesktop, setIsDesktop] = useState<boolean>(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 768px)");
        setIsDesktop(mediaQuery.matches);
        setChartType(mediaQuery.matches ? "bar" : "area");

        const handler = () => {
            const matches = mediaQuery.matches;
            setIsDesktop(matches);
            if (!matches && chartType === 'bar') {setChartType("area");}
            if (!matches && chartType === 'area') {setChartType("bar");}
        }

        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

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

                <ConsumptionSummary endDate={endDate} endDateConsumption={endDateConsumption}/>
            </CardHeader>

            {/*<div className="flex items-center justify-end px-6 py-5 sm:py-6 sm:w-1/5">*/}
                <Select
                    value={chartType}
                    onValueChange={(value: 'bar' | 'area') => setChartType(value)}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Type"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="bar">Bar chart</SelectItem>
                        <SelectItem value="area">Area chart</SelectItem>
                    </SelectContent>
                </Select>
            {/*</div>*/}

            <CardContent>
                <div className="mb-4">
                    {chartType === 'bar' ? (
                        <ConsumptionBarChart data={data}/>
                    ) : (
                        <ConsumptionAreaChart data={data}/>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}