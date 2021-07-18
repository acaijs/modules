import ArrayToType from "./arrayToType";
declare type TypedArraySanitize<arrayToSanitize extends readonly string[]> = ArrayToType<arrayToSanitize> extends never ? any : ArrayToType<arrayToSanitize>;
export default TypedArraySanitize;
