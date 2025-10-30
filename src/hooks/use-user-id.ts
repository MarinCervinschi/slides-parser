import { useState } from "react";

import { v4 as uuidv4 } from "uuid";

const USER_ID_STORAGE_KEY = "userId";

/**
 * Custom hook to manage a unique user identifier.
 * If a userId is not found in localStorage, a new one is generated and stored.
 * @returns The user's unique identifier.
 */
export const useUserId = (): string | null => {
	const [userId] = useState<string | null>(() => {
		if (typeof window === "undefined") {
			return null;
		}

		const storedUserId = localStorage.getItem(USER_ID_STORAGE_KEY);

		if (storedUserId) {
			return storedUserId;
		} else {
			const newUserId = uuidv4();
			localStorage.setItem(USER_ID_STORAGE_KEY, newUserId);
			return newUserId;
		}
	});

	return userId;
};
