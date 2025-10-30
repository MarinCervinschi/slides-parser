"use client";

import { FileUploadPanel } from "@/components/file-upload/file-upload-panel";
import { Header } from "@/components/layout/header";
import { MainContent } from "@/components/layout/main-content";
import { useFileProcessing } from "@/hooks/use-file-processing";

export default function Home() {
	const {
		markdownContent,
		isProcessing,
		requestCount,
		showEditor,
		handleFileSelect,
		handleCopyToClipboard,
		handleDownload,
		setMarkdownContent,
		setShowEditor,
	} = useFileProcessing();

	return (
		<div className="flex h-screen flex-col">
			<Header
				markdownContent={markdownContent}
				onCopy={handleCopyToClipboard}
				onDownload={handleDownload}
			/>
			<div className="flex flex-1 overflow-hidden">
				<FileUploadPanel
					onFileSelect={handleFileSelect}
					isProcessing={isProcessing}
					requestCount={requestCount}
				/>
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
