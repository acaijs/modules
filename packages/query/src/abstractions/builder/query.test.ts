// Packages
import test from "@acai/testing";

// Abstractions
import AbstractQuery from "./index";

// Strategies
import sql from "../../classes/queryStrategies/sql/strategy";

// Create concrete class based on sql
class Query extends AbstractQuery {
	protected queryType = sql;
}

test.group("Test abstract query methods", () => {

	// -------------------------------------------------
	// Test defintestion
	// -------------------------------------------------

	test("Test test's not undefined", (expect) => {
		// Instance test
		const query = new Query();

		expect(query).toBeDefined();
	});
	
	// -------------------------------------------------
	// test and queries
	// -------------------------------------------------

	test("Test composition of a simple and query", (expect) => {
		// Instance test
		const query = new Query;

		// build test
		query.where("id", 2);
		const raw = query.rawQueryObject();

		expect(raw).toBeDefined();
		expect(query.rawQueryObject()).toBe({
			type: "or",
			logic: [
				{
					type: "and",
					logic: [
						["id", "=", 2]
					]
				}
			]
		});
	});

	test("Test composition of a simple and query", (expect) => {
		const query = new Query;
		query.where("id", 2).where("name", "John");

		expect(query.rawQueryObject()).toBe({
			type: "or",
			logic: [
				{
					type: "and",
					logic: [
						["id", "=", 2],
						["name", "=", "John"]
					]
				}
			]
		});
	});

	test("Test composition of a array and query", (expect) => {
		const query = new Query;
		query.where([["id", "=", 2], ["name", "=", "John"]]);

		expect(query.rawQueryObject()).toBe({
			type: "or",
			logic: [
				{
					type: "and",
					logic: [
						["id", "=", 2],
						["name", "=", "John"]
					]
				}
			]
		});
	});
	
	// -------------------------------------------------
	// test and different queries
	// -------------------------------------------------

	test("Test composition of a simple and query", (expect) => {
		// Instance test
		const query = new Query;

		query.where("id", "!=", 2);

		expect(query.rawQueryObject()).toBeDefined();
		expect(query.rawQueryObject()).toBe({
			type: "or",
			logic: [
				{
					type: "and",
					logic: [
						["id", "!=", 2]
					]
				}
			]
		});
	});

	test("Test composition of a simple and query", (expect) => {
		const query = new Query;
		query.where("id", "!=", 2).where("name", "!=", "John");

		expect(query.rawQueryObject()).toBe({
			type: "or",
			logic: [
				{
					type: "and",
					logic: [
						["id", "!=", 2],
						["name", "!=", "John"]
					]
				}
			]
		});
	});

	test("Test composition of a array and query", (expect) => {
		const query = new Query;
		query.where([["id", "!=", 2], ["name", "!=", "John"]]);

		expect(query.rawQueryObject()).toBe({
			type: "or",
			logic: [
				{
					type: "and",
					logic: [
						["id", "!=", 2],
						["name", "!=", "John"]
					]
				}
			]
		});
	});
	
	// -------------------------------------------------
	// test or queries
	// -------------------------------------------------

	test("Test composition of a simple or different query", (expect) => {
		const query = new Query;
		query.where("id", 2).orWhere("name", "John");

		expect(query.rawQueryObject()).toBe({
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
					]
				},				
			]
		});
	});
	
	// -------------------------------------------------
	// test composite queries
	// -------------------------------------------------

	test("Test composition of a simple and / or / and", (expect) => {
		const query = new Query;
		query.where("id", 2).orWhere("name", "John").where("age", 20);

		expect(query.rawQueryObject()).toBe({
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
	});
	
	// -------------------------------------------------
	// test and different queries
	// -------------------------------------------------

	test("Test composition of a simple or different query", (expect) => {
		const query = new Query;
		query.where("id", "!=", 2).orWhere("name", "!=", "John");

		expect(query.rawQueryObject()).toBe({
			type: "or",
			logic: [
				{
					type: "and",
					logic: [
						["id", "!=", 2],
					]
				},
				{
					type: "and",
					logic: [
						["name", "!=", "John"]
					]
				}
			]
		});
	});
}).tag(["query", "abstract"]);