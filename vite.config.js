import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5200, // Match the port in your error message
    proxy: {
      // Define a custom path for the proxy
      "/api-osm": {
        target: "https://nominatim.openstreetmap.org",
        changeOrigin: true, // Required for cross-origin targets
        rewrite: (path) => path.replace(/^\/api-osm/, ""), // Strips '/api-osm' before forwarding
        // Nominatim requires a User-Agent or Referer header for identification
        headers: {
          "User-Agent": "MyWeatherApp/1.0 (builtbymarielle@gmail.com)",
        },
      },
    },
  },
});
