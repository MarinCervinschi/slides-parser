import { NextResponse } from "next/server";

import { RedisService } from "@/lib/redis.service";

export async function POST() {
	try {
		const ipAddress = await RedisService.getClientIP();

		if (!ipAddress || ipAddress === "unknown") {
			return NextResponse.json({ error: "Unable to identify client" }, { status: 400 });
		}

		const redis = RedisService.redis();

		const currentCount = await RedisService.getRequestCount();

		if (currentCount >= RedisService.MAX_REQUESTS_PER_DAY) {
			return NextResponse.json(
				{
					error: "Rate limit exceeded",
					count: currentCount,
					limit: RedisService.MAX_REQUESTS_PER_DAY,
					date: RedisService.getTodayKey(),
				},
				{ status: 429 }
			);
		}

		const key = RedisService.getRequestKey();

		// Increment the request count for today
		const count = await redis.incr(key);

		// Set expiration to 7 days (604800 seconds) if this is the first request
		if (count === 1) {
			await redis.expire(key, 604800);
		}

		return NextResponse.json({
			count,
			limit: RedisService.MAX_REQUESTS_PER_DAY,
			date: RedisService.getTodayKey(),
		});
	} catch (error) {
		console.error("Error tracking request:", error);
		return NextResponse.json({ error: "Failed to track request" }, { status: 500 });
	}
}
