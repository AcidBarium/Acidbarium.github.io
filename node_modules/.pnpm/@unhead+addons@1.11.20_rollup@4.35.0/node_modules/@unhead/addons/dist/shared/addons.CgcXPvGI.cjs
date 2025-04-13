'use strict';

const node_url = require('node:url');
const ufo = require('ufo');
const unplugin = require('unplugin');
const unpluginAst = require('unplugin-ast');
const node_vm = require('node:vm');
const shared = require('@unhead/shared');
const estreeWalker = require('estree-walker');
const MagicString = require('magic-string');
const mlly = require('mlly');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

const MagicString__default = /*#__PURE__*/_interopDefaultCompat(MagicString);

function RemoveFunctions(functionNames) {
  return {
    onNode: (node) => node.type === "CallExpression" && node.callee.type === "Identifier" && functionNames.includes(node.callee.name),
    transform() {
      return false;
    }
  };
}
const TreeshakeServerComposables = unplugin.createUnplugin((options = {}) => {
  options.enabled = options.enabled !== void 0 ? options.enabled : true;
  return {
    name: "unhead:remove-server-composables",
    enforce: "post",
    transformInclude(id) {
      if (!options.enabled)
        return false;
      const { pathname, search } = ufo.parseURL(decodeURIComponent(node_url.pathToFileURL(id).href));
      const { type } = ufo.parseQuery(search);
      if (pathname.match(/[\\/]node_modules[\\/]/))
        return false;
      if (options.filter?.include?.some((pattern) => id.match(pattern)))
        return true;
      if (options.filter?.exclude?.some((pattern) => id.match(pattern)))
        return false;
      if (pathname.endsWith(".vue") && (type === "script" || !search))
        return true;
      if (pathname.match(/\.((c|m)?j|t)sx?$/g))
        return true;
      return false;
    },
    async transform(code, id) {
      if (!code.includes("useServerHead") && !code.includes("useServerHeadSafe") && !code.includes("useServerSeoMeta") && !code.includes("useSchemaOrg")) {
        return;
      }
      let transformed;
      try {
        transformed = await unpluginAst.transform(code, id, {
          parserOptions: {},
          transformer: [
            RemoveFunctions([
              "useServerHead",
              "useServerHeadSafe",
              "useServerSeoMeta",
              // plugins
              "useSchemaOrg"
            ])
          ]
        });
      } catch (e) {
      }
      return transformed;
    },
    webpack(ctx) {
      if (ctx.name === "server")
        options.enabled = false;
    },
    vite: {
      apply(config, env) {
        if (env.ssrBuild || env.isSsrBuild) {
          options.enabled = false;
          return true;
        }
        return false;
      }
    }
  };
});

const UseSeoMetaTransform = unplugin.createUnplugin((options = {}) => {
  options.imports = options.imports || true;
  return {
    name: "unhead:use-seo-meta-transform",
    enforce: "post",
    transformInclude(id) {
      const { pathname, search } = ufo.parseURL(decodeURIComponent(node_url.pathToFileURL(id).href));
      const { type } = ufo.parseQuery(search);
      if (pathname.match(/[\\/]node_modules[\\/]/))
        return false;
      if (options.filter?.include?.some((pattern) => id.match(pattern)))
        return true;
      if (options.filter?.exclude?.some((pattern) => id.match(pattern)))
        return false;
      if (pathname.endsWith(".vue") && (type === "script" || !search))
        return true;
      if (pathname.match(/\.((c|m)?j|t)sx?$/g))
        return true;
      return false;
    },
    async transform(code, id) {
      if (!code.includes("useSeoMeta") && !code.includes("useServerSeoMeta"))
        return;
      const packages = ["unhead", "@unhead/vue", "unhead"];
      const statements = mlly.findStaticImports(code).filter((i) => packages.includes(i.specifier));
      const importNames = {};
      for (const i of statements.flatMap((i2) => mlly.parseStaticImport(i2))) {
        if (i.namedImports) {
          for (const key in i.namedImports) {
            if (key === "useSeoMeta" || key === "useServerSeoMeta")
              importNames[i.namedImports[key]] = key;
          }
        }
      }
      const ast = this.parse(code);
      const s = new MagicString__default(code);
      const extraImports = /* @__PURE__ */ new Set();
      estreeWalker.walk(ast, {
        enter(_node) {
          if (options.imports && _node.type === "ImportDeclaration" && packages.includes(_node.source.value)) {
            const node = _node;
            if (
              // @ts-expect-error untyped
              !node.specifiers.some((s2) => s2.type === "ImportSpecifier" && ["useSeoMeta", "useServerSeoMeta"].includes(s2.imported?.name))
            )
              return;
            const imports = Object.values(importNames);
            if (!imports.includes("useHead"))
              extraImports.add(`import { useHead } from '${node.source.value}'`);
            if (!imports.includes("useServerHead") && imports.includes("useServerSeoMeta"))
              extraImports.add(`import { useServerHead } from '${node.source.value}'`);
          } else if (_node.type === "CallExpression" && _node.callee.type === "Identifier" && Object.keys({
            useSeoMeta: "useSeoMeta",
            useServerSeoMeta: "useServerSeoMeta",
            ...importNames
          }).includes(_node.callee.name)) {
            const node = _node;
            const calleeName = importNames[node.callee.name] || node.callee.name;
            const properties = node.arguments[0].properties;
            if (!properties)
              return;
            let output = [];
            const title = properties.find((property) => property.key?.name === "title");
            const titleTemplate = properties.find((property) => property.key?.name === "titleTemplate");
            const meta = properties.filter((property) => property.key?.name !== "title" && property.key?.name !== "titleTemplate");
            if (title || titleTemplate || calleeName === "useSeoMeta") {
              output.push("useHead({");
              if (title) {
                output.push(`  title: ${code.substring(title.value.start, title.value.end)},`);
              }
              if (titleTemplate) {
                output.push(`  titleTemplate: ${code.substring(titleTemplate.value.start, titleTemplate.value.end)},`);
              }
            }
            if (calleeName === "useServerSeoMeta") {
              if (output.length)
                output.push("});");
              output.push("useServerHead({");
            }
            if (meta.length)
              output.push("  meta: [");
            meta.forEach((property) => {
              if (property.type === "SpreadElement") {
                output = false;
                return;
              }
              if (property.key.type !== "Identifier" || !property.value) {
                output = false;
                return;
              }
              if (output === false)
                return;
              const propertyKey = property.key;
              const key = shared.resolveMetaKeyType(propertyKey.name);
              const keyValue = shared.resolveMetaKeyValue(propertyKey.name);
              const valueKey = key === "charset" ? "charset" : "content";
              let value = code.substring(property.value.start, property.value.end);
              if (property.value.type === "ArrayExpression") {
                output = false;
                return;
              } else if (property.value.type === "ObjectExpression") {
                const isStatic = property.value.properties.every((p) => p.value.type === "Literal" && typeof p.value.value === "string");
                if (!isStatic) {
                  output = false;
                  return;
                }
                const context = node_vm.createContext({
                  resolvePackedMetaObjectValue: shared.resolvePackedMetaObjectValue
                });
                const start = property.value.start;
                const end = property.value.end;
                try {
                  value = JSON.stringify(node_vm.runInContext(`resolvePackedMetaObjectValue(${code.slice(start, end)})`, context));
                } catch {
                  output = false;
                  return;
                }
              }
              if (valueKey === "charset")
                output.push(`    { ${key}: ${value} },`);
              else
                output.push(`    { ${key}: '${keyValue}', ${valueKey}: ${value} },`);
            });
            if (output) {
              if (meta.length)
                output.push("  ]");
              output.push("})");
              s.overwrite(node.start, node.end, output.join("\n"));
            }
          }
        }
      });
      if (s.hasChanged()) {
        const prependImports = [...extraImports];
        if (prependImports.length)
          s.prepend(`${prependImports.join("\n")}
`);
        return {
          code: s.toString(),
          map: s.generateMap({ includeContent: true, source: id })
        };
      }
    }
  };
});

exports.TreeshakeServerComposables = TreeshakeServerComposables;
exports.UseSeoMetaTransform = UseSeoMetaTransform;
