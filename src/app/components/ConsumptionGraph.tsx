"use client"

import {ChartConfig} from "@/components/ui/chart"
import {useEffect, useState} from "react";
import {EnergyResponse} from "linky";
import {Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter} from "@/components/ui/card";
import {calculateCostPerDay} from "@/app/utils/priceUtils";
import {ConsumptionBarChart} from "@/app/components/charts/ConsumptionBarChart";
import {ConsumptionAreaChart} from "@/app/components/charts/ConsumptionAreaChart";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import SectionCards from "./SectionCards";

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

        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <div className="px-4 lg:px-6">
                        <SectionCards 
                            startDate = {startDate}
                            endDate = {endDate}
                            endDateConsumption={endDateConsumption}
                        />
                    </div>

                    <div className="px-4 lg:px-6">
                        <Card>
                            <div className="flex justify-end px-6 py-4">
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
                            </div>

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
                    </div>
                </div>
            </div>
        </div>
    )
}