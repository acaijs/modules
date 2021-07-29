// Interfaces
import TypedArraySanitize from "./TypedArraySanitize";

type SchemaToTypedSchema<Schema extends Record<string, readonly string[]>> = {
	-readonly [key in keyof Schema]: TypedArraySanitize<Schema[key]>
};

export default SchemaToTypedSchema;
