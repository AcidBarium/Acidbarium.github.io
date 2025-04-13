import * as _unhead_schema from '@unhead/schema';

declare const DefaultCriticalTags: {
    htmlAttrs: {
        lang: string;
    };
    meta: ({
        charset: string;
        name?: undefined;
        content?: undefined;
    } | {
        name: string;
        content: string;
        charset?: undefined;
    })[];
};

interface InferSeoMetaPluginOptions {
    /**
     * Transform the og title.
     *
     * @param title
     */
    ogTitle?: ((title: string) => string);
    /**
     * Transform the og description.
     *
     * @param title
     */
    ogDescription?: ((description: string) => string);
    /**
     * The twitter card to use.
     *
     * @default 'summary_large_image'
     */
    twitterCard?: false | 'summary' | 'summary_large_image' | 'app' | 'player';
}
declare function InferSeoMetaPlugin(options?: InferSeoMetaPluginOptions): _unhead_schema.HeadPluginInput;

export { DefaultCriticalTags, InferSeoMetaPlugin, type InferSeoMetaPluginOptions };
