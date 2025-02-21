import { NextResponse } from "next/server";
import { get } from "@vercel/edge-config";

export async function GET() {
    try {
        const greeting = await get("mynkie-edf");

        if (!greeting) {
            return NextResponse.json({ error: "Greeting not found" });
        }

        return NextResponse.json({ message: greeting });
    } catch (error) {
        console.error("Error fetching Edge Config:", error);
        return NextResponse.json({ error: "Failed to fetch data" });
    }
}