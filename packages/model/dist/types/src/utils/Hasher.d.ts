export default class Hasher {
    protected value: string;
    protected saltOrRounds: string | number | undefined;
    constructor(value?: string, saltOrRounds?: string);
    hash(value: string): void;
    toString(): string;
    compare(valueToCompare: string): boolean;
}
