"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/core/transformers/remove-wrapper-function.ts
var _utils = require('@antfu/utils');
var _astkit = require('ast-kit');
function RemoveWrapperFunction(functionNames) {
  return {
    onNode: (node) => _astkit.isCallOf.call(void 0, node, _utils.toArray.call(void 0, functionNames)) || _astkit.isTaggedFunctionCallOf.call(void 0, node, _utils.toArray.call(void 0, functionNames)),
    transform(node) {
      if (node.type === "TaggedTemplateExpression") return node.quasi;
      return node.arguments[0];
    }
  };
}

// src/core/transformers/remove-node.ts
function RemoveNode(onNode) {
  return {
    onNode,
    transform: () => false
  };
}



exports.RemoveNode = RemoveNode; exports.RemoveWrapperFunction = RemoveWrapperFunction;
