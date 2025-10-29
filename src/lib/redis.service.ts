import { headers } from "next/headers";

import { Redis } from "@upstash/redis";

export class RedisService {
	public static readonly MAX_REQUESTS_PER_DAY = 3;

	static redis = (): Redis => {
		return new Redis({
			url: process.env.UPSTASH_KV_KV_REST_API_URL || process.env.KV_REST_API_URL || "",
			token:
				process.env.UPSTASH_KV_KV_REST_API_TOKEN || process.env.KV_REST_API_TOKEN || "",
		});
	};

	static async getRequestCount(): Promise<number> {
		const key = RedisService.getRequestKey();
		const count = await RedisService.redis().get<number>(key);
		return count || 0;
	}

	static getRequestKey(): string {
		const ipAddress = RedisService.getClientIP();
		const date = RedisService.getTodayKey();
		return `requests:${ipAddress}:${date}`;
	}

	static getTodayKey = (): string => {
		const today = new Date();
		return today.toISOString().split("T")[0];
	};

	static async getClientIP(): Promise<string> {
		const headersList = await headers();

		const forwardedFor = headersList.get("x-forwarded-for");
		const realIp = headersList.get("x-real-ip");
		const cfConnectingIp = headersList.get("cf-connecting-ip");

		if (forwardedFor) {
			return forwardedFor.split(",")[0].trim();
		}

		if (realIp) {
			return realIp;
		}

		if (cfConnectingIp) {
			return cfConnectingIp;
		}

		return "unknown";
	}
}
