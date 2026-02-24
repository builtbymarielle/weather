import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5200,
    proxy: {
      "/api-osm": {
        target: "https://nominatim.openstreetmap.org",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-osm/, ""),
        headers: {
          "User-Agent": "MyWeatherApp/1.0 (builtbymarielle@gmail.com)",
        },
      },
    },
  },
});
