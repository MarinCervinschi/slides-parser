"use client";

import { useState } from "react";

import { Copy, Download, PanelLeft, PanelLeftClose } from "lucide-react";
import { toast } from "sonner";

import { FileUpload } from "@/components/file-upload";
import { MarkdownEditor } from "@/components/markdown-editor";
import { MarkdownPreview } from "@/components/markdown-preview";
import { RequestCounter } from "@/components/request-counter";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Home() {
	const [markdownContent, setMarkdownContent] = useState("");
	const [isProcessing, setIsProcessing] = useState(false);
	const [fileName, setFileName] = useState("");
	const [showEditor, setShowEditor] = useState(false);
	const [requestCount, setRequestCount] = useState(0);

	const handleFileSelect = async (file: File) => {
		setIsProcessing(true);
		setFileName(file.name.replace(".pdf", ""));

		try {
			const formData = new FormData();
			formData.append("file", file);

			const response = await fetch("/api/parse", {
				method: "POST",
				body: formData,
			});

			const data = await response.json();

			if (response.status === 429) {
				toast.error(data.error || "Rate limit exceeded. Please try again tomorrow.");
				setMarkdownContent("");
				setIsProcessing(false);
				return;
			}

			if (!response.ok) {
				throw new Error(data.error || "Failed to process file");
			}

			setMarkdownContent(data.markdown);
			toast.success("File converted to Markdown successfully!");

			await fetch("/api/track-request", {
				method: "POST",
			});

			setRequestCount(prev => prev + 1);
		} catch (error) {
			console.error("Error processing file:", error);
			toast.error(error instanceof Error ? error.message : "Failed to process file");
			setMarkdownContent("");
		} finally {
			setIsProcessing(false);
		}
	};

	const handleCopyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(markdownContent);
			toast.success("Copied to clipboard!");
		} catch (error) {
			toast.error("Failed to copy to clipboard");
			console.error("Error copying to clipboard:", error);
		}
	};

	const handleDownload = () => {
		try {
			const blob = new Blob([markdownContent], { type: "text/markdown" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `${fileName || "document"}.md`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
			toast.success("File downloaded!");
		} catch (error) {
			toast.error("Failed to download file");
			console.error("Error downloading file:", error);
		}
	};

	return (
		<div className="flex h-screen flex-col">
			{/* Header */}
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
							<Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
								<Copy className="h-4 w-4" />
								Copy
							</Button>
							<Button variant="outline" size="sm" onClick={handleDownload}>
								<Download className="h-4 w-4" />
								Download
							</Button>
						</div>
					)}
				</div>
			</header>

			{/* Main Content - Three Panel Layout */}
			<div className="flex flex-1 overflow-hidden">
				{/* Left Panel - File Upload - Fixed width */}
				<div className="bg-muted/30 w-80 shrink-0 border-r p-6">
					<div className="space-y-4">
						<div>
							<h2 className="text-lg font-semibold">Upload File</h2>
							<p className="text-muted-foreground text-sm">
								Upload a PDF file to get started
							</p>
						</div>
						<FileUpload onFileSelect={handleFileSelect} isProcessing={isProcessing} />
						<div className="pt-2">
							<RequestCounter key={requestCount} />
						</div>
					</div>
				</div>

				{showEditor && (
					<>
						<div className="flex w-[500px] shrink-0 flex-col">
							<div className="border-b px-4 py-3">
								<h2 className="text-sm font-semibold">Markdown Editor</h2>
							</div>
							<div className="flex-1 overflow-auto">
								{markdownContent ? (
									<MarkdownEditor
										value={markdownContent}
										onChange={setMarkdownContent}
									/>
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
								onClick={() => setShowEditor(!showEditor)}
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
		</div>
	);
}
