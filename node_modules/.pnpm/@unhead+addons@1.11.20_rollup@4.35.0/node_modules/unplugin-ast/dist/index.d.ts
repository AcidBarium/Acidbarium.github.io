import { UnpluginInstance } from 'unplugin';
import { Arrayable } from '@antfu/utils';
import { T as Transformer } from './types-CE3pDeiX.js';
export { N as NodeRef, a as TransformerParsed } from './types-CE3pDeiX.js';
import { ParserOptions } from '@babel/parser';
import { FilterPattern } from 'unplugin-utils';
import { SourceMap } from 'magic-string-ast';
import '@babel/types';

interface Options {
    include?: FilterPattern;
    exclude?: FilterPattern | undefined;
    enforce?: 'post' | 'pre' | undefined;
    parserOptions?: ParserOptions;
    transformer?: Arrayable<Transformer<any>>;
}
type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;
type OptionsResolved = Overwrite<Required<Options>, {
    exclude: Options['exclude'];
    enforce: Options['enforce'];
    transformer: Transformer<any>[];
}>;
declare function resolveOption(options: Options): OptionsResolved;

declare function transform(code: string, id: string, options: Pick<OptionsResolved, 'parserOptions' | 'transformer'>): Promise<{
    code: string;
    map: SourceMap;
} | undefined>;

declare const AST: UnpluginInstance<Options, false>;

export { AST, type Options, type OptionsResolved, Transformer, resolveOption, transform };
