// Interfaces
import QueryPart 								from "../../../interfaces/QueryPart"
import QueryStrategy 							from "../../../interfaces/queryStrategy"
import GenericModelContent, { ModelContent } 	from "../../../interfaces/ModelContent"
import JoinClauseInterface 						from "../../../interfaces/JoinClause"
import QueryComparison 							from "../../../interfaces/QueryComparison"

export default abstract class Properties<T = Record<string, ModelContent>> {

	// -------------------------------------------------
	// properties
	// -------------------------------------------------

	protected tableName		= ""
	protected queryBuild	 	 : QueryPart = {type:"or", logic:[]}
	protected orderByQuery  	?: {order?: "ASC" | "DESC"; by: string}
	protected offsetQuantity	?: number
	protected limitQuantity 	?: number
	protected fieldsList		?: string[] = []
	protected joinList			?: JoinClauseInterface
	protected groupByColumn 	?: string
	protected parseResultCache	?: (result: any | any[]) => unknown

	protected static adapter: QueryStrategy
	protected static settings: Record<string, ModelContent>

	// -------------------------------------------------
	// debug methods
	// -------------------------------------------------

	public rawQueryObject = () => {
		return this.queryBuild
	}

	// -------------------------------------------------
	// helper methods
	// -------------------------------------------------

	protected getAdapter () {
		return (this.constructor as unknown as {adapter: QueryStrategy}).adapter
	}

	protected push (type: "and" | "or", subqueries: unknown[]) {
		if (this.queryBuild.logic.length !== 0 && (this.queryBuild as QueryPart).type !== type) {
			for (let i = 0; i < subqueries.length; i ++) {
				(this.queryBuild.logic[this.queryBuild.logic.length - 1] as QueryPart).logic.push(subqueries[i])
			}
		}
		else {
			this.queryBuild.logic.push({
				type: "and",
				logic: subqueries,
			})
		}
	}

	protected buildQueryPart = <ModelConfig = T>(arg1: keyof ModelConfig | [keyof ModelConfig, QueryComparison | GenericModelContent, GenericModelContent?][], arg2?: QueryComparison | GenericModelContent, arg3?: GenericModelContent): [string, string, ModelContent][] => {
		if (typeof arg1 === "string") {
			if (arg3) {
				return [[arg1, arg2 as string, arg3]]
			}
			else {
				return [[arg1, "=", arg2 as string]]
			}
		}

		return (arg1 as unknown as any).reduce((prev: [keyof ModelConfig, QueryComparison, ModelContent][], item: [keyof ModelConfig, QueryComparison, ModelContent]) => {
			const items = this.buildQueryPart(...item)

			items.forEach((v) => prev.push(v as unknown as any))

			return prev
		}, [])
	}
}