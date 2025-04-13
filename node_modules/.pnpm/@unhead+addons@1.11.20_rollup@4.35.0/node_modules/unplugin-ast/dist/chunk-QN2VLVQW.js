// src/index.ts
import { createUnplugin } from "unplugin";
import { createFilter } from "unplugin-utils";

// src/core/options.ts
import { toArray } from "@antfu/utils";
function resolveOption(options) {
  return {
    include: options.include || [/\.[jt]sx?$/],
    exclude: options.exclude || void 0,
    enforce: options.enforce || void 0,
    parserOptions: options.parserOptions || {},
    transformer: options.transformer ? toArray(options.transformer) : []
  };
}

// src/core/transform.ts
import generate from "@babel/generator";
import { babelParse, getLang, walkASTAsync } from "ast-kit";
import {
  generateTransform,
  MagicStringAST
} from "magic-string-ast";

// src/core/utils.ts
function useNodeRef() {
  const nodeRefs = /* @__PURE__ */ new Map();
  function getNodeRef(node) {
    if (nodeRefs.has(node)) return nodeRefs.get(node);
    const ref = {
      value: node,
      set(node2) {
        this.value = node2;
      }
    };
    nodeRefs.set(node, ref);
    return ref;
  }
  return {
    nodeRefs,
    getNodeRef
  };
}

// src/core/transform.ts
async function getTransformersByFile(transformer, id) {
  const transformers = (await Promise.all(
    transformer.map(async (t) => {
      if (t.transformInclude && !await t.transformInclude(id))
        return void 0;
      return {
        transformer: t,
        nodes: []
      };
    })
  )).filter((t) => !!t);
  return transformers;
}
async function transform(code, id, options) {
  const { getNodeRef } = useNodeRef();
  const transformers = await getTransformersByFile(options.transformer, id);
  if (transformers.length === 0) return;
  const program = babelParse(code, getLang(id), options.parserOptions);
  await walkASTAsync(program, {
    async enter(node, parent, key, index) {
      for (const { transformer, nodes } of transformers) {
        if (transformer.onNode) {
          const bool = await transformer.onNode?.(node, parent, index);
          if (!bool) continue;
        }
        nodes.push(getNodeRef(node));
      }
    }
  });
  const s = new MagicStringAST(code);
  for (const { transformer, nodes } of transformers) {
    for (const node of nodes) {
      const value = node.value;
      if (!value) continue;
      const result = await transformer.transform(value, code, { id });
      if (result) {
        let newAST;
        if (typeof result === "string") {
          s.overwriteNode(value, result);
          newAST = babelParse(`{${result}}`, getLang(id), options.parserOptions).body[0].body[0];
          if (newAST.type === "ExpressionStatement") {
            newAST = newAST.expression;
          }
          newAST.start = value.start;
          newAST.end = value.end;
        } else {
          const generated = (generate.default || generate)(
            result
          );
          let code2 = generated.code;
          if (result.type.endsWith("Expression")) code2 = `(${code2})`;
          s.overwriteNode(value, code2);
          newAST = result;
        }
        node.set(newAST);
      } else if (result === false) {
        node.set(void 0);
        s.removeNode(value);
      }
    }
  }
  for (const { transformer } of transformers) {
    await transformer.finalize?.(s);
  }
  return generateTransform(s, id);
}

// src/index.ts
var AST = createUnplugin(
  (options = {}) => {
    const opt = resolveOption(options);
    const filter = createFilter(opt.include, opt.exclude);
    const name = "unplugin-ast";
    return {
      name,
      enforce: options.enforce,
      transformInclude(id) {
        return filter(id);
      },
      transform(code, id) {
        return transform(code, id, opt);
      }
    };
  }
);

export {
  resolveOption,
  transform,
  AST
};
