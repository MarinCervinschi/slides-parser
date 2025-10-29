import { NextResponse } from "next/server";

import { RedisService } from "@/lib/redis.service";

export async function GET() {
	try {
		const ipAddress = await RedisService.getClientIP();

		if (!ipAddress || ipAddress === "unknown") {
			return NextResponse.json({ error: "Unable to identify client" }, { status: 400 });
		}

		const count = await RedisService.getRequestCount();

		return NextResponse.json({
			count: count || 0,
			limit: RedisService.MAX_REQUESTS_PER_DAY,
			date: RedisService.getTodayKey(),
		});
	} catch (error) {
		console.error("Error getting request count:", error);
		return NextResponse.json({ error: "Failed to get request count" }, { status: 500 });
	}
}
