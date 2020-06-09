export default {
  mode: "universal",
  env: {
    ...process.env
  },

  modules: [
    "@nuxtjs/apollo",
    [
      "nuxt-vuex-localstorage",
      {
        localStorage: ["user", "token"],
        mode: process.env.NODE_ENV === "development" ? "debug" : null
      }
    ]
  ],
  buildModules: ["@nuxtjs/dotenv"],

  apollo: {
    cookieAttributes: {
      expires: 1,
      path: "/",
      secure: false,
      sameSite: "Lax"
    },
    clientConfigs: {
      default: "~/plugins/apollo-config-default.js"
    }
  }
};
