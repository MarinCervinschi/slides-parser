import { cn } from "../utils";

describe("cn", () => {
	it("should merge class names correctly", () => {
		expect(cn("px-2 py-1", "bg-red-500", "text-white")).toBe(
			"px-2 py-1 bg-red-500 text-white"
		);
	});

	it("should handle conditional class names", () => {
		expect(cn("px-2", true && "py-1", false && "bg-red-500")).toBe("px-2 py-1");
	});

	it("should override conflicting class names", () => {
		expect(cn("px-2 py-1", "py-2")).toBe("px-2 py-2");
	});

	it("should handle empty inputs", () => {
		expect(cn()).toBe("");
	});

	it("should handle mixed inputs", () => {
		expect(cn("foo", "bar", null, undefined, "baz", false, true && "qux")).toBe(
			"foo bar baz qux"
		);
	});
});
