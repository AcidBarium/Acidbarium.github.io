import { AST } from './index.cjs';
import 'unplugin';
import '@antfu/utils';
import './types-CE3pDeiX.cjs';
import '@babel/types';
import 'magic-string-ast';
import '@babel/parser';
import 'unplugin-utils';

/**
 * This entry file is for Rolldown plugin.
 *
 * @module
 */

/**
 * Rolldown plugin
 *
 * @example
 * ```ts
 * // rolldown.config.js
 * import AST from 'unplugin-ast/rolldown'
 *
 * export default {
 *   plugins: [AST()],
 * }
 * ```
 */
declare const _default: typeof AST.rolldown;

export = _default;
