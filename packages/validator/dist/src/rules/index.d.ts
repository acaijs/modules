import RuleInterface from "../interfaces/rule";
export declare function setRule(name: string, rule: RuleInterface): void;
export declare function setRules(rules: Record<string, RuleInterface>): void;
export declare function clearRules(): void;
declare const _default: () => Record<string, RuleInterface>;
export default _default;
