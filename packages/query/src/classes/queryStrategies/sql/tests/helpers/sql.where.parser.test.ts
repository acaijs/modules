// Packages
import test from "@acai/testing";

// Helpers
import { resolveQueryPart } from "../../helpers";

test.group("sql tests", () => {
	test.group("helper tests", () => {
		test("Test composition of a simple and / or / and", (expect) => {
			// arrange
			const data = resolveQueryPart({
				type: "or",
				logic: [
					{
						type: "and",
						logic: [
							["id", "=", 2],
						]
					},
					{
						type: "and",
						logic: [
							["name", "=", "John"],
							["age", "=", 20],
						]
					},
				]
			});

			//assert
			expect(data[0]).toBe("id = ? OR name = ? AND age = ?");
			expect(data[1]).toBe([2, "John", 20]);
		});
		
	}).tag(["sql", "helper", "parser"]);
});