// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import svgr from 'vite-plugin-svgr';

// export default defineConfig({
//   plugins: [
//     react(),
//     svgr({ svgrOptions: { icon: true } })
//   ],
//   server: {
//     host: '0.0.0.0',
//   },

// })

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import mkcert from "vite-plugin-mkcert";

export default defineConfig({
  plugins: [
    react(),
    svgr({ svgrOptions: { icon: true } }),
    mkcert(),
  ],
  server: {
    host: '0.0.0.0',   // required for mobile access
    https: true,     // required for camera
    port: 5173,
  },
});
