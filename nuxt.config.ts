import * as fs from "fs"

const storage = fs.realpathSync('.').toString() + '/storage'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ["@stefanobartoletti/nuxt-social-share",'nuxt-file-storage'],
  fileStorage: {
    mount: storage,
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ]
})