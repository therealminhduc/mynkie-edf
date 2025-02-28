import {ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart"
import {chartConfig} from '@/app/components/config/chartConfig';
import {Bar, BarChart, XAxis} from "recharts";
import {useEffect, useState} from "react";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription, DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";

export function ConsumptionBarChart({ data }: { data: any[] }) {

    const ITEMS_PER_PAGE = 7;

    const totalPages = Math.max(1, Math.ceil(data.length / ITEMS_PER_PAGE));
    const [page, setPage] = useState(-1);

    useEffect(() => {
        setPage(Math.min(totalPages - 1, Math.max(0, page)));
    }, [totalPages]);

    const startIndex = Math.max(0, data.length - (page + 1) * ITEMS_PER_PAGE);
    const endIndex = data.length - page * ITEMS_PER_PAGE;
    const paginatedData = data.slice(startIndex, endIndex);

    const nextPage = () => setPage(prev => Math.max(0, prev - 1));
    const prevPage = () => setPage(prev => Math.min(totalPages - 1, prev + 1));

    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [selectedData, setSelectedData] =
        useState<{date: string, conso: number, cost: number} | null>(null);


    const onBarClick = (data: any) => {
        console.log("Clicked bar data:", data);
        setSelectedData(data);
        setDrawerOpen(true);
    };

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
                        onClick={onBarClick}
                    />

                    <Bar
                        dataKey="conso"
                        stackId="a"
                        fill="var(--color-conso)"
                        radius={[4, 4, 0, 0]}
                        onClick={onBarClick}
                    />

                    {/*<ChartTooltip*/}
                    {/*    content={<ChartTooltipContent/>}*/}
                    {/*    cursor={false}*/}
                    {/*    defaultIndex={1}*/}
                    {/*/>*/}
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

            <Drawer open={isDrawerOpen} onOpenChange={setDrawerOpen}>
                <DrawerContent>
                    <div className="mx-auto w-full max-w-sm">
                        <DrawerHeader>
                            <DrawerTitle>Daily Consumption Details</DrawerTitle>
                            <DrawerDescription> Details for {selectedData?.date} </DrawerDescription>
                        </DrawerHeader>

                        {selectedData && (
                            <div className="p-4 pb-0">
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span>Consumption:</span>
                                        <span className="font-semibold">
                                            {selectedData.conso.toFixed(2)} kWh
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Cost:</span>
                                        <span className="font-semibold">
                                            {selectedData.cost.toFixed(2)} €
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <DrawerFooter>
                            <DrawerClose asChild>
                                <Button variant="outline">Close</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
}