'use strict';

const unplugin = require('unplugin');
const index = require('./index.cjs');
require('debug');
require('picocolors');
require('node:path');
require('pathe');
require('@intlify/shared');
require('@intlify/bundle-utils');
require('@rollup/pluginutils');
require('fast-glob');
require('node:fs');
require('vue/compiler-sfc');
require('@intlify/vue-i18n-extensions');
require('@typescript-eslint/scope-manager');
require('@typescript-eslint/typescript-estree');
require('@eslint-community/eslint-utils');

const webpack = unplugin.createWebpackPlugin(index.unpluginFactory);

module.exports = webpack;
