import { headers } from "next/headers";

import { Redis } from "@upstash/redis";

export const MAX_REQUESTS_PER_DAY = 3;

/**
 * Returns a Redis client instance.
 * @returns A Redis client instance.
 */
export const redis = (): Redis => {
	return new Redis({
		url: process.env.UPSTASH_KV_KV_REST_API_URL || process.env.KV_REST_API_URL || "",
		token:
			process.env.UPSTASH_KV_KV_REST_API_TOKEN || process.env.KV_REST_API_TOKEN || "",
	});
};

/**
 * Retrieves the request count for the current user.
 * @returns A promise that resolves to the request count.
 */
export async function getRequestCount(): Promise<number> {
	const key = await getRequestKey();
	if (key === "localhost") {
		return 0;
	}

	const count = await redis().get<number>(key);
	return count || 0;
}

/**
 * Generates a Redis key for tracking requests based on the client's IP address and the current date.
 * @returns The Redis key.
 */
export async function getRequestKey(): Promise<string> {
	const ipAddress = await getClientIP();
	if (ipAddress === "127.0.0.1" || ipAddress === "::1") {
		return "localhost";
	}

	const userId = await getUserId();
	const date = getTodayKey();

	if (userId) {
		return `requests:${ipAddress}:${userId}:${date}`;
	}

	return `requests:${ipAddress}:${date}`;
}

/**
 * Generates a key for the current date.
 * @returns The date key in the format YYYY-MM-DD.
 */
export const getTodayKey = (): string => {
	const today = new Date();
	return today.toISOString().split("T")[0];
};

/**
 * Retrieves the client's IP address from the request headers.
 * @returns A promise that resolves to the client's IP address.
 */
export async function getClientIP(): Promise<string> {
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

/**
 * Retrieves the user's ID from the request headers.
 * @returns A promise that resolves to the user's ID.
 */
export async function getUserId(): Promise<string | null> {
	const headersList = await headers();
	return headersList.get("x-user-id") || null;
}
