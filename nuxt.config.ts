// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	vite: {
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
	modules: ["@nuxtjs/tailwindcss", "shadcn-nuxt"],
	devtools: {enabled: true}
});
