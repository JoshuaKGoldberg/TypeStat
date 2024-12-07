// @ts-expect-error -- TODO: Cannot find module './assets/direct.svg' or its corresponding type declarations.
import direct from "./assets/direct.svg";
// @ts-expect-error -- TODO: Cannot find module './assets/direct.svg' or its corresponding type declarations.
export * as direct from "./assets/direct.svg";

// @ts-expect-error -- TODO: Cannot find module './assets/withIndex.module.scss' or its corresponding type declarations.
import * as withIndex from "./assets/withIndex.module.scss";
// @ts-expect-error -- TODO: Cannot find module './assets/withIndex.module.scss' or its corresponding type declarations.
export { withIndex } from "./assets/withIndex.module.scss";

import { foundDirect } from "./foundDirect";
export { foundDirect } from "./foundDirect";

import { foundIndirect } from "./foundIndirect";
export { foundIndirect } from "./foundIndirect";

// @ts-expect-error -- TODO: Cannot find module './notfound' or its corresponding type declarations.
import { notfound } from "./notfound";
// @ts-expect-error -- TODO: Cannot find module './notfound' or its corresponding type declarations.
export { notfound } from "./notfound";
