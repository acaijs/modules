// Interfaces
import { ModelContent } 	from "../../../interfaces/ModelContent"

// Parts
import DataClass from "./data"

export default abstract class JoinClass<T = Record<string, ModelContent>> extends DataClass<T> {
	// -------------------------------------------------
	// join methods
	// -------------------------------------------------

	public joinType (type: "inner" | "left" | "right" | "outer", table: string, firstColumn: string, secondColumnOrOperator: string | "=" | "!=" | ">" | "<", secondColumn?: string) {
		this.joinList = {
			type,
			table,
			firstColumn,
			secondColumn: secondColumn || secondColumnOrOperator,
			operator: secondColumn ? secondColumnOrOperator : "=",
		}

		return this
	}

	public join (table: string, firstColumn: string, secondColumnOrOperator: string | "=" | "!=" | ">" | "<", secondColumn?: string) {
		this.joinType("outer", table, firstColumn, secondColumnOrOperator, secondColumn)

		return this
	}

	public leftJoin (table: string, firstColumn: string, secondColumnOrOperator: string | "=" | "!=" | ">" | "<", secondColumn?: string) {
		this.joinType("left", table, firstColumn, secondColumnOrOperator, secondColumn)

		return this
	}

	public rightJoin (table: string, firstColumn: string, secondColumnOrOperator: string | "=" | "!=" | ">" | "<", secondColumn?: string) {
		this.joinType("right", table, firstColumn, secondColumnOrOperator, secondColumn)

		return this
	}

	public innerJoin (table: string, firstColumn: string, secondColumnOrOperator: string | "=" | "!=" | ">" | "<", secondColumn?: string) {
		this.joinType("inner", table, firstColumn, secondColumnOrOperator, secondColumn)

		return this
	}
}