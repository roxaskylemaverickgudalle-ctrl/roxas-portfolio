import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

const reactRoot = fileURLToPath(new URL("./node_modules/react", import.meta.url));
const reactDomRoot = fileURLToPath(new URL("./node_modules/react-dom", import.meta.url));
const reactJsxRuntime = fileURLToPath(new URL("./node_modules/react/jsx-runtime.js", import.meta.url));
const reactJsxDevRuntime = fileURLToPath(new URL("./node_modules/react/jsx-dev-runtime.js", import.meta.url));

export default defineConfig({
  resolve: {
    alias: [
      { find: "react/jsx-runtime", replacement: reactJsxRuntime },
      { find: "react/jsx-dev-runtime", replacement: reactJsxDevRuntime },
      { find: /^react$/, replacement: reactRoot },
      { find: /^react-dom$/, replacement: reactDomRoot },
    ],
  },
});