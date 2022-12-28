declare module '*.scss' {
    const content: Record<string, string>;
    export default content;
}

declare module "*.png" {}

// declaration.d.ts

declare module "*.svg" {
  import React = require("react");
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement>
  >;
  const src: string;
  export default src;
}

declare module "*.md" {}