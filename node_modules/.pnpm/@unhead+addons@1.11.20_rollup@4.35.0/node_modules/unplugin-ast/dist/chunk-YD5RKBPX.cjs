"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// src/index.ts
var _unplugin = require('unplugin');
var _unpluginutils = require('unplugin-utils');

// src/core/options.ts
var _utils = require('@antfu/utils');
function resolveOption(options) {
  return {
    include: options.include || [/\.[jt]sx?$/],
    exclude: options.exclude || void 0,
    enforce: options.enforce || void 0,
    parserOptions: options.parserOptions || {},
    transformer: options.transformer ? _utils.toArray.call(void 0, options.transformer) : []
  };
}

// src/core/transform.ts
var _generator = require('@babel/generator'); var _generator2 = _interopRequireDefault(_generator);
var _astkit = require('ast-kit');



var _magicstringast = require('magic-string-ast');

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
  const program = _astkit.babelParse.call(void 0, code, _astkit.getLang.call(void 0, id), options.parserOptions);
  await _astkit.walkASTAsync.call(void 0, program, {
    async enter(node, parent, key, index) {
      for (const { transformer, nodes } of transformers) {
        if (transformer.onNode) {
          const bool = await _optionalChain([transformer, 'access', _ => _.onNode, 'optionalCall', _2 => _2(node, parent, index)]);
          if (!bool) continue;
        }
        nodes.push(getNodeRef(node));
      }
    }
  });
  const s = new (0, _magicstringast.MagicStringAST)(code);
  for (const { transformer, nodes } of transformers) {
    for (const node of nodes) {
      const value = node.value;
      if (!value) continue;
      const result = await transformer.transform(value, code, { id });
      if (result) {
        let newAST;
        if (typeof result === "string") {
          s.overwriteNode(value, result);
          newAST = _astkit.babelParse.call(void 0, `{${result}}`, _astkit.getLang.call(void 0, id), options.parserOptions).body[0].body[0];
          if (newAST.type === "ExpressionStatement") {
            newAST = newAST.expression;
          }
          newAST.start = value.start;
          newAST.end = value.end;
        } else {
          const generated = (_generator2.default.default || (0, _generator2.default))(
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
    await _optionalChain([transformer, 'access', _3 => _3.finalize, 'optionalCall', _4 => _4(s)]);
  }
  return _magicstringast.generateTransform.call(void 0, s, id);
}

// src/index.ts
var AST = _unplugin.createUnplugin.call(void 0, 
  (options = {}) => {
    const opt = resolveOption(options);
    const filter = _unpluginutils.createFilter.call(void 0, opt.include, opt.exclude);
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





exports.resolveOption = resolveOption; exports.transform = transform; exports.AST = AST;
