/**
 * Parses a file by sending it to the API.
 * @param file The file to parse.
 * @param userId The ID of the user.
 * @returns The parsed data from the API.
 */
export async function parseFile(file: File, userId: string) {
	const formData = new FormData();
	formData.append("file", file);

	const response = await fetch("/api/parse", {
		method: "POST",
		body: formData,
		headers: {
			"X-User-ID": userId || "",
		},
	});

	const data = await response.json();

	if (response.status === 429) {
		throw new Error(data.error || "Rate limit exceeded. Please try again tomorrow.");
	}

	if (!response.ok) {
		throw new Error(data.error || "Failed to process file");
	}

	return data;
}

/**
 * Tracks a request for a user.
 * @param userId The ID of the user.
 */
export async function trackRequest(userId: string) {
	await fetch("/api/track-request", {
		method: "POST",
		headers: {
			"X-User-ID": userId || "",
		},
	});
}

/**
 * Gets the request count for a user.
 * @param userId The ID of the user.
 * @returns An object containing the request count and limit.
 */
export async function getRequestCount(userId: string) {
	const response = await fetch("/api/get-request-count", {
		headers: {
			"X-User-ID": userId,
		},
	});

	if (!response.ok) {
		return { ok: false, count: 0, limit: 0 };
	}

	const data = await response.json();
	return { ok: true, count: data.count, limit: data.limit };
}
