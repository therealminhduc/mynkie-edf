import {Area, AreaChart, CartesianGrid, XAxis} from "recharts";
import {chartConfig} from '@/app/components/config/chartConfig';
import {ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart";

export function ConsumptionAreaChart({ data }: { data: any[] }) {
    return (
        <ChartContainer config={ chartConfig } className="w-full sm:h-[35   0px] md:h-[400px] lg:h-[500px]">
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
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
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

                <defs>
                    <linearGradient id="fillConso" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-conso)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="var(--color-conso)" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="fillCost" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-cost)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="var(--color-cost)" stopOpacity={0.1}/>
                    </linearGradient>
                </defs>

                <Area
                    dataKey="conso"
                    type="natural"
                    fill="url(#fillConso)"
                    fillOpacity={0.4}
                    stroke="var(--color-conso)"
                />
                <Area
                    dataKey="cost"
                    type="natural"
                    fill="url(#fillCost)"
                    fillOpacity={0.4}
                    stroke="var(--color-cost)"
                />

            </AreaChart>
        </ChartContainer>
    );
}