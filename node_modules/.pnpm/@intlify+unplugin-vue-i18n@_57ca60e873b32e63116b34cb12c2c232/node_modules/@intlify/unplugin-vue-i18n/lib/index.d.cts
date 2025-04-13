import { UnpluginFactory, UnpluginInstance } from 'unplugin';
import { PluginOptions } from './types.cjs';
export { SFCLangFormat, VueI18nModule } from './types.cjs';

declare const unpluginFactory: UnpluginFactory<PluginOptions | undefined>;
declare const unplugin: UnpluginInstance<PluginOptions | undefined, boolean>;

export { PluginOptions, unplugin as default, unplugin, unpluginFactory };
