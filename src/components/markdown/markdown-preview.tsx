"use client";

import ReactMarkdown from "react-markdown";

import "highlight.js/styles/github-dark.css";
import "katex/dist/katex.min.css";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

interface MarkdownPreviewProps {
	content: string;
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
	if (!content) {
		return (
			<p className="text-muted-foreground text-sm">
				Preview will appear here as you edit...
			</p>
		);
	}

	return (
		<div className="prose prose-sm dark:prose-invert max-w-none">
			<ReactMarkdown
				remarkPlugins={[remarkGfm, remarkMath]}
				rehypePlugins={[rehypeHighlight, rehypeKatex]}
			>
				{content}
			</ReactMarkdown>
		</div>
	);
}
