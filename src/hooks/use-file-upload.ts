"use client";

import { useCallback, useState } from "react";

interface UseFileUploadProps {
	onFileSelect: (file: File) => void;
}

export function useFileUpload({ onFileSelect }: UseFileUploadProps) {
	const [isDragging, setIsDragging] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [error, setError] = useState<string | null>(null);

	const validateFile = (file: File): boolean => {
		setError(null);

		if (file.type !== "application/pdf") {
			setError("Please upload a PDF file");
			return false;
		}

		const maxSize = 10 * 1024 * 1024; // 10MB
		if (file.size > maxSize) {
			setError("File size must be less than 10MB");
			return false;
		}

		return true;
	};

	const handleFile = useCallback(
		(file: File) => {
			if (validateFile(file)) {
				setSelectedFile(file);
				onFileSelect(file);
			}
		},
		[onFileSelect]
	);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
	}, []);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			setIsDragging(false);

			const files = Array.from(e.dataTransfer.files);
			if (files.length > 0) {
				handleFile(files[0]);
			}
		},
		[handleFile]
	);

	const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			handleFile(files[0]);
		}
	};

	const clearFile = () => {
		setSelectedFile(null);
		setError(null);
	};

	return {
		isDragging,
		selectedFile,
		error,
		handleDragOver,
		handleDragLeave,
		handleDrop,
		handleFileInput,
		clearFile,
	};
}
