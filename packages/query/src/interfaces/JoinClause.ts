export default interface JoinClauseInterface {
	type: "inner" | "left" | "right" | "outer";
	table: string;
	firstColumn: string;
	secondColumn: string;
	operator: string;
}