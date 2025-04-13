import { createVitePlugin } from 'unplugin';
import { unpluginFactory } from './index.mjs';
import 'debug';
import 'picocolors';
import 'node:path';
import 'pathe';
import '@intlify/shared';
import '@intlify/bundle-utils';
import '@rollup/pluginutils';
import 'fast-glob';
import 'node:fs';
import 'vue/compiler-sfc';
import '@intlify/vue-i18n-extensions';
import '@typescript-eslint/scope-manager';
import '@typescript-eslint/typescript-estree';
import '@eslint-community/eslint-utils';

const vite = createVitePlugin(unpluginFactory);

export { vite as default };
