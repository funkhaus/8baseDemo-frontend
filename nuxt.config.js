export default {
  mode: "universal",

  modules: ["@nuxtjs/apollo"],

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
