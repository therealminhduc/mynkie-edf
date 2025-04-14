import {Card, CardDescription, CardHeader, CardTitle, CardFooter} from "@/components/ui/card";
import { ConsumptionSummary } from "./charts/ConsumptionSummary";

export default function SectionCards({ startDate, endDate, endDateConsumption }: { startDate: string | null; endDate: string | null; endDateConsumption: number }) {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:gap-6">
            <Card className="flex-1">
                <CardHeader className="relative">
                    <CardDescription>My power usage</CardDescription>
                    <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"> Last 30 days </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Data retrieved from Enedis
                    </div>

                    <div className="text-muted-foreground">
                        Using Conso API
                    </div>
                </CardFooter>
            </Card>

            <Card className="flex-1">
                <CardHeader className="relative">
                    <CardDescription>Start Date</CardDescription>               
                    <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"> {startDate} </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        The start date of the period
                    </div>
                </CardFooter>
            </Card>

            <Card className="flex-1">
                <CardHeader className="relative">
                    <CardDescription>End Date</CardDescription>
                    <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"> {endDate} </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        The end date of the period
                    </div>
                </CardFooter>
            </Card>

            <ConsumptionSummary 
                endDate={endDate}
                endDateConsumption={endDateConsumption}
            />
        </div>
    )
}