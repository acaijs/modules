import QueryPart from "../../../interfaces/QueryPart";
import QueryStrategy from "../../../interfaces/queryStrategy";
import GenericModelContent, { ModelContent } from "../../../interfaces/ModelContent";
import JoinClauseInterface from "../../../interfaces/JoinClause";
import QueryComparison from "../../../interfaces/QueryComparison";
export default abstract class Properties<T = Record<string, ModelContent>> {
    protected tableName: string;
    protected queryBuild: QueryPart;
    protected orderByQuery?: {
        order?: "ASC" | "DESC";
        by: string;
    };
    protected offsetQuantity?: number;
    protected limitQuantity?: number;
    protected fieldsList?: string[];
    protected joinList?: JoinClauseInterface;
    protected groupByColumn?: string;
    protected parseResultCache?: (result: any | any[]) => unknown;
    protected static adapter: QueryStrategy;
    protected static settings: Record<string, ModelContent>;
    rawQueryObject: () => QueryPart;
    protected getAdapter(): QueryStrategy;
    protected push(type: "and" | "or", subqueries: unknown[]): void;
    protected buildQueryPart: <ModelConfig = T>(arg1: keyof ModelConfig | [keyof ModelConfig, GenericModelContent, GenericModelContent?][], arg2?: QueryComparison | GenericModelContent, arg3?: GenericModelContent) => [string, string, ModelContent][];
}
