import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import fs from "fs";
import path from "path";

const model = process.env.GEMINI_MODEL_TYPE || "gemini-1.5-flash-latest";

export async function generateMarkdownFromText(
  extractedText: string,
): Promise<string> {
  const promptFilePath = path.join(process.cwd(), "src", "lib", "prompt.md");
  const promptTemplate = fs.readFileSync(promptFilePath, "utf-8");
  const prompt = promptTemplate.replace("{extractedText}", extractedText);

  const { text: markdownContent } = await generateText({
    model: google(model),
    prompt,
  });

  return markdownContent;
}
