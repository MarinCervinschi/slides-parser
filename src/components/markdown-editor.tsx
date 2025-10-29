"use client";

import { Textarea } from "@/components/ui/textarea";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder,
}: MarkdownEditorProps) {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || "Markdown content will appear here..."}
      className="h-full min-h-full resize-none border-0 font-mono text-sm focus-visible:ring-0"
    />
  );
}
