import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [],
  // define: {
  //   "import.meta.vitest": false,
  // },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: '47stats-api',
      // the proper extensions will be added
      fileName: 'index',
    },
    rollupOptions: {
      output: {
        exports: "named"
      }
    }
  },
})
