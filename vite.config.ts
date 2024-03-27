import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import ClassMangler from 'vite-plugin-class-mangler';
// import { VitePWA } from "vite-plugin-pwa";


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), ClassMangler()


    //   , 
    //   VitePWA({
    //   manifest: {
    //     name: "Confess24",
    //     short_name: "Confess24",
    //     theme_color: "#161415",
    //     background_color: "#161415",
    //     display: "standalone",
    //     start_url: "/",
    //     icons: [
    //       {
    //         src: "/logo.png",
    //         sizes: "192x192",
    //         type: "image/png"
    //       },
    //       {
    //         src: "/logo.png",
    //         sizes: "512x512",
    //         type: "image/png"
    //       }
    //     ]
    //   }
    // })

  ]
})
