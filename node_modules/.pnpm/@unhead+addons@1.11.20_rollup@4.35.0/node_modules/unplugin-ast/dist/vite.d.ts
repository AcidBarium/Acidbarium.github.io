import { AST } from './index.js';
import 'unplugin';
import '@antfu/utils';
import './types-CE3pDeiX.js';
import '@babel/types';
import 'magic-string-ast';
import '@babel/parser';
import 'unplugin-utils';

/**
 * This entry file is for Vite plugin.
 *
 * @module
 */

/**
 * Vite plugin
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import AST from 'unplugin-ast/vite'
 *
 * export default defineConfig({
 *   plugins: [AST()],
 * })
 * ```
 */
declare const _default: typeof AST.vite;

export { _default as default };
