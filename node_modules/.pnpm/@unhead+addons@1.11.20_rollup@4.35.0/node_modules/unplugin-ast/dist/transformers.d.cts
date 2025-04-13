import { Arrayable, Awaitable } from '@antfu/utils';
import { T as Transformer } from './types-CE3pDeiX.cjs';
import { CallExpression, TaggedTemplateExpression, Node } from '@babel/types';
import 'magic-string-ast';

/**
 * Removes wrapper function. e.g `defineComponent`, `defineConfig`...
 * @param functionNames - function names to remove
 * @returns Transformer
 */
declare function RemoveWrapperFunction(functionNames: Arrayable<string>): Transformer<CallExpression | TaggedTemplateExpression>;

/**
 * Removes arbitrary nodes.
 * @returns Transformer
 */
declare function RemoveNode(onNode: (node: Node, parent: Node | null | undefined, index: number | null | undefined) => Awaitable<boolean>): Transformer;

export { RemoveNode, RemoveWrapperFunction };
