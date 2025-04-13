import { AST } from './index.js';
import 'unplugin';
import '@antfu/utils';
import './types-CE3pDeiX.js';
import '@babel/types';
import 'magic-string-ast';
import '@babel/parser';
import 'unplugin-utils';

/**
 * This entry file is for esbuild plugin. Requires esbuild >= 0.15
 *
 * @module
 */

/**
 * Esbuild plugin
 *
 * @example
 * ```ts
 * // esbuild.config.js
 * import { build } from 'esbuild'
 *
 * build({
 *   plugins: [require('unplugin-ast/esbuild')()],
 * })
 * ```
 */
declare const _default: typeof AST.esbuild;

export { _default as default };
