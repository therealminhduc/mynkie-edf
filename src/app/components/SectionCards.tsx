import {Card, CardDescription, CardHeader, CardTitle, CardFooter, CardContent} from "@/components/ui/card";
import { ConsumptionSummary } from "./charts/ConsumptionSummary";
import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export default function SectionCards({ startDate, endDate, endDateConsumption }: { startDate: string | null; endDate: string | null; endDateConsumption: number }) {
    const [sectionType, setSectionType] = useState<"row" | "carousel">("row");

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 768px)");
        
        const updateSectionType = () => {
            setSectionType(mediaQuery.matches ? "carousel" : "row");
        };
      
          // Set initial state
        updateSectionType();

        // Add event listener for screen size changes
        mediaQuery.addEventListener("change", updateSectionType);
        
        return () => mediaQuery.removeEventListener('change', updateSectionType);
    }, []);

    const cards = [
        { title: "My power usage", description: "Data retrieved from Enedis", content: "Last 30 days" },
        { title: "Start Date", description: "The start date of the period", content: startDate },
        { title: "End Date", description: "The end date of the period", content: endDate },
    ]

    return (
        <div>
            {sectionType === "row" ? (
                <div className="flex flex-col gap-4 md:flex-row md:gap-6">
                    {cards.map((card, index) => (
                        <div key={index} className="flex-1 flex">
                            {renderCard(card.title, card.description, card.content)}
                        </div>
                    ))}

                    <div className="flex-1 flex">
                        <ConsumptionSummary endDate={endDate} endDateConsumption={endDateConsumption} />
                    </div>       
                </div>
            ) : (
                <Carousel opts={{ align: "start" }} className="w-full">
                    <CarouselContent className="flex">
                        {cards.map((card, index) => (
                        <CarouselItem key={index} className="flex-[0_0_100%] px-4">
                            { renderCard(card.title, card.description, card.content) }
                        </CarouselItem>
                        ))}
                        <CarouselItem key="consumption-summary">
                            <ConsumptionSummary endDate={endDate} endDateConsumption={endDateConsumption} />
                        </CarouselItem>
                    </CarouselContent>

                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            )}
        </div>
        
        
    )
}

function renderCard(title: string, description: string, content: string | null) {
    return (
        <Card className="flex-1">
            <CardHeader className="relative">
                <CardDescription>{description}</CardDescription>
                <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                {content}
                </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">{description}</div>
            </CardFooter>
        </Card>
    );
}