import QueryAbstract from "../../../abstractions/builder/index";
import SettingsConfigInterface from "./types";
import strategy from "./strategy";
export default class SqlQuery extends QueryAbstract {
    protected static adapter: strategy;
    protected static settings: SettingsConfigInterface;
}
