import { getRequestCount, parseFile, trackRequest } from "../api.service";

describe("api.service", () => {
	beforeEach(() => {
		fetchMock.resetMocks();
	});

	describe("parseFile", () => {
		it("should return markdown on successful parsing", async () => {
			const file = new File(["content"], "test.txt", { type: "text/plain" });
			const userId = "test-user";
			const mockMarkdown = "# Test Markdown";

			fetchMock.mockResponseOnce(JSON.stringify({ markdown: mockMarkdown }));

			const result = await parseFile(file, userId);

			expect(fetch).toHaveBeenCalledWith("/api/parse", {
				method: "POST",
				body: expect.any(FormData),
				headers: {
					"X-User-ID": userId,
				},
			});
			expect(result).toEqual(mockMarkdown);
		});

		it("should throw an error on rate limit exceeded", async () => {
			const file = new File(["content"], "test.txt", { type: "text/plain" });
			const userId = "test-user";

			fetchMock.mockResponseOnce(JSON.stringify({ error: "Rate limit exceeded" }), {
				status: 429,
			});

			await expect(parseFile(file, userId)).rejects.toThrow("Rate limit exceeded");
		});

		it("should throw an error on failure", async () => {
			const file = new File(["content"], "test.txt", { type: "text/plain" });
			const userId = "test-user";

			fetchMock.mockResponseOnce(JSON.stringify({ error: "Failed to process" }), {
				status: 500,
			});

			await expect(parseFile(file, userId)).rejects.toThrow("Failed to process");
		});

		it("should throw default rate limit error if data.error is undefined", async () => {
			const file = new File(["content"], "test.txt", { type: "text/plain" });
			const userId = "test-user";

			fetchMock.mockResponseOnce(JSON.stringify({}), { status: 429 }); // data.error is undefined

			await expect(parseFile(file, userId)).rejects.toThrow(
				"Rate limit exceeded. Please try again tomorrow."
			);
		});

		it("should throw default failure error if data.error is undefined", async () => {
			const file = new File(["content"], "test.txt", { type: "text/plain" });
			const userId = "test-user";

			fetchMock.mockResponseOnce(JSON.stringify({}), { status: 500 }); // data.error is undefined

			await expect(parseFile(file, userId)).rejects.toThrow("Failed to process file");
		});
	});

	describe("trackRequest", () => {
		it("should send a POST request to /api/track-request", async () => {
			const userId = "test-user";
			fetchMock.mockResponseOnce(JSON.stringify({}));

			await trackRequest(userId);

			expect(fetch).toHaveBeenCalledWith("/api/track-request", {
				method: "POST",
				headers: {
					"X-User-ID": userId,
				},
			});
		});
	});

	describe("getRequestCount", () => {
		it("should return request count and limit on success", async () => {
			const userId = "test-user";
			const mockData = { count: 5, limit: 10 };
			fetchMock.mockResponseOnce(JSON.stringify(mockData));

			const result = await getRequestCount(userId);

			expect(fetch).toHaveBeenCalledWith("/api/get-request-count", {
				headers: {
					"X-User-ID": userId,
				},
			});
			expect(result).toEqual({ ok: true, ...mockData });
		});

		it("should return ok: false on failure", async () => {
			const userId = "test-user";
			fetchMock.mockResponseOnce("", { status: 500 });

			const result = await getRequestCount(userId);

			expect(result).toEqual({ ok: false, count: 0, limit: 0 });
		});
	});
});
