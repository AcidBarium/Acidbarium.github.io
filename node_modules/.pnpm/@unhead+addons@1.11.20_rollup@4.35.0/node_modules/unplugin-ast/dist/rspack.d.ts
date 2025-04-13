import { AST } from './index.js';
import 'unplugin';
import '@antfu/utils';
import './types-CE3pDeiX.js';
import '@babel/types';
import 'magic-string-ast';
import '@babel/parser';
import 'unplugin-utils';

/**
 * This entry file is for Rspack plugin.
 *
 * @module
 */

/**
 * Rspack plugin
 *
 * @example
 * ```ts
 * // rspack.config.js
 * module.exports = {
 *  plugins: [require('unplugin-ast/rspack')()],
 * }
 * ```
 */
declare const _default: typeof AST.rspack;

export { _default as default };
