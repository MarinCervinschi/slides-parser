"use client";

import { Copy, Download } from "lucide-react";

import { Button } from "@/components/ui/button";

interface HeaderProps {
	markdownContent: string;
	onCopy: () => void;
	onDownload: () => void;
}

export function Header({ markdownContent, onCopy, onDownload }: HeaderProps) {
	return (
		<header className="bg-background border-b px-6 py-4">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Slides Parser</h1>
					<p className="text-muted-foreground text-sm">
						Convert your slides to Markdown with AI
					</p>
				</div>
				{markdownContent && (
					<div className="flex gap-2">
						<Button variant="outline" size="sm" onClick={onCopy}>
							<Copy className="h-4 w-4" />
							Copy
						</Button>
						<Button variant="outline" size="sm" onClick={onDownload}>
							<Download className="h-4 w-4" />
							Download
						</Button>
					</div>
				)}
			</div>
		</header>
	);
}
