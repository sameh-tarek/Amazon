declare type Options = [{
    maxComplexity: number;
}];
export declare type MessageIds = 'conditionalComplexity';
export declare const RULE_NAME = "conditional-complexity";
declare const _default: import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"conditionalComplexity", Options, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
export default _default;
