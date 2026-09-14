import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    mockReset: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      // all + include: report every src file, not just ones a test loaded
      all: true,
      include: ["src/**/*.ts"],
      // main.ts is thin wiring, covered by the integration CI job instead
      exclude: ["src/main.ts"],
      // Set to what the current test suite actually covers, so the gate can
      // only be raised, never silently regressed. Remove to stop enforcing
      // coverage (also revert ci.yml's pnpm coverage -> pnpm test)
      thresholds: {
        lines: 25,
        branches: 25,
        functions: 28,
        statements: 25,
      },
    },
  },
});
