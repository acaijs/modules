// Interfaces
import typeMaps from "../classes/queryStrategies/sql/helpers/typeMaps"

// Helpers
import constraintTypes from "./constraintInterfaces"

export default interface ColumnOptions {
	type: keyof typeof typeMaps;
	length?: number | string[];
	autoIncrement?: boolean;
	nullable?: boolean;
	unique?: boolean;
	primary?: boolean;
	default?: unknown;

	foreign?: {
		name?: string;
		table: string;
		column?: string;

		onUpdate?: constraintTypes;
		onDelete?: constraintTypes;
	};
}