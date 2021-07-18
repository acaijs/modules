import { ModelContent } from "../../../interfaces/ModelContent";
import StaticClass from "./static";
export default abstract class DataClass<T = Record<string, ModelContent>> extends StaticClass<T> {
    raw: (query: string, params?: unknown[]) => Promise<any>;
    count: (column?: string | undefined) => Promise<number>;
    avg: (column: string) => Promise<number>;
    sum: (column: string) => Promise<number>;
}
