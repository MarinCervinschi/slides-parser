import { NextResponse } from "next/server";

import {
	MAX_REQUESTS_PER_DAY,
	getClientIP,
	getRequestCount,
	getRequestKey,
	getTodayKey,
	redis,
} from "@/lib/redis.service";

export async function POST() {
	try {
		const ipAddress = await getClientIP();

		if (!ipAddress || ipAddress === "unknown") {
			return NextResponse.json({ error: "Unable to identify client" }, { status: 400 });
		}

		const currentCount = await getRequestCount();

		if (currentCount >= MAX_REQUESTS_PER_DAY) {
			return NextResponse.json(
				{
					error: "Rate limit exceeded",
					count: currentCount,
					limit: MAX_REQUESTS_PER_DAY,
					date: getTodayKey(),
				},
				{ status: 429 }
			);
		}

		const redisClient = redis();
		const key = await getRequestKey();

		let count = 0;

		if (key !== "localhost") {
			// Increment the request count for today
			count = await redisClient.incr(key);

			// Set expiration to 7 days (604800 seconds) if this is the first request
			if (count === 1) {
				await redisClient.expire(key, 604800);
			}
		}

		return NextResponse.json({
			count,
			limit: MAX_REQUESTS_PER_DAY,
			date: getTodayKey(),
		});
	} catch (error) {
		console.error("Error tracking request:", error);
		return NextResponse.json({ error: "Failed to track request" }, { status: 500 });
	}
}
