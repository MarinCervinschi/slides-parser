"use client";

import { useCallback, useState } from "react";

interface UseFileUploadProps {
	onFileSelect: (file: File) => void;
}

const maxSize = process.env.NEXT_PUBLIC_MAX_FILE_SIZE_MB
	? parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE_MB) * 1024 * 1024
	: 15 * 1024 * 1024; // Default to 15MB if not set

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

		if (file.size > maxSize) {
			setError(`File size must be less than ${maxSize / 1024 / 1024}MB`);
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
