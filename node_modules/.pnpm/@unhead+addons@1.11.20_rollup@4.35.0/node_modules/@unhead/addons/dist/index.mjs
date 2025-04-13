import { defineHeadPlugin, resolveTitleTemplate } from '@unhead/shared';

const DefaultCriticalTags = {
  htmlAttrs: {
    lang: "en"
  },
  meta: [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" }
  ]
};

// @__NO_SIDE_EFFECTS__
function InferSeoMetaPlugin(options = {}) {
  return defineHeadPlugin({
    hooks: {
      entries: {
        resolve({ entries }) {
          let titleTemplate = null;
          let lastWeight = 999;
          for (const entry of entries) {
            const inputKey = entry.resolvedInput ? "resolvedInput" : "input";
            const input = entry[inputKey];
            const weight = (typeof input.titleTemplate === "object" ? input.titleTemplate?.tagPriority : false) || entry.tagPriority || 100;
            if (input.titleTemplate !== void 0 && weight <= lastWeight) {
              titleTemplate = input.titleTemplate;
              lastWeight = weight;
            }
          }
          for (const entry of entries) {
            const inputKey = entry.resolvedInput ? "resolvedInput" : "input";
            const input = entry[inputKey];
            const resolvedMeta = input.meta || [];
            titleTemplate = resolveTitleTemplate(titleTemplate, input.title);
            const title = input.title;
            const description = resolvedMeta.find((meta) => meta.name === "description")?.content;
            const hasOgTitle = resolvedMeta.some((meta) => meta.property === "og:title");
            const hasOgImage = resolvedMeta.some((meta) => meta.property === "og:image");
            const hasTwitterCard = resolvedMeta.some((meta) => meta.name === "twitter:card");
            const hasOgDescription = resolvedMeta.some((meta) => meta.property === "og:description");
            entry[inputKey].meta = input.meta || [];
            if (!hasOgTitle && (input.titleTemplate || input.title)) {
              let newOgTitle = options?.ogTitle || titleTemplate || input.title;
              if (typeof newOgTitle === "function")
                newOgTitle = newOgTitle(title);
              if (newOgTitle) {
                entry[inputKey].meta.push({
                  property: "og:title",
                  // have the og:title be removed if we don't have a title
                  content: String(newOgTitle)
                });
              }
            }
            if (description && !hasOgDescription) {
              let newOgDescription = options?.ogDescription || description;
              if (typeof newOgDescription === "function")
                newOgDescription = newOgDescription(title);
              if (newOgDescription) {
                entry[inputKey].meta.push({
                  property: "og:description",
                  content: String(newOgDescription)
                });
              }
            }
            if (hasOgImage && !hasTwitterCard) {
              entry[inputKey].meta.push({
                name: "twitter:card",
                content: options?.twitterCard || "summary_large_image"
              });
            }
          }
        }
      }
    }
  });
}

export { DefaultCriticalTags, InferSeoMetaPlugin };
