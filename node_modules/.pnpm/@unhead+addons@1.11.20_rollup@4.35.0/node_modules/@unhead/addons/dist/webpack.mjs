import { T as TreeshakeServerComposables, U as UseSeoMetaTransform } from './shared/addons.BBC86_qB.mjs';
import 'node:url';
import 'ufo';
import 'unplugin';
import 'unplugin-ast';
import 'node:vm';
import '@unhead/shared';
import 'estree-walker';
import 'magic-string';
import 'mlly';

const webpack = (options = {}) => {
  return [
    TreeshakeServerComposables.webpack({ filter: options.filter, sourcemap: options.sourcemap, ...options.treeshake || {} }),
    UseSeoMetaTransform.webpack({ filter: options.filter, sourcemap: options.sourcemap, ...options.transformSeoMeta || {} })
  ];
};

export { webpack as default };
