// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
<<<<<<< HEAD
  devtools: { enabled: true },
  modules: ["@nuxt/ui"],
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ]
})
=======
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
	compatibilityDate: "2025-07-15",
	modules: ["@nuxtjs/tailwindcss", "shadcn-nuxt", "nuxt-og-image"],
	devtools: {enabled: true}
});
>>>>>>> rebase
