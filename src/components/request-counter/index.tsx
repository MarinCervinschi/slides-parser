"use client";

import { useEffect, useState } from "react";

import { Activity } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useUserId } from "@/hooks/use-user-id";
import { getRequestCount } from "@/lib/api.service";

export function RequestCounter() {
	const [count, setCount] = useState<number>(0);
	const [limit, setLimit] = useState<number>(3);
	const [loading, setLoading] = useState(true);
	const userId = useUserId();

	useEffect(() => {
		const fetchCount = async () => {
			if (!userId) return;

			try {
				setLoading(true);
				const { ok, count, limit } = await getRequestCount(userId);
				if (ok) {
					setCount(count);
					setLimit(limit);
				}
			} catch (error) {
				console.error("Error fetching request count:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchCount();
	}, [userId]);

	const progressPercentage = (count / limit) * 100;
	const isLimitReached = count >= limit;

	return (
		<Card className="border-border/40">
			<CardHeader className="pb-3">
				<CardTitle className="flex items-center gap-2 text-sm font-medium">
					<Activity className="h-4 w-4" />
					Daily Requests
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				{loading ? (
					<p className="text-muted-foreground text-sm">Loading...</p>
				) : (
					<>
						<div className="flex items-baseline justify-between">
							<p className="text-2xl font-bold">
								{count} / {limit}
							</p>
							{isLimitReached && (
								<span className="text-destructive text-xs font-medium">
									Limit reached
								</span>
							)}
						</div>
						<Progress value={progressPercentage} className="h-2" />
						<p className="text-muted-foreground text-xs">
							{isLimitReached
								? "Come back tomorrow for more requests"
								: `${limit - count} request${limit - count !== 1 ? "s" : ""} remaining today`}
						</p>
					</>
				)}
			</CardContent>
		</Card>
	);
}
