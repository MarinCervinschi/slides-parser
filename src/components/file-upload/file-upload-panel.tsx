"use client";

import { RequestCounter } from "@/components/request-counter";

import { FileUpload } from ".";

interface FileUploadPanelProps {
	onFileSelect: (file: File) => void;
	isProcessing: boolean;
	requestCount: number;
}

export function FileUploadPanel({
	onFileSelect,
	isProcessing,
	requestCount,
}: FileUploadPanelProps) {
	return (
		<div className="bg-muted/30 w-80 shrink-0 border-r p-6">
			<div className="space-y-4">
				<div>
					<h2 className="text-lg font-semibold">Upload File</h2>
					<p className="text-muted-foreground text-sm">
						Upload a PDF file to get started
					</p>
				</div>
				<FileUpload onFileSelect={onFileSelect} isProcessing={isProcessing} />
				<div className="pt-2">
					<RequestCounter key={requestCount} />
				</div>
			</div>
		</div>
	);
}
