import { AST } from './index.cjs';
import 'unplugin';
import '@antfu/utils';
import './types-CE3pDeiX.cjs';
import '@babel/types';
import 'magic-string-ast';
import '@babel/parser';
import 'unplugin-utils';

/**
 * This entry file is for webpack plugin.
 *
 * @module
 */

/**
 * Webpack plugin
 *
 * @example
 * ```ts
 * // webpack.config.js
 * module.exports = {
 *  plugins: [require('unplugin-ast/webpack')()],
 * }
 * ```
 */
declare const _default: typeof AST.webpack;

export = _default;
