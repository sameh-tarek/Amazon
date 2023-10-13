import type { AST, TmplAstNode } from '@angular-eslint/bundled-angular-compiler';
declare type ASTOrNodeWithParent = (AST | TmplAstNode) & {
    parent?: ASTOrNodeWithParent;
};
export declare function getNearestNodeFrom<T extends ASTOrNodeWithParent>({ parent }: ASTOrNodeWithParent, predicate: (parent: ASTOrNodeWithParent) => parent is T): T | null;
export {};
