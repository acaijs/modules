import StringToType from "./stringToType";
declare type ArrayToType<t extends readonly string[], s extends number[] = []> = t["length"] extends s["length"] ? StringToType<t[s[0]]> : StringToType<t[s[0]]> extends never ? s[0] extends 20 ? StringToType<t[s[0]]> : ArrayToType<t, [s["length"], ...s]> : StringToType<t[s[0]]>;
export default ArrayToType;
