declare type Writable<T extends Record<string, any>> = {
    -readonly [K in keyof T]: T[K];
};
export default Writable;
