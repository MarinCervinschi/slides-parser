import { type NextRequest, NextResponse } from "next/server";

import { extractText } from "unpdf";

import { generateMarkdownFromText } from "@/lib/gemini.service";
import { MAX_REQUESTS_PER_DAY, getRequestCount } from "@/lib/redis.service";

export async function POST(request: NextRequest) {
	try {
		const currentCount = await getRequestCount();

		if (currentCount >= MAX_REQUESTS_PER_DAY) {
			return NextResponse.json(
				{
					error: `Rate limit exceeded. You can only process ${MAX_REQUESTS_PER_DAY} files per day.`,
					rateLimitExceeded: true,
				},
				{ status: 429 }
			);
		}

		const formData = await request.formData();
		const file = formData.get("file") as File;

		if (!file) {
			return NextResponse.json({ error: "No file provided" }, { status: 400 });
		}

		if (file.type !== "application/pdf") {
			return NextResponse.json(
				{ error: "Only PDF files are supported" },
				{ status: 400 }
			);
		}

		const bytes = await file.arrayBuffer();
		const buffer = new Uint8Array(bytes);

		let extractedText: string;
		try {
			const { text } = await extractText(buffer);
			extractedText = text.join("\n");
		} catch (error) {
			console.error("PDF parsing error:", error);
			return NextResponse.json({ error: "Failed to parse PDF file" }, { status: 500 });
		}

		if (!extractedText || extractedText.trim().length === 0) {
			return NextResponse.json(
				{ error: "No text content found in PDF" },
				{ status: 400 }
			);
		}

		try {
			const markdownContent = await generateMarkdownFromText(extractedText);

			return NextResponse.json({
				success: true,
				markdown: markdownContent,
				fileName: file.name,
			});
		} catch (error) {
			console.error("Gemini API error:", error);
			return NextResponse.json(
				{
					error: "Failed to convert content to Markdown. Please check your API key.",
				},
				{ status: 500 }
			);
		}
	} catch (error) {
		console.error("API error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
