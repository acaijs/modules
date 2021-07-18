import queryInterface from "../interface";
import QueryStrategy from "../../../interfaces/queryStrategy";
import { ModelContent } from "../../../interfaces/ModelContent";
import Properties from "./properties";
export default abstract class StaticClass<T = Record<string, ModelContent>> extends Properties<T> {
    static toggleAdapter(adapter: QueryStrategy, settings?: Record<string, ModelContent>): Promise<any>;
    static toggleSettings(settings: Record<string, ModelContent>): Promise<any>;
    static isConnected(): Promise<boolean>;
    static hasErrors(): Promise<any>;
    static close(): Promise<void>;
    static table<model = Record<string, ModelContent>>(table: string): queryInterface<model>;
}
