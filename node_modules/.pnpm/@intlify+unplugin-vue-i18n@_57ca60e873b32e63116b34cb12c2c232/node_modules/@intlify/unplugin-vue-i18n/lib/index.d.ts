import { UnpluginFactory, UnpluginInstance } from 'unplugin';
import { PluginOptions } from './types.js';
export { SFCLangFormat, VueI18nModule } from './types.js';

declare const unpluginFactory: UnpluginFactory<PluginOptions | undefined>;
declare const unplugin: UnpluginInstance<PluginOptions | undefined, boolean>;

export { PluginOptions, unplugin as default, unplugin, unpluginFactory };
