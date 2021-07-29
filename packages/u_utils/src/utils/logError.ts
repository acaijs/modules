export default function logError (title: string, trace: string[] = [], data?: Record<string, any>) {
	console.log("\x1b[41m\x1b[37m Error \x1b[0m");

	console.log("\n\x1b[44m\x1b[37m Message \x1b[0m");
	console.log(`\t${title}`);

	if (trace.length) {
		console.log("\n\x1b[44m\x1b[37m Trace \x1b[0m");
		trace.forEach(i => console.log(`\t${i}`));
	}

	const { trace: _, message, ...displayData } = data || {};
	if (Object.keys(displayData).length !== 0) {
		console.log("\n\x1b[44m\x1b[37m Extra Data \x1b[0m");
		Object.keys(displayData).forEach(key => console.log(`\t${key} - `, displayData[key]));
	}

	console.log("\n");
}