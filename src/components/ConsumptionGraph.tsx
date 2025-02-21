"use client"

import { Bar, BarChart } from "recharts"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import {useEffect, useState} from "react";
import {EnergyResponse} from "linky";

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "#2563eb",
    },
    mobile: {
        label: "Mobile",
        color: "#60a5fa",
    },
} satisfies ChartConfig

const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
]

export default function ConsumptionGraph() {
    const [data, setData] = useState<EnergyResponse | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/linky");
                const data = await response.json();
                setData(data);
                console.log(data);
            } catch (e) {
                console.error(e);
            }
        }

        fetchData();
    }, []);
    return (
        <div>
            <h1>Energy Consumption</h1>
            <p>{ JSON.stringify(data) }</p>

            <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <BarChart accessibilityLayer data={chartData}>
                    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                    <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                </BarChart>
            </ChartContainer>
        </div>
    )
}