"use client";

import { PanelLeft, PanelLeftClose } from "lucide-react";

import { MarkdownEditor } from "@/components/markdown-editor";
import { MarkdownPreview } from "@/components/markdown-preview";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface MainContentProps {
	markdownContent: string;
	isProcessing: boolean;
	showEditor: boolean;
	onMarkdownChange: (content: string) => void;
	onShowEditorChange: () => void;
}

export function MainContent({
	markdownContent,
	isProcessing,
	showEditor,
	onMarkdownChange,
	onShowEditorChange,
}: MainContentProps) {
	return (
		<div className="flex flex-1 overflow-hidden">
			{showEditor && (
				<>
					<div className="flex w-[500px] shrink-0 flex-col">
						<div className="border-b px-4 py-3">
							<h2 className="text-sm font-semibold">Markdown Editor</h2>
						</div>
						<div className="flex-1 overflow-auto">
							{markdownContent ? (
								<MarkdownEditor value={markdownContent} onChange={onMarkdownChange} />
							) : (
								<div className="flex h-full items-center justify-center p-4">
									<p className="text-muted-foreground text-sm">
										{isProcessing
											? "Processing your file..."
											: "Upload a PDF to see the converted Markdown"}
									</p>
								</div>
							)}
						</div>
					</div>
					<Separator orientation="vertical" />
				</>
			)}

			<div className="flex min-w-0 flex-1 flex-col">
				<div className="flex items-center justify-between border-b px-4 py-3">
					<h2 className="text-sm font-semibold">Preview</h2>
					{markdownContent && (
						<Button
							variant="ghost"
							size="sm"
							onClick={onShowEditorChange}
							className="h-8 gap-2"
						>
							{showEditor ? (
								<>
									<PanelLeftClose className="h-4 w-4" />
									Hide Editor
								</>
							) : (
								<>
									<PanelLeft className="h-4 w-4" />
									Show Editor
								</>
							)}
						</Button>
					)}
				</div>
				<div className="min-w-0 flex-1 overflow-auto p-6 wrap-break-word">
					<MarkdownPreview content={markdownContent} />
				</div>
			</div>
		</div>
	);
}
