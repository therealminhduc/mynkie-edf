"use client"

import {Area, AreaChart, CartesianGrid, XAxis} from "recharts"
import {ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart"
import {useEffect, useState} from "react";
import {EnergyResponse} from "linky";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {calculateCostPerDay} from "@/app/utils/priceUtils";

const chartConfig = {
    conso: {
        label: "Conso",
        color: "hsl(var(--chart-2))",
    },
    cost: {
        label: "Cost",
        color: "hsl(var(--chart-3))",
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
                    <CardTitle>POWER USAGE - Linky</CardTitle>
                    <CardTitle>Periode: {startDate} - {endDate}</CardTitle>
                    <CardDescription>Showing the last 30 days power usage</CardDescription>
                </div>
                <div
                    className="flex flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6 sm:w-1/5">
                    <CardTitle className="text-xs sm:text-sm text-muted-foreground">Yesterday&apos;s consumption</CardTitle>
                    <CardTitle className="text-xs sm:text-sm text-muted-foreground">{endDate}</CardTitle>

                    <div className="text-lg font-bold leading-none sm:text-2xl">
                        <p>{endDateConsumption.toFixed(2)} kWh</p>
                        <p>{calculateCostPerDay(endDateConsumption).toFixed(2)} €</p>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <ChartContainer config={chartConfig} className="w-full sm:h-[350px] md:h-[400px] lg:h-[500px]">
                    <AreaChart
                        data={data}
                        margin={{
                            left: 25,
                            right: 25,
                        }}
                    >
                        <CartesianGrid vertical={false}/>

                        <XAxis
                            dataKey="date"
                            tickLine={true}
                            axisLine={false}
                            tickMargin={10}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />

                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[150px]"
                                    nameKey="date"
                                    labelFormatter={(value) => {
                                        const date = new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        });
                                        return date;
                                    }}
                                />
                            }
                        />

                        <Area
                            dataKey="conso"
                            type="monotone"
                            fill="hsl(var(--chart-5))"
                            fillOpacity={0.4}
                            stroke="hsl(var(--chart-1))"
                        />
                        <Area
                            dataKey="cost"
                            type="monotone"
                            fill="hsl(var(--chart-3))"
                            fillOpacity={0.3}
                            stroke="hsl(var(--chart-3))"
                            strokeWidth={2}
                        />

                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}