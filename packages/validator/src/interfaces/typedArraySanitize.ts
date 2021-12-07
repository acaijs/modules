// Interfaces
import ArrayToType from "./arrayToType"

type TypedArraySanitize<arrayToSanitize extends readonly string[]> = ArrayToType<arrayToSanitize> extends never ? any : ArrayToType<arrayToSanitize>;

export default TypedArraySanitize