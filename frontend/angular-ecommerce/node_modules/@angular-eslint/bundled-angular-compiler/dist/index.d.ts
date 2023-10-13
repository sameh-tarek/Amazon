export * from '@angular/compiler';
import type { MessageBundle, ParsedTemplate } from '@angular/compiler';
export declare type Comment = Required<ParsedTemplate>['commentNodes'][number];
export declare type Message = ReturnType<MessageBundle['getMessages']>[number];
