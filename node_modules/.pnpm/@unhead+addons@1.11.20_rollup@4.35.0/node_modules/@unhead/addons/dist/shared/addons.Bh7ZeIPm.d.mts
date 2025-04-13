interface TreeshakeServerComposablesOptions extends BaseTransformerTypes {
    enabled?: boolean;
}

interface UseSeoMetaTransformOptions extends BaseTransformerTypes {
    imports?: boolean;
}

interface BaseTransformerTypes {
    sourcemap?: boolean;
    filter?: {
        exclude?: RegExp[];
        include?: RegExp[];
    };
}
interface UnpluginOptions extends BaseTransformerTypes {
    treeshake?: TreeshakeServerComposablesOptions;
    transformSeoMeta?: UseSeoMetaTransformOptions;
}

export type { UnpluginOptions as U };
