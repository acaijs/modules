import ColumnOptions from "../../../../interfaces/ColumnOptions";
export default function smartUpdate(tableName: string, oldColumns: Record<string, ColumnOptions>, updatedColumns: Record<string, ColumnOptions>): [string, string];
