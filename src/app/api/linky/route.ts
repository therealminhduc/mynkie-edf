import {NextResponse} from "next/server";
import {EnergyResponse, Session} from "linky";
import {getDateRange, StartEndDate} from "@/app/utils/dateUtil";
import {get} from "@vercel/edge-config";
import fetch from "node-fetch";

const token = process.env.LINKY_API_TOKEN as string;
const session = new Session(token);
session.userAgent = "mynkie";

const edgeConfigId = process.env.EDITOR_CONFIG_ID;
const accessToken = process.env.VERCEL_ACCESS_TOKEN;


export async function GET() {
    const dateRange: StartEndDate = getDateRange();

    try {
        const cachedData = await get("mynkie-edf") as EnergyResponse | null;

        // Check if cachedData is still up to date
        if (cachedData && cachedData.end === dateRange.endDate) {
            console.log("Using cached data");
            return NextResponse.json(cachedData);
        }

        // Cached data is outdated, fetch fresh data
        const data: EnergyResponse = await session.getDailyConsumption(dateRange.startDate, dateRange.endDate);
        // await handler(data);
        const newData = {
            items: [
                {
                    operation: "update",
                    key: 'mynkie-edf',
                    value: data,
                }
            ]
        };

        const response = await fetch(
            `https://api.vercel.com/v1/edge-config/${edgeConfigId}/items`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(newData),
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log("Data fetched and stored", responseData);

        return NextResponse.json(data);
    } catch (e) {
        console.error("Error while fetching data", e);
        return NextResponse.json(e);
    }
}