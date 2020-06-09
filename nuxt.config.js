export default {
  mode: "universal",
  env: {
    ...process.env
  },

  modules: ["@nuxtjs/apollo"],
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
