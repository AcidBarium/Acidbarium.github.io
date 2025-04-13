import { AST } from './index.cjs';
import 'unplugin';
import '@antfu/utils';
import './types-CE3pDeiX.cjs';
import '@babel/types';
import 'magic-string-ast';
import '@babel/parser';
import 'unplugin-utils';

/**
 * This entry file is for Rollup plugin.
 *
 * @module
 */

/**
 * Rollup plugin
 *
 * @example
 * ```ts
 * // rollup.config.js
 * import AST from 'unplugin-ast/rollup'
 *
 * export default {
 *   plugins: [AST()],
 * }
 * ```
 */
declare const _default: typeof AST.rollup;

export = _default;
