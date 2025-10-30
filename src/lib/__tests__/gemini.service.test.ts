import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import fs from "fs";
import path from "path";

import { generateMarkdownFromText } from "../gemini.service";

// Mock the 'ai' module
jest.mock("ai", () => ({
	generateText: jest.fn(),
}));

// Mock the '@ai-sdk/google' module
jest.mock("@ai-sdk/google", () => ({
	google: jest.fn(() => ({ modelId: "gemini-1.5-flash-latest" })),
}));

// Mock the 'fs' module
jest.mock("fs", () => ({
	readFileSync: jest.fn(),
}));

// Mock the 'path' module
jest.mock("path", () => ({
	join: jest.fn((...args) => args.join("/")),
}));

describe("gemini.service", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		(path.join as jest.Mock).mockImplementation((...args) => args.join("/"));
	});

	it("should generate markdown from extracted text", async () => {
		const extractedText = "This is some extracted text.";
		const mockPromptTemplate =
			"Please convert the following text to markdown: {extractedText}";
		const expectedMarkdown = "# Converted Markdown\n\nThis is some extracted text.";

		(fs.readFileSync as jest.Mock).mockReturnValue(mockPromptTemplate);
		(generateText as jest.Mock).mockResolvedValue({ text: expectedMarkdown });

		const result = await generateMarkdownFromText(extractedText);
		const model = process.env.GEMINI_MODEL_TYPE || "gemini-1.5-flash-latest";

		expect(path.join).toHaveBeenCalledWith(process.cwd(), "src", "lib", "prompt.md");
		expect(fs.readFileSync).toHaveBeenCalledWith(expect.any(String), "utf-8");
		expect(generateText).toHaveBeenCalledWith({
			model: expect.objectContaining({ modelId: model }),
			prompt: mockPromptTemplate.replace("{extractedText}", extractedText),
		});
		expect(google).toHaveBeenCalledWith(model);
		expect(result).toEqual(expectedMarkdown);
	});
});
