"use client";

import { useState } from "react";

import { toast } from "sonner";

import { FileUploadPanel } from "@/components/file-upload-panel";
import { Header } from "@/components/header";
import { MainContent } from "@/components/main-content";
import { useUserId } from "@/hooks/use-user-id";

export default function Home() {
	const [markdownContent, setMarkdownContent] = useState("");
	const [isProcessing, setIsProcessing] = useState(false);
	const [fileName, setFileName] = useState("");
	const [showEditor, setShowEditor] = useState(false);
	const userId = useUserId();

	const handleFileSelect = async (file: File) => {
		setIsProcessing(true);
		setFileName(file.name.replace(".pdf", ""));

		try {
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
				headers: {
					"X-User-ID": userId || "",
				},
			});
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
			<Header
				markdownContent={markdownContent}
				onCopy={handleCopyToClipboard}
				onDownload={handleDownload}
			/>
			<div className="flex flex-1 overflow-hidden">
				<FileUploadPanel onFileSelect={handleFileSelect} isProcessing={isProcessing} />
				<MainContent
					markdownContent={markdownContent}
					isProcessing={isProcessing}
					showEditor={showEditor}
					onMarkdownChange={setMarkdownContent}
					onShowEditorChange={() => setShowEditor(!showEditor)}
				/>
			</div>
		</div>
	);
}
