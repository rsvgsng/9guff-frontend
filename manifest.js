export const manifestForPlugIn = {
    registerType: 'prompt',
    includeAssests: ['favicon.ico', "apple-touc-icon.png", "masked-icon.svg"],
    manifest: {
        name: "Confess24",
        short_name: "confess24",
        description: "A platform to confess your feelings anonymously",
        icons: [{
            src: '/logo.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'favicon'
        },
        {
            src: '/logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'favicon'
        },
        {
            src: '/logo.png',
            sizes: '180x180',
            type: 'image/png',
            purpose: 'apple touch icon',
        },
        {
            src: '/logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
        }
        ],
        display: "standalone",
        scope: '/',
        start_url: "/",
        orientation: 'portrait'
    }
}
