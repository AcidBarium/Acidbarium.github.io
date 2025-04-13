// src/core/transformers/remove-wrapper-function.ts
import { toArray } from "@antfu/utils";
import { isCallOf, isTaggedFunctionCallOf } from "ast-kit";
function RemoveWrapperFunction(functionNames) {
  return {
    onNode: (node) => isCallOf(node, toArray(functionNames)) || isTaggedFunctionCallOf(node, toArray(functionNames)),
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
export {
  RemoveNode,
  RemoveWrapperFunction
};
