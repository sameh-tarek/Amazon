declare type Options = [
    {
        readonly requireDescription?: boolean;
    }
];
export declare type MessageIds = 'requireLocalizeMetadata';
export declare const RULE_NAME = "require-localize-metadata";
declare const _default: import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<"requireLocalizeMetadata", Options, import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
export default _default;
