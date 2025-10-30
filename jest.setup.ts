import "@testing-library/jest-dom";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

if (typeof global.TransformStream === "undefined") {
	const { TransformStream } = jest.requireActual(
		"web-streams-polyfill/dist/ponyfill.js"
	);
	global.TransformStream = TransformStream;
}
