import { defineConfig, mergeConfig } from "vitest/config";
import { loadEnv } from "vite";
import { resolve } from "path";
import viteConfig from "./vite.config.js";

export default defineConfig(({ mode }) => {
  // テストモードを明示的に設定
  const testMode = mode ?? 'test';
  const env = loadEnv(testMode, process.cwd(), '');
  
  return mergeConfig(
    viteConfig,
    defineConfig({
      test: {
        exclude: ["packages/template/*", "node_modules/**"],
        include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        globals: true,
        environment: 'node',
        setupFiles: [resolve(__dirname, 'src/test-setup.ts')]
      },
      define: {
        'import.meta.env.VITE_STATS_API_URL': JSON.stringify(env.VITE_STATS_API_URL),
        'import.meta.env.VITE_STATS_API_KEY': JSON.stringify(env.VITE_STATS_API_KEY),
      }
    })
  );
});
