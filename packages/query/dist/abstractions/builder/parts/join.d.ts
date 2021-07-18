import { ModelContent } from "../../../interfaces/ModelContent";
import DataClass from "./data";
export default abstract class JoinClass<T = Record<string, ModelContent>> extends DataClass<T> {
    joinType(type: "inner" | "left" | "right" | "outer", table: string, firstColumn: string, secondColumnOrOperator: string | "=" | "!=" | ">" | "<", secondColumn?: string): this;
    join(table: string, firstColumn: string, secondColumnOrOperator: string | "=" | "!=" | ">" | "<", secondColumn?: string): this;
    leftJoin(table: string, firstColumn: string, secondColumnOrOperator: string | "=" | "!=" | ">" | "<", secondColumn?: string): this;
    rightJoin(table: string, firstColumn: string, secondColumnOrOperator: string | "=" | "!=" | ">" | "<", secondColumn?: string): this;
    innerJoin(table: string, firstColumn: string, secondColumnOrOperator: string | "=" | "!=" | ">" | "<", secondColumn?: string): this;
}
