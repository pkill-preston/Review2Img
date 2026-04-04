// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	app: {
		head: {
			title: "Storyloggd — Turn Letterboxd Reviews into Story Images",
			meta: [
				{
					name: "description",
					content:
						"Create beautiful, shareable story images from your Letterboxd reviews."
				},

				{property: "og:title", content: "Storyloggd"},
				{
					property: "og:description",
					content: "Turn your Letterboxd reviews into story images."
				},
				{property: "og:type", content: "website"},

				{name: "twitter:card", content: "summary"},
				{name: "twitter:title", content: "Storyloggd"},
				{
					name: "twitter:description",
					content: "Export your Letterboxd reviews as story images."
				}
			]
		},
		pageTransition: {name: "page", mode: "out-in"}
	},
	vite: {
		server: {
			allowedHosts: true
		},
		optimizeDeps: {
			include: [
				"clsx",
				"tailwind-merge",
				"@vue/devtools-core",
				"@vue/devtools-kit",
				"reka-ui",
				"class-variance-authority",
				"@vueuse/core"
			]
		}
	},
	experimental: {
		localLayerAliases: true
	},
	compatibilityDate: "2025-07-15",
	modules: ["@nuxtjs/tailwindcss", "shadcn-nuxt", "@nuxtjs/color-mode"],
	colorMode: {
		classSuffix: ""
	},
	devtools: {enabled: true}
});
