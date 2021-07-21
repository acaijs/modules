// Abstractions
import QueryAbstract from "../../../abstractions/builder/index";

// Interfaces
import SettingsConfigInterface 	from "./types"

// Strategy
import strategy from "./strategy";

export default class SqlQuery extends QueryAbstract {
	protected static adapter = new strategy();
	protected static settings: SettingsConfigInterface;
}