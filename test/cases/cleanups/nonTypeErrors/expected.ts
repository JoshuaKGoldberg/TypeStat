// @ts-expect-error -- TODO: This module can only be default-imported using the 'esModuleInterop' flag
import ts from "typescript";
// @ts-expect-error -- TODO: Cannot find module './typestat.json'. Consider using '--resolveJsonModule' to import module with '.json' extension.
import config from "./typestat.json";

(function () {})();
