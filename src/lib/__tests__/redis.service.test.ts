import { headers } from "next/headers";

import {
	getClientIP,
	getRequestCount,
	getRequestKey,
	getTodayKey,
	getUserId,
	redis,
} from "../redis.service";

// Mock @upstash/redis
const mockRedisInstance = {
	get: jest.fn(),
	set: jest.fn(),
};

jest.mock("@upstash/redis", () => ({
	Redis: jest.fn(() => mockRedisInstance),
}));

// Mock next/headers
jest.mock("next/headers", () => ({
	headers: jest.fn(),
}));

describe("redis.service", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockRedisInstance.get.mockReset();
		mockRedisInstance.set.mockReset();
		// Set default mock for headers
		(headers as jest.Mock).mockReturnValue({
			get: jest.fn((name: string) => {
				if (name === "x-forwarded-for") return "192.168.1.1";
				if (name === "x-user-id") return "test-user-id";
				return null;
			}),
		});
	});

	describe("getRequestCount", () => {
		it("should return the request count from Redis", async () => {
			mockRedisInstance.get.mockResolvedValue(5);

			const count = await getRequestCount();
			expect(count).toBe(5);
			expect(mockRedisInstance.get).toHaveBeenCalledWith(expect.any(String));
		});

		it("should return 0 if no count is found in Redis", async () => {
			const mockRedisGet = redis().get as jest.Mock;
			mockRedisGet.mockResolvedValue(null);

			const count = await getRequestCount();
			expect(count).toBe(0);
		});

		it("should return 0 and not call redis if ip is localhost", async () => {
			(headers as jest.Mock).mockReturnValue({
				get: jest.fn((name: string) => {
					if (name === "x-forwarded-for") return "127.0.0.1";
					return null;
				}),
			});

			const count = await getRequestCount();

			expect(count).toBe(0);
			expect(mockRedisInstance.get).not.toHaveBeenCalled();
		});
	});

	describe("getRequestKey", () => {
		it("should generate a key with user ID if available", async () => {
			const key = await getRequestKey();
			const today = getTodayKey();
			expect(key).toBe(`requests:192.168.1.1:test-user-id:${today}`);
		});

		it("should generate a key without user ID if not available", async () => {
			(headers as jest.Mock).mockReturnValue({
				get: jest.fn((name: string) => {
					if (name === "x-forwarded-for") return "192.168.1.1";
					return null;
				}),
			});
			const key = await getRequestKey();
			const today = getTodayKey();
			expect(key).toBe(`requests:192.168.1.1:${today}`);
		});

		it("should return 'localhost' if IP is 127.0.0.1", async () => {
			(headers as jest.Mock).mockReturnValue({
				get: jest.fn((name: string) => {
					if (name === "x-forwarded-for") return "127.0.0.1";
					return null;
				}),
			});
			const key = await getRequestKey();
			expect(key).toBe("localhost");
		});
	});

	describe("getTodayKey", () => {
		it(`should return today's date in YYYY-MM-DD format`, () => {
			const today = new Date();
			const year = today.getFullYear();
			const month = (today.getMonth() + 1).toString().padStart(2, "0");
			const day = today.getDate().toString().padStart(2, "0");
			expect(getTodayKey()).toBe(`${year}-${month}-${day}`);
		});
	});

	describe("getClientIP", () => {
		it("should return x-forwarded-for if available", async () => {
			(headers as jest.Mock).mockReturnValue({
				get: jest.fn((name: string) => {
					if (name === "x-forwarded-for") return "192.168.1.2, 10.0.0.1";
					return null;
				}),
			});
			expect(await getClientIP()).toBe("192.168.1.2");
		});

		it("should return x-real-ip if x-forwarded-for is not available", async () => {
			(headers as jest.Mock).mockReturnValue({
				get: jest.fn((name: string) => {
					if (name === "x-real-ip") return "192.168.1.3";
					return null;
				}),
			});
			expect(await getClientIP()).toBe("192.168.1.3");
		});

		it("should return cf-connecting-ip if x-forwarded-for and x-real-ip are not available", async () => {
			(headers as jest.Mock).mockReturnValue({
				get: jest.fn((name: string) => {
					if (name === "cf-connecting-ip") return "192.168.1.4";
					return null;
				}),
			});
			expect(await getClientIP()).toBe("192.168.1.4");
		});

		it("should return unknown if no IP headers are available", async () => {
			(headers as jest.Mock).mockReturnValue({
				get: jest.fn(() => null),
			});
			expect(await getClientIP()).toBe("unknown");
		});
	});

	describe("getUserId", () => {
		it("should return x-user-id if available", async () => {
			(headers as jest.Mock).mockReturnValue({
				get: jest.fn((name: string) => {
					if (name === "x-user-id") return "another-user-id";
					return null;
				}),
			});
			expect(await getUserId()).toBe("another-user-id");
		});

		it("should return null if x-user-id is not available", async () => {
			(headers as jest.Mock).mockReturnValue({
				get: jest.fn(() => null),
			});
			expect(await getUserId()).toBeNull();
		});
	});
});
