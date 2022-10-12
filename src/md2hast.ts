import { all } from "mdast-util-to-hast";
import { defaultSchema } from "hast-util-sanitize";
import gfm from "remark-gfm";
import type { Handlers } from "mdast-util-to-hast";
import md2mdast from "remark-parse";
import mdast2hast from "remark-rehype";
import merge from "lodash/merge.js";
import type { Plugin, PluginTuple } from "unified";
import raw from "rehype-raw";
import sanitize from "rehype-sanitize";

import extensions from "./extensions.js";

const handlers: Handlers = {
  gridcontainer: (h, node) =>
    h(node, "gridcontainer", node.props, all(h, node)),
  grid: (h, node) => h(node, "grid", node.props, all(h, node)),
  banginterpolation: (h, node) => h(node, "banginterpolation", node.props),
  interpolation: (h, node) => h(node, "interpolation", node.props),
};

const flavouredSchema = merge({}, defaultSchema, {
  tagNames: ["gridcontainer", "grid", "banginterpolation", "interpolation"],
  attributes: {
    grid: ["container", "card", "xs", "sm", "md", "lg", "xl"],
    banginterpolation: ["formula"],
    interpolation: ["formula"],
  },
});

const md2hast: Array<Plugin | PluginTuple> = [
  md2mdast,
  gfm,
  extensions,
  [mdast2hast, { allowDangerousHtml: true, handlers }], // @option: allow raw html inside markdown
  raw, // parse raw html into hast
  [sanitize, flavouredSchema],
];

export default md2hast;
