export default interface QueryPart {
    type: "and" | "or";
    logic: (string | number | unknown | QueryPart)[];
}
