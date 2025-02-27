import {CardTitle} from "@/components/ui/card";
import {getYesterday} from "@/app/utils/dateUtil";
import {calculateCostPerDay, getSubscriptionPrice} from "@/app/utils/priceUtils";

export function ConsumptionSummary({ endDate, endDateConsumption }: { endDate: string | null; endDateConsumption: number }) {
    const endDateCost: number = endDateConsumption ? calculateCostPerDay(endDateConsumption) : 0;

    return (
        <div className="flex flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6 sm:w-1/5">
            <CardTitle className="text-xs sm:text-sm text-muted-foreground">Yesterday&apos;s
                consumption</CardTitle>
            <CardTitle className="text-xs sm:text-sm text-muted-foreground">{getYesterday(endDate)}</CardTitle>

            <div className="text-lg font-bold leading-none sm:text-2xl">
                <p>{endDateConsumption.toFixed(2)} kWh</p>
                <p>{endDateCost.toFixed(2)} €</p>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground">Usage: {(endDateCost - getSubscriptionPrice()).toFixed(2) + '€'}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Subscription: {getSubscriptionPrice() + '€'}</p>
        </div>
    );
}