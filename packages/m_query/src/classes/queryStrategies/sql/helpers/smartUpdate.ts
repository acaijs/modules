// Interfaces
import ColumnOptions from "../../../../interfaces/ColumnOptions";

// Utils
import isEquals from "../../../../utils/isEquals";

// Parts
import columnSerialize from "./columnSerialize";

// -------------------------------------------------
// calculate columns
// -------------------------------------------------

function calculateColumns (oldColumns: Record<string, ColumnOptions>, updatedColumns: Record<string, ColumnOptions>) {
	const responseColumns = [] as string[];

	// columns to add
	Object.keys(updatedColumns).forEach((key, index) => {
		if (!oldColumns[key]) {
			const response 	= [] as string[];
			const column 	= updatedColumns[key];

			// column action to insert
			response.push("ADD");
			// column information
			response.push(columnSerialize(key, column)[0]);
			// column position
			response.push(index === 0 ? "FIRST" : `AFTER ${Object.keys(updatedColumns)[index - 1]}`);

			responseColumns.push(response.join(" "));
		}
	});

	// columns to delete
	Object.keys(oldColumns).forEach(key => {
		if (!updatedColumns[key]) {
			const response = [] as string[];

			// column action to delete
			response.push("DROP COLUMN");
			// column name
			response.push(key);

			responseColumns.push(response.join(" "));
		}
	});

	// columns to update
	Object.keys(updatedColumns).forEach(key => {
		if (oldColumns[key]) {
			// diffs
			const { foreign: _1, primary: _3, ...oldData } = oldColumns[key];
			const { foreign: _2, primary: _4, ...newData } = updatedColumns[key];

			// positioning
			const fpos 	= Object.keys(oldColumns).indexOf(key);
			const spos 	= Object.keys(updatedColumns).indexOf(key);
			const pos 	= spos === 0 ? "FIRST" : `AFTER ${Object.keys(updatedColumns)[spos - 1]}`;

			if (!isEquals(oldData, newData) || fpos !== spos) {
				const response 	= [] as string[];
				const column	= updatedColumns[key];

				// drop index if not present anymore
				if (oldData.unique) response.push(`DROP INDEX ${key},`);
				// column action to insert
				response.push("MODIFY COLUMN");
				// column information
				response.push(columnSerialize(key, column)[0]);
				// column position
				if (fpos !== spos && spos + 1 !== Object.keys(updatedColumns).length) response.push(pos);

				responseColumns.push(response.join(" "));
			}
		}
	});

	// update primary key
	const oldkey = Object.keys(oldColumns).find(i => oldColumns[i].primary);
	const newkey = Object.keys(updatedColumns).find(i => updatedColumns[i].primary);
	if (oldkey && newkey && oldkey !== newkey)
		responseColumns.push(`DROP PRIMARY KEY, ADD PRIMARY KEY (${newkey})`);
	else if (oldkey && !newkey)
		responseColumns.push("DROP PRIMARY KEY");
	else if (!oldkey && newkey)
		responseColumns.push(`ADD PRIMARY KEY (${newkey})`);

	return responseColumns;
}

// -------------------------------------------------
// calculate constraints
// -------------------------------------------------

function calculateConstraints (oldColumns: Record<string, ColumnOptions>, updatedColumns: Record<string, ColumnOptions>) {
	const queryPart = [] as string[];

	// constraints to add
	Object.keys(updatedColumns).forEach(key => {
		if (updatedColumns[key] && updatedColumns[key].foreign && (!oldColumns[key] || !oldColumns[key].foreign)) {
			const column 	= updatedColumns[key];
			const foreign 	= column.foreign as Exclude<ColumnOptions["foreign"], undefined>;
			const response	= [] as string[];

			// action
			response.push("ADD");
			// custom defined name
			if (foreign.name) response.push(`CONSTRAINT ${foreign.name}`);
			// table column responsible for the constraint
			response.push(`FOREIGN KEY (${key})`);
			// table that is referenced
			response.push(`REFERENCES ${foreign.table}`);
			// primary key of the table
			response.push(`(${foreign.column || "id"})`);
			// on update event
			if (foreign.onUpdate) response.push(`ON UPDATE ${foreign.onUpdate}`);
			// on delete event
			if (foreign.onDelete) response.push(`ON DELETE ${foreign.onDelete}`);

			queryPart.push(response.join(" "));
		}
	});

	// constraints to delete
	Object.keys(oldColumns).forEach(key => {
		if ((!updatedColumns[key] || !updatedColumns[key].foreign) && oldColumns[key] && oldColumns[key].foreign) {
			queryPart.push(`DROP FOREIGN KEY ${oldColumns[key].foreign?.name}`);
		}
	});

	// constraints to update
	Object.keys(updatedColumns).forEach(key => {
		if (updatedColumns[key] && updatedColumns[key].foreign && oldColumns[key] && oldColumns[key].foreign && !isEquals(updatedColumns[key].foreign, oldColumns[key].foreign)) {
			const column 	= updatedColumns[key];
			const foreign 	= column.foreign as Exclude<ColumnOptions["foreign"], undefined>;
			const response	= [] as string[];

			// remove previous
			response.push(`DROP FOREIGN KEY ${oldColumns[key].foreign?.name},`);
			// action
			response.push("ADD");
			// custom defined name
			if (foreign.name) response.push(`CONSTRAINT ${foreign.name}`);
			// table column responsible for the constraint
			response.push(`FOREIGN KEY (${key})`);
			// table that is referenced
			response.push(`REFERENCES ${foreign.table}`);
			// primary key of the table
			response.push(`(${foreign.column || "id"})`);
			// on update event
			if (foreign.onUpdate) response.push(`ON UPDATE ${foreign.onUpdate}`);
			// on delete event
			if (foreign.onDelete) response.push(`ON DELETE ${foreign.onDelete}`);

			queryPart.push(response.join(" "));
		}
	});

	return queryPart;
}

// -------------------------------------------------
// main method
// -------------------------------------------------

export default function smartUpdate (tableName: string, oldColumns: Record<string, ColumnOptions>, updatedColumns: Record<string, ColumnOptions>) {
	const columns 		= calculateColumns(oldColumns, 		updatedColumns);
	const constraints 	= calculateConstraints(oldColumns, 	updatedColumns);

	// build columns
	const columnQuery = columns.length > 0 ? `ALTER TABLE ${tableName} ${
		columns.filter(i => !!i.trim()).join(", ")
	}`:"";

	// build constraints
	const constraintQuery = constraints.length === 0 ? "":`ALTER TABLE ${tableName} ${
		constraints.join(", ")
	}`;

	return [columnQuery.trim().replace(/ +(?= )/g, ""), constraintQuery.trim().replace(/ +(?= )/g, "")] as [string, string];
}