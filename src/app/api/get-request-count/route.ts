import { NextResponse } from "next/server";

import {
	MAX_REQUESTS_PER_DAY,
	getClientIP,
	getRequestCount,
	getTodayKey,
} from "@/lib/redis.service";

export async function GET() {
	try {
		const ipAddress = await getClientIP();

		if (!ipAddress || ipAddress === "unknown") {
			return NextResponse.json({ error: "Unable to identify client" }, { status: 400 });
		}

		const count = await getRequestCount();

		return NextResponse.json({
			count: count || 0,
			limit: MAX_REQUESTS_PER_DAY,
			date: getTodayKey(),
		});
	} catch (error) {
		console.error("Error getting request count:", error);
		return NextResponse.json({ error: "Failed to get request count" }, { status: 500 });
	}
}
