import { defineConfig } from "tsup";

export default defineConfig({
	bundle: false,
	cjsInterop: true,
	clean: true,
	dts: true,
	entry: ["src/**/*.ts", "!src/**/*.test.*", "!src/tests/**"],
	format: "esm",
	outDir: "lib",
	sourcemap: true,
});
