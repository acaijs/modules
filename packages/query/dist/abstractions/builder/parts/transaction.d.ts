import { ModelContent } from "../../../interfaces/ModelContent";
import TableClass from "./table";
export default abstract class TransactionClass<T = Record<string, ModelContent>> extends TableClass<T> {
    transact(callback: (config: any) => Promise<void>): Promise<void>;
    startTransaction(): Promise<void>;
    savepointTransaction(name: string): Promise<void>;
    releaseTransaction(name: string): Promise<void>;
    rollbackTransaction(): Promise<void>;
    commitTransaction(): Promise<void>;
}
