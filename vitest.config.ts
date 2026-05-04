import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		clearMocks: true,
		coverage: {
			exclude: ["src/tests/**", "src/**/*.test.ts"],
			include: ["src/**/*.{ts,tsx}"],
			reporter: ["html", "lcov"],
		},
		exclude: ["lib", "node_modules"],
		setupFiles: ["console-fail-test/setup"],
	},
});
