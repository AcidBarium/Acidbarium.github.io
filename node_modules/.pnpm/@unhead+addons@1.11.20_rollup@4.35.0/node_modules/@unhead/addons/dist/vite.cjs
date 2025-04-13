'use strict';

const UseSeoMetaTransform = require('./shared/addons.CgcXPvGI.cjs');
require('node:url');
require('ufo');
require('unplugin');
require('unplugin-ast');
require('node:vm');
require('@unhead/shared');
require('estree-walker');
require('magic-string');
require('mlly');

const vite = (options = {}) => {
  return [
    UseSeoMetaTransform.TreeshakeServerComposables.vite({ filter: options.filter, sourcemap: options.sourcemap, ...options.treeshake }),
    UseSeoMetaTransform.UseSeoMetaTransform.vite({ filter: options.filter, sourcemap: options.sourcemap, ...options.transformSeoMeta })
  ];
};

module.exports = vite;
