import { join, resolve } from "node:path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, loadEnv } from "vite";

// https://vitejs.dev/config/
const config = defineConfig(({ mode }) => {
  const { CLIENT_PORT, VITE_SERVER_URL } = loadEnv(
    mode,
    join(process.cwd(), "../../.env"),
    "",
  );

  return {
    plugins: [react()],
    preview: {
      port: Number(CLIENT_PORT),
    },
    resolve: {
      alias: [{ find: "~", replacement: resolve(__dirname, "src") }],
    },
    server: {
      port: Number(CLIENT_PORT),
      proxy: {
        "/api": {
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
          target: VITE_SERVER_URL,
        },
      },
    },
  };
});

export default config;
