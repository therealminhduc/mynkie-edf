import {ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart"
import {chartConfig} from '@/app/components/config/chartConfig';
import {Bar, BarChart, XAxis} from "recharts";
import {useCallback, useEffect, useRef, useState} from "react";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {Button} from "@/components/ui/button";

export function ConsumptionBarChart({ data }: { data: any[] }) {

    const ITEMS_PER_PAGE = 7;

    const totalPages = Math.max(1, Math.ceil(data.length / ITEMS_PER_PAGE));
    console.log("totalPages: " + totalPages);

    const [page, setPage] = useState(-1);

    useEffect(() => {
        setPage(Math.min(totalPages - 1, Math.max(0, page)));
    }, [totalPages]);

    console.log("page: " + page);

    const startIndex = Math.max(0, data.length - (page + 1) * ITEMS_PER_PAGE);
    const endIndex = data.length - page * ITEMS_PER_PAGE;
    const paginatedData = data.slice(startIndex, endIndex);

    const nextPage = () => setPage(prev => Math.max(0, prev - 1));
    const prevPage = () => setPage(prev => Math.min(totalPages - 1, prev + 1));

    return (
        <div className="flex flex-col items-center">
            <ChartContainer config={chartConfig} className="w-full sm:h-[350px] md:h-[400px] lg:h-[500px]">
                <BarChart
                    className="w-[min(100%,_calc(50px_*_data.length))]"
                    width={Math.max(7 * 50, paginatedData.length * 50)}
                    accessibilityLayer
                    data={paginatedData}
                >
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

                    <Bar
                        dataKey="cost"
                        stackId="a"
                        fill="var(--color-cost)"
                        radius={[0, 0, 4, 4]}
                    />

                    <Bar
                        dataKey="conso"
                        stackId="a"
                        fill="var(--color-conso)"
                        radius={[4, 4, 0, 0]}
                    />

                    <ChartTooltip
                        content={<ChartTooltipContent/>}
                        cursor={false}
                        defaultIndex={1}
                    />
                </BarChart>
            </ChartContainer>

            <div className="mt-6 flex justify-center items-center gap-6">

                <Button
                    variant="outline"
                    size="icon"
                    onClick={prevPage}
                    disabled={page === totalPages - 1}
                    className="disabled:bg-gray-300"
                >
                    <ChevronLeft/>
                </Button>

                <span className="text-lg text-gray-700">Page {totalPages - page}</span>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={nextPage}
                    disabled={page === 0}
                    className="disabled:bg-gray-300"
                >
                    <ChevronRight/>
                </Button>
            </div>
        </div>
    )
        ;
}