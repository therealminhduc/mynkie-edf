import {Card, CardDescription, CardHeader, CardTitle, CardFooter} from "@/components/ui/card";
import {getYesterday} from "@/app/utils/dateUtil";
import {calculateCostPerDay, getSubscriptionPrice} from "@/app/utils/priceUtils";

export function ConsumptionSummary({ endDate, endDateConsumption }: { endDate: string | null; endDateConsumption: number }) {
    const endDateCost: number = endDateConsumption ? calculateCostPerDay(endDateConsumption) : 0;

    return (
        <Card className="flex-1">
            <CardHeader className="relative">
                <CardDescription> Yesterday's summary ({ getYesterday(endDate) }) </CardDescription>
                <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"> { endDateConsumption.toFixed(2) + " kWh" }  </CardTitle>
                <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums"> { endDateCost.toFixed(2) + " €" } </CardTitle>
            </CardHeader>

            <CardFooter className="flex-col items-start gap-1 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                    Usage: { (endDateCost - getSubscriptionPrice()).toFixed(2) + "€" }
                </div>

                <div className="text-muted-foreground">
                    Subscription: { getSubscriptionPrice() + '€' }
                </div>
            </CardFooter>   
        </Card>
        
    );
}